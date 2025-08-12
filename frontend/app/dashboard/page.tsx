import MainLayout from "@/components/layouts/main-layout";
import DashboardClient from "@/components/page-clients/dashboard-client";

export const metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <MainLayout>
      <DashboardClient />
    </MainLayout>
  );
}
