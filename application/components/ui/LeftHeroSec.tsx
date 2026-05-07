import React from 'react'
import { GlowingRed } from './GlowingRed'
export function LeftHeroSec() {
  return (
    <div>
        <div className="relative overflow-hidden border-b border-zinc-800 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-16 xl:p-20">
        <div className="relative mb-8 max-w-5xl pt-8 pb-8 sm:pt-10 sm:pb-10">
          <GlowingRed className="-left-38 top-30 z-0 w-100 -rotate-45" />
          <h1 className="relative z-10 text-5xl font-black leading-[0.96] tracking-normal text-[#fff4ef] sm:text-7xl lg:text-8xl xl:text-[104px]">
            CHAT WITH
            <br />
            ANY GITHUB
            <br />
            REPOSITORY
          </h1>
          <GlowingRed className="-right-38 bottom-30 z-0 w-100 -rotate-45" />
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-4">
          <a
            href="#workflow"
            className="bg-[#ff3b5c] px-7 py-4 text-xs font-black tracking-widest text-white transition-colors hover:bg-[#ff244b]"
          >
            SEE HOW IT WORKS
          </a>
          <a
            href="#sources"
            className="flex items-center gap-4 border border-zinc-700 px-6 py-4 text-xs font-black tracking-widest text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
          >
            <span className="text-[#ff3b5c]">&gt;</span> VIEW CODE SOURCES
          </a>
        </div>

      </div>
    </div>
  )
}
