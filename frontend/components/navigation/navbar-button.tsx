import Link from "next/link";

export default function NavbarButton({
  href,
  children,
  red = false,
}: {
  href: string;
  children: React.ReactNode;
  red?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${red ? "bg-red-500 hover:bg-red-600" : "bg-[#70B664] hover:bg-[#5a9b52]"} py-1 px-4 rounded-xl text-white  transition-colors duration-300`}
    >
      {children}
    </Link >
  );
}
