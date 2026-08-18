import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { RepoAnalysisWorkspace } from "@/components/dashboard/RepoAnalysisWorkspace";

type RepoPageProps = {
  params: Promise<{
    owner: string;
    name: string;
  }>;
  searchParams: Promise<{
    url?: string;
  }>;
};

export default async function RepositoryAnalysisPage({
  params,
  searchParams,
}: RepoPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { owner, name } = await params;
  const { url } = await searchParams;

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

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <RepoAnalysisWorkspace owner={owner} name={name} repoUrl={url} />
        </section>
      </main>
    </div>
  );
}
