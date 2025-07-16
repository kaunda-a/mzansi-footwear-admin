import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { error401, error500, success200 } from "@/lib/utils";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "weekly"; // weekly, monthly, yearly

    let startDate: Date;
    let groupBy: string;
    let dateFormat: string;

    const now = new Date();

    switch (period) {
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = "day";
        dateFormat = "day";
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupBy = "week";
        dateFormat = "week";
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = "month";
        dateFormat = "month";
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = "day";
        dateFormat = "day";
    }

    // Get orders within the specified period
    const orders = await db.order.findMany({
      where: {
        orderDate: {
          gte: startDate,
        },
        payment_verified: true,
        status: {
          in: ["delivered", "ongoing"],
        },
      },
      select: {
        total: true,
        orderDate: true,
      },
      orderBy: {
        orderDate: "asc",
      },
    });

    // Group data based on period
    let revenueData: { name: string; total: number }[] = [];

    if (period === "weekly") {
      // Group by days of the week
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dailyRevenue = new Array(7).fill(0);

      orders.forEach((order: any ) => {
        const dayIndex = order.orderDate.getDay();
        dailyRevenue[dayIndex] += order.total;
      });

      revenueData = dayNames.map((day, index) => ({
        name: day,
        total: Math.round(dailyRevenue[index]),
      }));
    } else if (period === "monthly") {
      // Group by weeks in the current month
      const weeklyRevenue: { [key: string]: number } = {};
      
      orders.forEach((order: any) => {
        const weekNumber = Math.ceil(order.orderDate.getDate() / 7);
        const weekKey = `Week ${weekNumber}`;
        weeklyRevenue[weekKey] = (weeklyRevenue[weekKey] || 0) + order.total;
      });

      revenueData = Object.entries(weeklyRevenue).map(([week, total]) => ({
        name: week,
        total: Math.round(total),
      }));

      // Ensure we have data for all weeks
      for (let i = 1; i <= 5; i++) {
        const weekKey = `Week ${i}`;
        if (!weeklyRevenue[weekKey]) {
          revenueData.push({ name: weekKey, total: 0 });
        }
      }

      revenueData.sort((a, b) => {
        const weekA = parseInt(a.name.split(" ")[1]);
        const weekB = parseInt(b.name.split(" ")[1]);
        return weekA - weekB;
      });
    } else if (period === "yearly") {
      // Group by months
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const monthlyRevenue = new Array(12).fill(0);

      orders.forEach((order: any) => {
        const monthIndex = order.orderDate.getMonth();
        monthlyRevenue[monthIndex] += order.total;
      });

      revenueData = monthNames.map((month, index) => ({
        name: month,
        total: Math.round(monthlyRevenue[index]),
      }));
    }

    return success200({
      revenueData,
      period,
      totalRevenue: orders.reduce((sum: any, order: any) => sum + order.total, 0),
      orderCount: orders.length,
    });
  } catch (error: any) {
    console.error("Revenue data error:", error);
    return error500("Internal Server Error");
  }
}
