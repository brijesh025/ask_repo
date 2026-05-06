export function Navbar() {
  const navItems = [
    { href: "#workflow", label: "WORKFLOW" },
    { href: "#answer", label: "ANSWER" },
    { href: "#sources", label: "SOURCES" },
  ];

  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-[#111111]/95 px-5 py-4 text-white sm:px-8 lg:px-10">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center bg-[#fff4ef] text-sm font-black text-[#111111]">
          A
        </div>
        <span className="text-sm font-black tracking-widest">ASKREPO</span>
      </div>

      <div className="flex items-center gap-3 text-xs font-black tracking-widest sm:gap-6">
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-zinc-200 transition-colors hover:text-[#ff3b5c]"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#workflow"
          className="bg-[#ff3b5c] px-4 py-3 text-white transition-colors hover:bg-[#ff244b] sm:px-6"
        >
          START <span className="hidden sm:inline">WITH REPO</span> &rarr;
        </a>
      </div>
    </nav>
  );
}
