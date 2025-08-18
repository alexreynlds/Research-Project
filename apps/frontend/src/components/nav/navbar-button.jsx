import Link from "next/link";

export default function NavbarButton({ href, children }) {
  return (
    <Link
      href={href}
      className={`bg-[#70B664] hover:bg-[#5a9b52] py-1 px-4 rounded-xl text-white hover:scale-105 transition-all duration-300`}
    >
      {children}
    </Link>
  );
}
