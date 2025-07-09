import Nav from "@/components/nav/nav";
import DashboardClient from "@/components/dashboard/dashboard-client";

export default async function Home() {
  return (
    <Nav>
      <DashboardClient />
    </Nav>
  );
}
