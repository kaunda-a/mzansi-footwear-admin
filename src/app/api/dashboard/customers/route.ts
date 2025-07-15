import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { error401, error500, success200, formateDate } from "@/lib/utils";
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
    const type = searchParams.get("type") || "top"; // top, registrations

    if (type === "top") {
      // Get top customers by total spending
      const topCustomers = await db.user.findMany({
        include: {
          Order: {
            where: {
              payment_verified: true,
              status: {
                in: ["delivered", "ongoing"],
              },
            },
            select: {
              total: true,
              orderDate: true,
            },
          },
          _count: {
            select: {
              Order: {
                where: {
                  payment_verified: true,
                  status: {
                    in: ["delivered", "ongoing"],
                  },
                },
              },
            },
          },
        },
      });

      // Calculate spending and format data
      const customersWithSpending = topCustomers
        .map((customer: any) => {
          const totalSpent = customer.Order.reduce(
            (sum: any, order: any) => sum + order.total,
            0,
          );
          const lastOrder = customer.Order.sort(
            (a: any, b: any) => b.orderDate.getTime() - a.orderDate.getTime(),
          )[0];

          return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            image: customer.image || `https://i.pravatar.cc/150?u=${customer.email}`,
            amountSpent: totalSpent,
            purchases: customer._count.Order,
            lastPurchase: lastOrder
              ? formatTimeDifference(lastOrder.orderDate)
              : "Never",
          };
        })
        .filter((customer: any) => customer.amountSpent > 0) // Only customers who have made purchases
        .sort((a: any, b: any) => b.amountSpent - a.amountSpent) // Sort by spending
        .slice(0, 10); // Top 10 customers

      return success200({
        topCustomers: customersWithSpending,
      });
    } else if (type === "registrations") {
      // Get customer registration data
      const { searchParams } = new URL(req.url);
      const period = searchParams.get("period") || "weekly";

      let startDate: Date;
      const now = new Date();

      switch (period) {
        case "weekly":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "yearly":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const registrations = await db.user.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Group registrations by period
      let registrationData: { name: string; uv: number; amt: number }[] = [];

      if (period === "weekly") {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dailyRegistrations = new Array(7).fill(0);

        registrations.forEach((reg: any) => {
          const dayIndex = reg.createdAt.getDay();
          dailyRegistrations[dayIndex]++;
        });

        registrationData = dayNames.map((day, index) => ({
          name: day,
          uv: dailyRegistrations[index],
          amt: dailyRegistrations[index] * 100, // Dummy amt value for chart
        }));
      } else if (period === "monthly") {
        const weeklyRegistrations: { [key: string]: number } = {};

        registrations.forEach((reg: any) => {
          const weekNumber = Math.ceil(reg.createdAt.getDate() / 7);
          const weekKey = `Week ${weekNumber}`;
          weeklyRegistrations[weekKey] = (weeklyRegistrations[weekKey] || 0) + 1;
        });

        registrationData = Object.entries(weeklyRegistrations).map(([week, count]) => ({
          name: week,
          uv: count,
          amt: count * 100,
        }));

        // Ensure we have data for all weeks
        for (let i = 1; i <= 5; i++) {
          const weekKey = `Week ${i}`;
          if (!weeklyRegistrations[weekKey]) {
            registrationData.push({ name: weekKey, uv: 0, amt: 0 });
          }
        }

        registrationData.sort((a, b) => {
          const weekA = parseInt(a.name.split(" ")[1]);
          const weekB = parseInt(b.name.split(" ")[1]);
          return weekA - weekB;
        });
      } else if (period === "yearly") {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const monthlyRegistrations = new Array(12).fill(0);

        registrations.forEach((reg: any) => {
          const monthIndex = reg.createdAt.getMonth();
          monthlyRegistrations[monthIndex]++;
        });

        registrationData = monthNames.map((month, index) => ({
          name: month,
          uv: monthlyRegistrations[index],
          amt: monthlyRegistrations[index] * 100,
        }));
      }

      return success200({
        registrationData,
        period,
        totalRegistrations: registrations.length,
      });
    }

    return error500({});
  } catch (error: any) {
    console.error("Customer analytics error:", error);
    return error500({});
  }
}

// Helper function to format time difference
function formatTimeDifference(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
}
