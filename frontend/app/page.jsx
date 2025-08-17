import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieHeader = (await cookies()).toString();
  const opts = { headers: { cookie: cookieHeader }, cache: "no-store" };

  let res = await fetch(`/api/me`, opts);
  if (res.ok) {
    redirect("/dashboard");
  }

  const r = await fetch(`/api/refresh`, {
    ...opts,
    method: "POST",
  });
  if (r.ok) {
    let res = await fetch(`/api/me`, opts);
    if (res.ok) {
      redirect("/dashboard");
    }
  }

  redirect("/login");
}
