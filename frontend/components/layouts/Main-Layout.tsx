
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-w-full h-screen justify-center p-5">
      {children}
    </main>
  );
}
