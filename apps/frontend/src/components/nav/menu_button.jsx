import { Button } from "../ui/button";
import Link from "next/link";

export default function MenuButton({
  page,
  currentPage,
  children,
  onClick,
  variant = "default",
  href,
  title,
}) {
  const isActive = Array.isArray(page)
    ? page.includes(currentPage)
    : currentPage === page;

  if (href) {
    return (
      <Button
        className={`text-white flex items-center justify-center font-bold px-2 py-1 hover:scale-105 transition-all duration-300 rounded cursor-pointer bg-green-300 hover:bg-green-500`}
        onClick={onClick}
        href={href}
        title={title}
      >
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
        >
          {children}
        </Link>
      </Button>
    );
  }

  if (variant === "default") {
    return (
      <Button
        className={`text-white flex items-center justify-center font-bold px-2 py-1 hover:scale-105 transition-all duration-300 rounded cursor-pointer ${isActive ? "bg-blue-300 hover:bg-blue-500" : "bg-green-300 hover:bg-green-500"}`}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  if (variant === "small") {
    return (
      <button
        className={`text-white flex items-center justify-center text-sm font-bold px-1 py-1 hover:scale-103 transition-all duration-300 rounded cursor-pointer ${isActive ? "bg-blue-300" : "bg-green-300 hover:bg-green-500"}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}
