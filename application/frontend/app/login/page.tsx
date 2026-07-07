"use client";

import React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import {
  SocialAuthButtons,
  Divider,
} from "@/components/ui/SocialAuthButtons";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue exploring codebases."
    >
      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500"
        >
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="jane@example.com"
          className="w-full border border-zinc-700 bg-[#1a1717] px-4 py-3 text-sm font-semibold text-[#fff4ef] placeholder-zinc-600 outline-none transition-colors focus:border-[#ff3b5c] focus:ring-1 focus:ring-[#ff3b5c]/30"
        />
      </div>

      {/* Password */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500"
          >
            Password
          </label>
          <a
            href="#"
            className="text-[10px] font-black uppercase tracking-widest text-[#ff3b5c] transition-colors hover:text-[#ff6b81]"
          >
            Forgot?
          </a>
        </div>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          className="w-full border border-zinc-700 bg-[#1a1717] px-4 py-3 text-sm font-semibold text-[#fff4ef] placeholder-zinc-600 outline-none transition-colors focus:border-[#ff3b5c] focus:ring-1 focus:ring-[#ff3b5c]/30"
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        className="mt-6 w-full bg-[#ff3b5c] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all duration-200 hover:bg-[#ff244b] hover:shadow-lg hover:shadow-[#ff3b5c]/20"
      >
        Sign In
      </button>

      <Divider />

      {/* Social auth */}
      <SocialAuthButtons action="sign in" />

      {/* Link to signup */}
      <p className="mt-6 text-center text-sm font-semibold text-zinc-500">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="font-black text-[#ff3b5c] transition-colors hover:text-[#ff6b81]"
        >
          Sign up
        </a>
      </p>
    </AuthLayout>
  );
}
