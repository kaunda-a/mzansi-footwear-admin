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

    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    if (!categories) return error500("Categories not found");
    return success200({ categories });
  } catch (error: any) {
    return error500("Internal Server Error");
  }
}
