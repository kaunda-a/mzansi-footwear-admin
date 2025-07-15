import { authOptions } from "@/lib/auth";
import { error401, error500, success200 } from "@/lib/utils";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    // Return static list of supported gateways for admin reference only
    const supportedGateways = [
      { name: "PayFast", status: "configured" },
      { name: "PayGate", status: "configured" },
      { name: "Yoco", status: "configured" },
      { name: "Peach", status: "configured" }
    ];

    return success200({
      gateways: supportedGateways,
      count: supportedGateways.length,
      note: "Payment processing handled by frontend application"
    });
  } catch (error) {
    console.error("Get payment gateways error:", error);
    return error500({});
  }
}
