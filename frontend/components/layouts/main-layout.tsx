import DesktopNavbar from "../navigation/desktop-navbar";
import MobileNavbar from "../navigation/mobile-navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col w-full h-screen p-5 items-center gap-5">
      <div className="flex flex-col h-full gap-5 w-full md:max-w-[1300px] md:w-[90%]">
        <DesktopNavbar />
        <MobileNavbar />
        {children}
      </div>
    </main>
  );
}
