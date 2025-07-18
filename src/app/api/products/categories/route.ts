import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  error400,
  error401,
  error403,
  error500,
  success200,
} from "@/lib/utils";
import { ZodCategorySchema } from "@/lib/zod-schemas/schema";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            Product: true,
          },
        },
      },
    });

    return success200({
      categories: categories.map((category: any) => ({
        ...category,
        _count: category._count.Product,
      })),
    });
  } catch (error: any) {
    return error500("Internal Server Error");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    if (session.user.role !== "SUPERADMIN") {
      return error403("Forbidden");
    }

    const data: z.infer<typeof ZodCategorySchema> = await req.json();
    if (!data) {
      return error400("Invalid data format.");
    }
    const result = ZodCategorySchema.safeParse(data);

    if (result.success) {
      await db.category.create({
        data: {
          name: data.category,
          parentId: data.parentId === "" ? null : Number(data.parentId),
        },
      });
      return success200({});
    }
    if (result.error) {
      return error400("Invalid data format.");
    }
  } catch (error: any) {
    return error500("Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    if (session.user.role !== "SUPERADMIN") {
      return error403("Forbidden");
    }

    const cid = req.nextUrl.searchParams.get("cid");
    if (!cid) {
      return error400("Invalid data format.");
    }

    await db.category.delete({
      where: {
        id: Number(cid),
      },
    });

    return success200({});
  } catch (error: any) {
    console.log(error);
    return error500("Internal Server Error");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    if (session.user.role !== "SUPERADMIN") {
      return error403("Forbidden");
    }

    const data:
      | {
          id: number;
          values: z.infer<typeof ZodCategorySchema>;
        }
      | undefined = await req.json();
    if (!data) {
      return error400("Invalid data format.");
    }
    const result = ZodCategorySchema.safeParse(data.values);

    if (result.success) {
      await db.category.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.values.category,
          parentId: data.values.parentId === "" ? null : Number(data.values.parentId),
        },
      });

      return success200({ id: data.id, ...data.values });
    }
  } catch (error: any) {
    return error500("Internal Server Error");
  }
}
