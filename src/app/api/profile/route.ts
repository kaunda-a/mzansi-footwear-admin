import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { error401, error403, error500, success200 } from "@/lib/utils";
import { ZodProfileSchema } from "@/lib/zod-schemas/schema";
import { getServerSession } from "next-auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return error401("Unauthorized");
    if (session.user.role === "GUEST")
      return error403();

    const body = await req.json();
    const { name, image } = ZodProfileSchema.parse(body);

    const admin = await db.admin.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        image,
      },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return success200({
      message: "Profile updated successfully",
      data: admin,
    });
  } catch (error) {
    return error500({
      error,
      message: "Error in updating profile!",
    });
  }
}