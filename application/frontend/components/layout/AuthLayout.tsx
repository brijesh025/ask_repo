import React from "react";
import { Logo } from "../ui/Logo";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#100f0f] px-4 py-12 font-sans selection:bg-[#ff3b5c] selection:text-white sm:px-6"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */} 
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>

        {/* Card */}
        <div className="border border-zinc-800 bg-[#111111]">
          {/* Header */}
          <div className="border-b border-zinc-800 px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-black text-[#fff4ef]">{title}</h1>
            <p className="mt-1.5 text-sm font-semibold text-zinc-500">
              {subtitle}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6 sm:px-8">{children}</div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs font-semibold text-zinc-600">
          By continuing you agree to AskRepo&apos;s{" "}
          <a href="#" className="text-zinc-400 underline hover:text-[#ff3b5c]">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-zinc-400 underline hover:text-[#ff3b5c]">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
