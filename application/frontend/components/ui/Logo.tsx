import React from 'react'

export function Logo() {
  return (
    <a href="/" className="group flex items-center">
      {/* "A" square */}
      <div className="relative z-10 flex h-8 w-8 items-center justify-center bg-[#fff4ef] text-3xl font-black text-[#111111]">
        A
      </div>

      {/* SKREPO in red box — no left border (A square is the left wall) */}
      <div className="flex h-8 items-center border-t-[3px] border-r-[3px] border-b-[3px] border-l-0 border-[#ff3b5c] px-3 shadow-[0_0_10px_rgba(255,59,92,0.15)]">
        <span className="text-sm font-black -ml-2 tracking-wider text-white">SKREPO</span>
      </div>
    </a>
  )
}
