import LoginCard from "@/components/login/Login";

export const metadata = {
  title: 'Login'
}

export default function login() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative">
      <div className="bg-[url(/img/field.jpg)] bg-cover blur-xs w-full h-full absolute" />
      <main className="flex flex-col gap-[24px] row-start-2 items-center border-3 w-[25%] min-w-[350px] h-[100%] rounded-xl p-4 shadow-xl z-10 bg-white/70 backdrop-blur-md">
        <img
          src="/img/agrids_logo_transparent_crop.png"
          alt="agrids logo"
          className="h-10"
        />
        <LoginCard />
      </main>

    </div>
  );
}
