import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { RepositoryList } from "@/components/profile/RepositoryList";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div
      className="min-h-screen bg-[#100f0f] font-sans selection:bg-[#ff3b5c] selection:text-white"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <main className="mx-auto min-h-screen max-w-[1440px] border-x border-zinc-800 bg-[#111111]">
        <Navbar />

        <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="border border-zinc-800 bg-[#111111]">
            <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-8">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "GitHub profile"}
                  className="h-24 w-24 border-4 border-[#ff3b5c] object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center border-4 border-[#ff3b5c] bg-[#201b1b] text-3xl font-black text-[#fff4ef]">
                  {(user.name ?? "U").slice(0, 1).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  GitHub Profile
                </p>
                <h1 className="mt-2 text-3xl font-black text-[#fff4ef] sm:text-4xl">
                  {user.name ?? user.githubLogin ?? "Signed in user"}
                </h1>
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-zinc-400">
                  {user.githubLogin && <span>@{user.githubLogin}</span>}
                  {user.email && <span>{user.email}</span>}
                </div>
              </div>
            </div>

            <RepositoryList />
          </div>
        </section>
      </main>
    </div>
  );
}
