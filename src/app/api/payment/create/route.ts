import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { paymentManager } from "@/lib/payment-gateways/manager";
import { error401, error404, error500, success200 } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    const { orderId, gateway } = await req.json();

    if (!orderId) {
      return error400("Order ID is required");
    }

    // Get order details
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        User: true,
        OrderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return error404("Order not found");
    }

    // Check if order belongs to user (for customer orders) or user is admin
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";
    if (!isAdmin && order.userId !== session.user.id) {
      return error401("Unauthorized to access this order");
    }

    // Check if order is already paid
    if (order.payment_verified) {
      return error400("Order is already paid");
    }

    // Create or update payment record
    let payment = await db.payment.findFirst({
      where: { orderId: order.id },
    });

    if (!payment) {
      payment = await db.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          method: "payfast",
          via: "online",
          gateway_name: "payfast",
        },
      });
    }

    // Create payment request
    const paymentRequest = {
      orderId: order.id,
      amount: order.total,
      currency: 'ZAR',
      customerName: order.User?.name || "Customer",
      customerEmail: order.User?.email || order.email || "",
      customerPhone: order.User?.phone || undefined,
      description: `Order containing ${order.OrderItem.length} items`,
      metadata: {
        userId: order.userId,
        orderDate: order.orderDate.toISOString(),
        itemCount: order.OrderItem.length
      }
    };

    // Create payment with specified gateway or fallback
    const paymentResult = await paymentManager.createPaymentWithFallback(
      paymentRequest,
      gateway
    );

    if (!paymentResult.success) {
      return error500({ error: paymentResult.error });
    }

    // Update payment record with gateway details
    await db.payment.update({
      where: { id: payment.id },
      data: {
        gateway_order_id: paymentResult.gatewayOrderId || order.id,
        gateway_payment_id: paymentResult.paymentId,
        gateway_name: paymentResult.gatewayUsed || gateway || 'unknown',
        status: "pending",
      },
    });

    return success200({
      paymentUrl: paymentResult.paymentUrl,
      paymentId: payment.id,
      gatewayPaymentId: paymentResult.paymentId,
      gatewayUsed: paymentResult.gatewayUsed,
      orderId: order.id,
      amount: order.total,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return error500({});
  }
}

function error400(message: string) {
  return new Response(
    JSON.stringify({
      success: false,
      message,
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
}
