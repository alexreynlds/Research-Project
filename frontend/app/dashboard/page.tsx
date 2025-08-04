import MainLayout from "@/components/layouts/Main-Layout";
import Navbar from "@/components/navigation/Navbar";

export const metadata = {
  title: 'Dashboard'
}

export default function Dashboard() {
  return (
    <MainLayout>
      <Navbar />
      <main className="flex flex-col gap-[32px]row - start - 2 items - center sm: items - start">
      </main >
    </MainLayout>
  );
}
