import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <nav className="border-2 p-3 rounded-2xl w-[80%] flex justify-between">
        <h1 className="flex items-center gap-4 text-3xl font-medium">
          <a href="/" title="AGRIDS home page">
            <img src="/img/agrids_logo_transparent_crop.png" alt="agrids logo" className="h-10 mt-[-5px]" />
          </a>
          AGRIDS MAP
        </h1>
        <ul className="flex gap-4 text-lg font-medium items-center">
          <li className="bg-[#70B664] py-1 px-4 rounded-xl text-white hover:bg-[#5a9b52] transition-colors duration-300">
            <a href="">HOME</a>
          </li>
          <li className="bg-[#70B664] py-1 px-4 rounded-xl text-white hover:bg-[#5a9b52] transition-colors duration-300">
            <a href="">LOGIN</a>
          </li>
          <li className="bg-[#70B664] py-1 px-4 rounded-xl text-white hover:bg-[#5a9b52] transition-colors duration-300">
            <a href="">REGISTER</a>
          </li>
        </ul>
      </nav>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      </main>

    </div>
  );
}
