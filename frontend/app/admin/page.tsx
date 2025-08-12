import ServerConnectionTest from "@/components/backend/server-connection-test";
import MainLayout from "@/components/layouts/main-layout";
import Navbar from "@/components/navigation/navbar";

export const metadata = {
  title: 'Admin'
}

export default function Dashboard() {
  return (
    <MainLayout>
      <div>
        <h1>ADMIN</h1>
      </div>
    </MainLayout>
  );
}
