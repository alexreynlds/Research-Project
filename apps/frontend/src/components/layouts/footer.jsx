import Link from "next/link";
// A small footer component
export default function Footer() {
  return (
    <div className="flex w-screen h-fit bg-gray-300 text-center p-2 items-center justify-center">
      <span>
        &copy; {new Date().getFullYear()} AGRIDS &{" "}
        <Link
          href="https://lcas.lincoln.ac.uk/"
          title="Lincoln LCAS"
          className="underline"
        >
          LCAS
        </Link>
      </span>
    </div>
  );
}
