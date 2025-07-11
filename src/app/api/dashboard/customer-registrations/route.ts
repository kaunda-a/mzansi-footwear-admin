import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { error401, error500, success200 } from "@/lib/utils";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "weekly";

    let groupBy: string;
    let dateFormat: string;
    let dateRange: Date;

    const now = new Date();

    switch (period) {
      case "weekly":
        // Last 7 days
        groupBy = "DATE(\"createdAt\")";
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        // Last 12 months
        groupBy = "TO_CHAR(\"createdAt\", 'YYYY-MM')";
        dateRange = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      case "yearly":
        // Last 5 years
        groupBy = "EXTRACT(YEAR FROM \"createdAt\")";
        dateRange = new Date(now.getFullYear() - 5, 0, 1);
        break;
      default:
        groupBy = "DATE(\"createdAt\")";
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get customer registrations grouped by time period
    const registrations = await db.$queryRaw`
      SELECT
        ${groupBy}::text as period,
        COUNT(*)::int as count
      FROM "User"
      WHERE "createdAt" >= ${dateRange}
      GROUP BY ${groupBy}
      ORDER BY period ASC
    ` as Array<{ period: string; count: number }>;

    // Transform the data to the expected format
    const transformedData = registrations.map((item) => ({
      name: item.period,
      uv: item.count,
    }));

    // Fill in missing periods with 0 values
    const filledData = fillMissingPeriods(transformedData, period, dateRange, now);

    return success200({
      registrationData: filledData,
      period,
      totalRegistrations: filledData.reduce((sum, item) => sum + item.uv, 0),
    });
  } catch (error) {
    console.error("Customer registrations API error:", error);
    return error500({});
  }
}

function fillMissingPeriods(
  data: Array<{ name: string; uv: number }>,
  period: string,
  startDate: Date,
  endDate: Date
): Array<{ name: string; uv: number }> {
  const result: Array<{ name: string; uv: number }> = [];
  const dataMap = new Map(data.map(item => [item.name, item.uv]));

  if (period === "weekly") {
    // Fill last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      result.push({
        name: dateStr,
        uv: dataMap.get(dateStr) || 0,
      });
    }
  } else if (period === "monthly") {
    // Fill last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      result.push({
        name: monthStr,
        uv: dataMap.get(monthStr) || 0,
      });
    }
  } else if (period === "yearly") {
    // Fill last 5 years
    for (let i = 4; i >= 0; i--) {
      const year = endDate.getFullYear() - i;
      const yearStr = year.toString();
      result.push({
        name: yearStr,
        uv: dataMap.get(yearStr) || 0,
      });
    }
  }

  return result;
}
