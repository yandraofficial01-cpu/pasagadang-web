'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home(){
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [active, setActive] = useState(null)
  const [properties, setProperties] = useState([])
  const API = process.env.NEXT_PUBLIC_API_URL

  const COLORS = {
    gold: '#D4AF37',
    cream: '#FFFBF0',
    dark: '#0B0B0F',
  }

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    if(!API) return
    fetch(`${API}/properties?is_published=true&limit=2`).then(r=>r.json()).then(j=>setProperties(j.data||j.items||j||[])).catch(()=>{})
  },[API])

  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }
  const isDark = theme==='dark'

  return (
    <main className={`${isDark? 'bg-[#0B0B0F] text-white' : 'bg-[#FFFBF0] text-black'} min-h-screen`}>
      <style>{`
        @keyframes float { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.05)} }
        @keyframes dash { 0%{stroke-dashoffset:24} 100%{stroke-dashoffset:0} }
        @keyframes arrow { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
     .arrow { animation: arrow 1.2s ease-in-out infinite; display:inline-block; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-4 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/80 border-white/5':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/" className="font-black text-[22px] tracking-tighter">PASA<span style={{color:COLORS.gold}}>GADANG</span><span className="text-[10px] ml-2 tracking-[0.3em] opacity-50">.COM</span></Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center">{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className="w-10 h-10 rounded-full bg-white border shadow-sm flex flex-col items-center justify-center gap-1.5">
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span>
          </button>
        </div>
      </nav>

      {/* BURGER MENU - INI YANG LU TANYA BRO - UDAH ADA LOGIN! */}
      {open && (
        <div className={`px-6 py-6 border-b animate-fade-in space-y-1 ${isDark?'bg-[#0B0B0F] border-white/5':'bg-white border-black/5'} shadow-xl`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black text-[14px] tracking-widest border-b border-black/5">
            <span>01 • PROPERTI</span><span className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center arrow">→</span>
          </Link>
          <Link href="/estetikas" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black text-[14px] tracking-widest border-b border-black/5">
            <span>02 • ESTETIKA</span><span className="w-9 h-9 border border-black rounded-full flex items-center justify-center arrow">↗</span>
          </Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black text-[14px] tracking-widest border-b border-black/5">
            <span>03 • MATERIAL</span><span className="w-9 h-9 bg-[#D4AF37] text-black rounded-full flex items-center justify-center arrow">→</span>
          </Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black text-[14px] tracking-widest border-b border-black/5">
            <span>04 • BLOG & TIPS</span><span className="w-9 h-9 bg-zinc-100 text-black rounded-full flex items-center justify-center arrow">→</span>
          </Link>
          <Link href="/calculator" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black text-[14px] tracking-widest border-b border-black/5">
            <span>KALKULATOR KPR</span><span className="arrow">→</span>
          </Link>

          {/* LOGIN ADA DI SINI BRO! */}
          <div className="pt-4">
            <Link href="/admin/login" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-900 transition">
              LOGIN ADMIN <span className="arrow">→</span>
            </Link>
            <div className="text-[10px] text-center opacity-50 mt-3 tracking-widest">KELOLA PROPERTI & MATERIAL</div>
          </div>
        </div>
      )}

      <div className="max-w-[400px] mx-auto px-6 pt-6 pb-20">
        <p className="text-[15px] text-zinc-600 leading-snug">Klik diagram di bawah - konsumen bisa pilih jalur pencarian langsung!</p>

        {/* DIAGRAM */}
        <div className="relative w-full h-[560px] mt-6">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 560">
            <line x1="170" y1="280" x2="170" y2="90" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite'}}/>
            <line x1="170" y1="280" x2="170" y2="470" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.3s'}}/>
            <line x1="170" y1="280" x2="50" y2="280" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.5s'}}/>
            <line x1="170" y1="280" x2="290" y2="280" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.7s'}}/>
          </svg>

          <div className="absolute top-1/2 left-1/2 w-[78px] h-[78px] rounded-full flex flex-col items-center justify-center text-black font-black z-10 shadow-[0_0_28px_rgba(212,175,55,0.5)]" style={{background:COLORS.gold, transform:'translate(-50%,-50%)', animation:'float 3s ease-in-out infinite'}}>
            <div className="text-[8px] tracking-widest opacity-60">PASA</div><div className="text-[13px]">GADANG</div><div className="text-[6px] tracking-[0.3em]">.COM</div>
          </div>

          <Link href="/properties" className="absolute top-[24px] left-1/2 -translate-x-1/2 w-[200px] z-20">
            <div className="bg-white p-4 rounded-[20px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:scale-105 transition-all">
              <div><div className="text-[11px] font-black tracking-widest opacity-50">01 • {properties.length} UNIT</div><div className="font-black text-[15px] mt-1">PROPERTI</div></div>
              <div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div>
            </div>
          </Link>

          <Link href="/blogs" className="absolute top-1/2 left-[-10px] -translate-y-1/2 w-[168px] z-20">
            <div className="p-4 rounded-[20px] flex justify-between items-center shadow-xl bg-black text-white hover:scale-105 transition-all">
              <div><div className="text-[11px] font-bold tracking-widest opacity-60">04 • TIPS</div><div className="font-black text-[15px] mt-1">BLOG</div></div>
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">→</div>
            </div>
          </Link>

          <Link href="/estetikas" className="absolute top-1/2 right-[-10px] -translate-y-1/2 w-[176px] z-20">
            <div className="bg-white p-4 rounded-[20px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:scale-105 transition-all">
              <div><div className="text-[11px] font-bold tracking-widest opacity-50">02 • ROSTER</div><div className="font-black text-[14px] mt-1">ESTETIKA</div></div>
              <div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow" style={{transform:'rotate(-45deg)', display:'inline-block'}}>→</span></div>
            </div>
          </Link>

          <Link href="/materials" className="absolute bottom-[24px] left-1/2 -translate-x-1/2 w-[200px] z-20">
            <div className="p-4 rounded-[24px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-all" style={{background:COLORS.gold}}>
              <div><div className="text-[11px] font-black tracking-widest opacity-70">03 • SEMEN, BESI</div><div className="font-black text-[15px] mt-1">MATERIAL</div></div>
              <div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
