import React from 'react'
import { GlowingRed } from './GlowingRed'

export function Logo(){
  return (
    <a href="#answer" className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center bg-[#fff4ef] text-sm font-black text-[#111111]">
          A
        </div>
        <div className='gap-2 flex items-center'>
            <span className="text-sm font-black tracking-widest">ASKREPO</span>
        </div>
    </a>
  )
}
