"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "../ui/Logo";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-[#111111]/95 px-5 py-4 text-white sm:px-8 lg:px-10">
      <Logo />

      <div className="flex items-center gap-3 text-xs font-black tracking-widest sm:gap-6">
        {status === "loading" ? (
          /* Skeleton while session loads */
          <div className="h-8 w-24 animate-pulse rounded bg-zinc-800" />
        ) : session?.user ? (
          /* Logged in */
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full border-2 border-zinc-700"
              />
            )}
            <span className="hidden text-sm font-bold tracking-normal text-zinc-300 sm:block">
              {session.user.name}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="border border-zinc-700 px-4 py-3 text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900 hover:text-white sm:px-6"
            >
              SIGN OUT
            </button>
          </div>
        ) : (
          /* Logged out */
          <>
            <Link
              href="/signup"
              className="bg-[#ff3b5c] px-4 py-3 text-white transition-colors hover:bg-[#ff244b] sm:px-6"
            >
              SIGN UP
            </Link>
            <Link
              href="/login"
              className="border border-zinc-700 px-4 py-3 text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900 hover:text-white sm:px-6"
            >
              SIGN IN
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
