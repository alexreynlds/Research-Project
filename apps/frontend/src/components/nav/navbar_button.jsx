import Link from "next/link";
import { Button } from "../ui/button";

export default function NavbarButton({ href, children }) {
  return (
    <Button
      variant="green"
      className="hover:scale-105 transition-all duration-300"
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
