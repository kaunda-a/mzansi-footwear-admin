import CustomerOrder from "@/components/customers/tables/customer-order";
import Nav from "@/components/nav/nav";
import { dehydrate } from "@tanstack/query-core";
import Hydrate from "@/lib/query-utils/hydrate-client";
import { QueryClient } from "@tanstack/react-query";
import { getCustomerOrdersServer } from "@/lib/api/customers/get-customer-orders";

const Customer = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const resolvedParams = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["orders", "customerId"],
    queryFn: () => getCustomerOrdersServer(resolvedParams.userId),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Nav>
      <div className="@container">
        <Hydrate state={dehydratedState}>
          <CustomerOrder customerId={resolvedParams.userId} />
        </Hydrate>
      </div>
    </Nav>
  );
};

export default Customer;
