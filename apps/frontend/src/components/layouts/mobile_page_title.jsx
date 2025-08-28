export default function MobilePageTitle({ children }) {
  return (
    <h1 className="text-xl font-bold underline flex md:hidden border-2 p-2 rounded mb-2">
      {children}
    </h1>
  );
}
