export default function MenuButton({
  page,
  currentPage,
  children,
  onClick,
  variant = "default",
}) {
  const isActive = Array.isArray(page)
    ? page.includes(currentPage)
    : currentPage === page;

  if (variant === "default") {
    return (
      <button
        className={`text-white flex items-center justify-center font-bold px-2 py-1 hover:scale-105 transition-all duration-300 rounded-md cursor-pointer ${isActive ? "bg-blue-300" : "bg-green-300 hover:bg-green-500"}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  if (variant === "small") {
    return (
      <button
        className={`text-white flex items-center justify-center text-sm font-bold px-1 py-1 hover:scale-103 transition-all duration-300 rounded-md cursor-pointer ${isActive ? "bg-blue-300" : "bg-green-300 hover:bg-green-500"}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}
