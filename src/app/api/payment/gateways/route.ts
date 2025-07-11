import { authOptions } from "@/lib/auth";
import { paymentManager } from "@/lib/payment-gateways/manager";
import { error401, error500, success200 } from "@/lib/utils";
import { getServerSession } from "next-auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return error401("Unauthorized");
    }

    // Get available payment gateways
    const gateways = paymentManager.getAvailableGateways();

    return success200({
      gateways,
      count: gateways.length,
      primary: gateways[0]?.name || null
    });
  } catch (error) {
    console.error("Get payment gateways error:", error);
    return error500({});
  }
}
