import { Logo } from "../ui/Logo";
export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-[#111111]/95 px-5 py-4 text-white sm:px-8 lg:px-10">
      <Logo />
      <div className="flex items-center gap-3 text-xs font-black tracking-widest sm:gap-6">
        <button
          type="button"
          className="bg-[#ff3b5c] px-4 py-3 text-white transition-colors hover:bg-[#ff244b] sm:px-6"
        >
          SIGN UP
        </button>
        <button
          type="button"
          className="border border-zinc-700 px-4 py-3 text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900 hover:text-white sm:px-6"
        >
          SIGN IN
        </button>
      </div>
    </nav>
  );
}
