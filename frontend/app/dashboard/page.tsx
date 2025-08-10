import ServerConnectionTest from "@/components/backend/server-connection-test";
import MainLayout from "@/components/layouts/main-layout";
import Navbar from "@/components/navigation/navbar";

export const metadata = {
  title: 'Dashboard'
}

export default function Dashboard() {
  return (
    <MainLayout>
      <Navbar />
      <div>
        <p>Welcome to the dashboard for AGRIDS Map!</p>
        <ServerConnectionTest />
      </div>
    </MainLayout>
  );
}
