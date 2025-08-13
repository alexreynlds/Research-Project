import MainLayout from "@/components/layouts/main-layout";
import AdminClient from "@/components/page-clients/admin-client";

export const metadata = {
  title: "Dashboard",
};

export default function Page() {
  return (
    <MainLayout>
      <AdminClient />
    </MainLayout>
  );
}
