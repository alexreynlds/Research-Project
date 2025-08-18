import DesktopNavbar from "../nav/desktop-nav";
import Footer from "./footer";

// A layout that is applied to all pages except login
export default function MainLayout({ pageTitle, children }) {
  return (
    <main className="flex flex-col w-full h-screen items-center gap-5">
      <div className="flex flex-col h-screen gap-5 w-full md:max-w-[1300px] md:w-[90%] items-center relative">
        <DesktopNavbar pageTitle={pageTitle} />
        {children}
      </div>
      <Footer />
    </main>
  );
}
