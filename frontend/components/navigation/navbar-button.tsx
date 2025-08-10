import Link from "next/link";

export default function NavbarButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="bg-[#70B664] py-1 px-4 rounded-xl text-white hover:bg-[#5a9b52] transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
