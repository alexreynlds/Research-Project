export default function MenuButton({ page, currentPage, children, onClick }) {
  const isActive = Array.isArray(page)
    ? page.includes(currentPage)
    : currentPage === page;
  return (
    <button
      className={`text-white flex items-center justify-center font-bold px-2 py-1 hover:scale-105 transition-all duration-300 rounded-md cursor-pointer ${isActive ? "bg-blue-300" : "bg-green-300 hover:bg-green-500"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
