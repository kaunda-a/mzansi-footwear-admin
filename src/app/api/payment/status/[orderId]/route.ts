import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { error401, error404, error500, success200 } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    const { orderId } = params;

    // Get order with payment details
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        Payment: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return error404("Order not found", {});
    }

    // Check if order belongs to user (for customer orders) or user is admin
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";
    if (!isAdmin && order.userId !== session.user.id) {
      return error401("Unauthorized to access this order");
    }

    const payment = order.Payment;

    return success200({
      orderId: order.id,
      orderStatus: order.status,
      paymentVerified: order.payment_verified,
      total: order.total,
      payment: payment ? {
        id: payment.id,
        status: payment.status,
        method: payment.method,
        via: payment.via,
        gateway_name: payment.gateway_name,
        gateway_order_id: payment.gateway_order_id,
        gateway_payment_id: payment.gateway_payment_id,
        amount: payment.amount,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      } : null,
      customer: {
        name: order.User?.name,
        email: order.User?.email,
      },
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return error500({});
  }
}
