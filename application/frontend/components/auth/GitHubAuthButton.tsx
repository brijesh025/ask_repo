import { signIn } from "@/auth";

type GitHubAuthButtonProps = {
  label: string;
};

export function GitHubAuthButton({ label }: GitHubAuthButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/dashboard" });
      }}
    >
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 border border-zinc-700 bg-zinc-900/50 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800"
      >
        {label}
      </button>
    </form>
  );
}
