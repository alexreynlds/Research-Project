import Navbar from "../navigation/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-w-full h-screen p-5 items-center gap-5">
      <Navbar />
      {children}
    </main>
  );
}
