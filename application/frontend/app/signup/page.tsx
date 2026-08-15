import React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GitHubAuthButton } from "@/components/auth/GitHubAuthButton";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start understanding any codebase in minutes."
    >
      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="first-name"
            className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500"
          >
            First name
          </label>
          <input
            id="first-name"
            type="text"
            placeholder="Jane"
            className="w-full border border-zinc-700 bg-[#1a1717] px-4 py-3 text-sm font-semibold text-[#fff4ef] placeholder-zinc-600 outline-none transition-colors focus:border-[#ff3b5c] focus:ring-1 focus:ring-[#ff3b5c]/30"
          />
        </div>
        <div>
          <label
            htmlFor="last-name"
            className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500"
          >
            Last name
          </label>
          <input
            id="last-name"
            type="text"
            placeholder="Doe"
            className="w-full border border-zinc-700 bg-[#1a1717] px-4 py-3 text-sm font-semibold text-[#fff4ef] placeholder-zinc-600 outline-none transition-colors focus:border-[#ff3b5c] focus:ring-1 focus:ring-[#ff3b5c]/30"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mt-4">
        <label
          htmlFor="email"
          className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="jane@example.com"
          className="w-full border border-zinc-700 bg-[#1a1717] px-4 py-3 text-sm font-semibold text-[#fff4ef] placeholder-zinc-600 outline-none transition-colors focus:border-[#ff3b5c] focus:ring-1 focus:ring-[#ff3b5c]/30"
        />
      </div>

      {/* Mobile */}
      <div className="mt-4">
        <label
          htmlFor="mobile"
          className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500"
        >
          Mobile number
        </label>
        <input
          id="mobile"
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="w-full border border-zinc-700 bg-[#1a1717] px-4 py-3 text-sm font-semibold text-[#fff4ef] placeholder-zinc-600 outline-none transition-colors focus:border-[#ff3b5c] focus:ring-1 focus:ring-[#ff3b5c]/30"
        />
      </div>

      {/* Password */}
      <div className="mt-4">
        <label
          htmlFor="password"
          className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500"
        >
          Password
        </label>
        <input
          id="password"
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
        Create Account
      </button>
      <GitHubAuthButton label="Sign up with GitHub" />

      {/* Link to login */}
      <p className="mt-6 text-center text-sm font-semibold text-zinc-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-black text-[#ff3b5c] transition-colors hover:text-[#ff6b81]"
        >
          Sign in
        </a>
      </p>
    </AuthLayout>
  );
}
