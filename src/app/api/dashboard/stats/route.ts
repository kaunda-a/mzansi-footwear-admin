import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { error401, error500, success200 } from "@/lib/utils";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    // Get real dashboard statistics from database
    const [
      pendingOrdersCount,
      totalRevenue,
      pendingRevenue,
      totalCustomers,
      totalSales,
      recentOrders,
    ] = await Promise.all([
      // Pending orders count
      db.order.count({
        where: {
          status: "pending",
        },
      }),

      // Total revenue from completed orders
      db.order.aggregate({
        where: {
          payment_verified: true,
          status: {
            in: ["delivered", "ongoing"],
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Pending revenue from pending orders
      db.order.aggregate({
        where: {
          status: "pending",
        },
        _sum: {
          total: true,
        },
      }),

      // Total customers count
      db.user.count(),

      // Total sales count (completed orders)
      db.order.count({
        where: {
          payment_verified: true,
          status: {
            in: ["delivered", "ongoing"],
          },
        },
      }),

      // Recent orders for percentage calculation
      db.order.findMany({
        where: {
          orderDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        select: {
          total: true,
          orderDate: true,
          payment_verified: true,
          status: true,
        },
        orderBy: {
          orderDate: "desc",
        },
      }),
    ]);

    // Calculate percentage changes (comparing last 15 days vs previous 15 days)
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentRevenue = recentOrders
      .filter(
        (order: any) =>
          order.orderDate >= fifteenDaysAgo && order.payment_verified,
      )
      .reduce((sum: any, order: any) => sum + order.total, 0);

    const previousRevenue = recentOrders
      .filter(
        (order: any) =>
          order.orderDate >= thirtyDaysAgo &&
          order.orderDate < fifteenDaysAgo &&
          order.payment_verified,
      )
      .reduce((sum: any, order: any) => sum + order.total, 0);

    const revenuePercentageChange =
      previousRevenue > 0
        ? Math.round(((recentRevenue - previousRevenue) / previousRevenue) * 100)
        : 0;

    // Calculate customer growth percentage
    const recentCustomers = await db.user.count({
      where: {
        createdAt: {
          gte: fifteenDaysAgo,
        },
      },
    });

    const previousCustomers = await db.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
          lt: fifteenDaysAgo,
        },
      },
    });

    const customerPercentageChange =
      previousCustomers > 0
        ? Math.round(((recentCustomers - previousCustomers) / previousCustomers) * 100)
        : 0;

    // Calculate sales growth percentage
    const recentSalesCount = recentOrders.filter(
      (order: any) =>
        order.orderDate >= fifteenDaysAgo &&
        order.payment_verified &&
        ["delivered", "ongoing"].includes(order.status),
    ).length;

    const previousSalesCount = recentOrders.filter(
      (order: any) =>
        order.orderDate >= thirtyDaysAgo &&
        order.orderDate < fifteenDaysAgo &&
        order.payment_verified &&
        ["delivered", "ongoing"].includes(order.status),
    ).length;

    const salesPercentageChange =
      previousSalesCount > 0
        ? Math.round(((recentSalesCount - previousSalesCount) / previousSalesCount) * 100)
        : 0;

    return success200({
      stats: {
        pendingOrders: {
          value: pendingOrdersCount,
          percentage: null, // No percentage for pending orders
        },
        totalRevenue: {
          value: totalRevenue._sum.total || 0,
          percentage: {
            increased: revenuePercentageChange >= 0,
            value: Math.abs(revenuePercentageChange),
          },
        },
        pendingRevenue: {
          value: pendingRevenue._sum.total || 0,
          percentage: null, // No percentage calculation for pending revenue
        },
        totalCustomers: {
          value: totalCustomers,
          percentage: {
            increased: customerPercentageChange >= 0,
            value: Math.abs(customerPercentageChange),
          },
        },
        totalSales: {
          value: totalSales,
          percentage: {
            increased: salesPercentageChange >= 0,
            value: Math.abs(salesPercentageChange),
          },
        },
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return error500("Internal Server Error");
  }
}
