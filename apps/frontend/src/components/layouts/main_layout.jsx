import { Toaster } from "sonner";
import DesktopNavbar from "../nav/desktop_nav";
import MobileNav from "../nav/mobile_nav";
import Footer from "./footer";

// A layout that is applied to all pages except login
export default function MainLayout({ pageTitle, children }) {
  return (
    <main className="flex flex-col w-full h-full items-center gap-5">
      <div className="flex flex-col min-h-screen gap-5 w-full md:max-w-[1400px] md:w-[90%] items-center relative">
        <DesktopNavbar pageTitle={pageTitle} />
        <MobileNav />
        {children}
      </div>
      <Toaster />
      <Footer />
    </main>
  );
}
