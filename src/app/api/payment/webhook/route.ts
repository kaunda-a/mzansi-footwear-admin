import { db } from "@/lib/prisma";
import { paymentManager } from "@/lib/payment-gateways/manager";
import { PaymentStatus } from "@/lib/payment-gateways/types";
import { error400, error500, success200 } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { gateway: string } }) {
  try {
    const gatewayName = params.gateway;

    if (!gatewayName) {
      return error400("Gateway name is required", {});
    }

    // Parse webhook data based on content type
    let webhookData: any;
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      webhookData = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      webhookData = {};
      formData.forEach((value, key) => {
        webhookData[key] = value.toString();
      });
    } else {
      webhookData = await req.text();
    }

    console.log(`${gatewayName} webhook received:`, webhookData);

    // Process webhook with payment manager
    const notification = await paymentManager.processWebhook(gatewayName, {
      body: webhookData,
      headers: Object.fromEntries(req.headers.entries())
    });

    if (!notification) {
      return error400("Failed to process webhook notification", {});
    }

    // Find the order and payment
    const order = await db.order.findUnique({
      where: { id: notification.orderId },
      include: {
        Payment: true,
      },
    });

    if (!order) {
      console.error("Order not found:", notification.orderId);
      return error400("Order not found", {});
    }

    const payment = order.Payment;
    if (!payment) {
      console.error("Payment record not found for order:", notification.orderId);
      return error400("Payment record not found", {});
    }

    // Update payment record based on status
    const statusMap: Record<PaymentStatus, string> = {
      [PaymentStatus.COMPLETED]: "completed",
      [PaymentStatus.FAILED]: "failed",
      [PaymentStatus.CANCELLED]: "cancelled",
      [PaymentStatus.PENDING]: "pending",
      [PaymentStatus.REFUNDED]: "refunded",
      [PaymentStatus.PARTIALLY_REFUNDED]: "partially_refunded"
    };

    await db.payment.update({
      where: { id: payment.id },
      data: {
        gateway_payment_id: notification.gatewayPaymentId,
        status: statusMap[notification.status] || "pending",
        amount: notification.amount,
      },
    });

    // Update order status for completed payments
    if (notification.status === PaymentStatus.COMPLETED) {
      await db.order.update({
        where: { id: order.id },
        data: {
          payment_verified: true,
          status: "ongoing",
        },
      });
      console.log("Payment completed for order:", order.id);
    } else {
      console.log(`Payment ${notification.status} for order:`, order.id);
    }

    // Log the notification for audit purposes
    await db.paymentLog.create({
      data: {
        paymentId: payment.id,
        event: notification.status,
        data: JSON.stringify(notification),
        createdAt: new Date(),
      },
    }).catch((error) => {
      // PaymentLog table might not exist, log error but don't fail
      console.warn("Could not create payment log:", error.message);
    });

    return success200({ message: "Notification processed successfully" });
  } catch (error) {
    console.error("PayFast webhook error:", error);
    return error500({});
  }
}

// PayFast sends GET requests to verify the endpoint
export async function GET() {
  return success200({ message: "PayFast webhook endpoint is active" });
}
