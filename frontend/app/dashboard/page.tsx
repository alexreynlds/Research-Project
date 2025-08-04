import MainLayout from "@/components/layouts/Main-Layout";
import Navbar from "@/components/navigation/Navbar";

export const metadata = {
  title: 'Dashboard'
}

export default function Dashboard() {
  return (
    <MainLayout>
      <Navbar />
      <div>
        <p>Welcome to the dashboard for AGRIDS Map!</p>
      </div>
    </MainLayout>
  );
}
