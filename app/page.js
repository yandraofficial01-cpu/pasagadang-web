'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Home(){
  const [open, setOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-[#E5E5E5]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0B0B0F]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-black text-[20px] tracking-tighter font-serif">
            PASA<span className="text-[#D4AF37]">GADANG</span><span className="text-[10px] ml-2 tracking-[0.3em] font-sans opacity-50">.COM</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest">
            <Link href="/properties" className="hover:text-[#D4AF37] transition">PROPERTI</Link>
            <Link href="/calculator" className="hover:text-[#D4AF37] transition">KALKULATOR</Link>
            <Link href="/admin/login" className="bg-white text-black px-5 py-2.5 rounded-full hover:bg-[#D4AF37] transition">LOGIN ADMIN</Link>
          </div>

          {/* Burger Button */}
          <button onClick={()=>setOpen(!open)} className="md:hidden w-10 h-10 bg-white/5 rounded-full flex flex-col items-center justify-center gap-1.5 border border-white/10">
            <span className={`w-4 h-[2px] bg-white transition-all ${open? 'rotate-45 translate-y-[4px]' : ''}`}></span>
            <span className={`w-4 h-[2px] bg-white transition-all ${open? 'opacity-0' : ''}`}></span>
            <span className={`w-4 h-[2px] bg-white transition-all ${open? '-rotate-45 -translate-y-[4px]' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-white/5 bg-[#0B0B0F] px-6 py-6 space-y-1 animate-fade-in">
            <Link href="/properties" onClick={()=>setOpen(false)} className="block py-3 text-[13px] font-bold tracking-widest border-b border-white/5">PROPERTI →</Link>
            <Link href="/calculator" onClick={()=>setOpen(false)} className="block py-3 text-[13px] font-bold tracking-widest border-b border-white/5">HITUNG KPR →</Link>
            <Link href="/materials" onClick={()=>setOpen(false)} className="block py-3 text-[13px] font-bold tracking-widest border-b border-white/5">MATERIAL →</Link>
            <Link href="/admin/login" onClick={()=>setOpen(false)} className="block mt-4 bg-white text-black text-center py-4 rounded-full font-black text-[12px] tracking-widest">LOGIN ADMIN</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest text-[#D4AF37]">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
          PASA MATERIAL & RUMAH GADANG #1 DI PADANG
        </div>
        <h1 className="text-[56px] md:text-[88px] font-black leading-[0.9] tracking-tighter mt-6 font-serif">
          PASA<br/><span className="gold-text">GADANG.</span><br/>COM
        </h1>
        <p className="text-[14px] text-zinc-400 mt-6 max-w-[400px] leading-relaxed font-sans">
          Platform material, properti, dan rumah gadang modern. Hitung KPR, cek material, lihat properti langsung dari Padang.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-[520px]">
          <Link href="/properties" className="group bg-white text-black p-7 rounded-[24px] font-black flex justify-between items-center hover:bg-[#D4AF37] transition-all">
            <span>LIHAT PROPERTI</span>
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-black">→</span>
          </Link>
          <Link href="/calculator" className="bg-white/5 border border-white/10 p-7 rounded-[24px] font-black flex justify-between items-center hover:bg-white/10 transition-all backdrop-blur">
            <span>HITUNG KPR</span>
            <span>↗</span>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 max-w-[520px] border-t border-white/5 pt-8">
          <div><p className="text-[24px] font-black">500+</p><p className="text-[10px] tracking-widest text-zinc-500">PROPERTI</p></div>
          <div><p className="text-[24px] font-black">1.2K+</p><p className="text-[10px] tracking-widest text-zinc-500">MATERIAL</p></div>
          <div><p className="text-[24px] font-black">4.9★</p><p className="text-[10px] tracking-widest text-zinc-500">RATING</p></div>
        </div>
      </div>
    </main>
  )
            }
