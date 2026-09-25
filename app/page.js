'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home(){
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [properties, setProperties] = useState([])
  const [materials, setMaterials] = useState([])
  const [estetikas, setEstetikas] = useState([])
  const [blogs, setBlogs] = useState([])
  const [active, setActive] = useState(null)
  const API = process.env.NEXT_PUBLIC_API_URL

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'dark'
    setTheme(saved)
  },[])
  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }

  useEffect(()=>{
    if(!API) return
    fetch(`${API}/properties?is_published=true&limit=3`).then(r=>r.json()).then(j=>setProperties(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/materials?is_active=true&limit=3`).then(r=>r.json()).then(j=>setMaterials(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/estetikas?is_active=true&limit=3`).then(r=>r.json()).then(j=>setEstetikas(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/blogs?is_published=true&limit=3`).then(r=>r.json()).then(j=>setBlogs(j.data||j.items||j||[])).catch(()=>{})
  },[API])

  const isDark = theme === 'dark'

  return (
    <main className={`${isDark? 'bg-[#0B0B0F] text-[#E5E5E5]' : 'bg-[#FAF7F2] text-[#1A1A1A]'} min-h-screen transition-colors duration-500`}>
      <style>{`
        @keyframes arrow-bounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
        @keyframes arrow-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes floatCenter { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.06)} }
        @keyframes dash { 0%{stroke-dashoffset:20} 100%{stroke-dashoffset:0} }
       .arrow-animate { animation: arrow-bounce 1.3s ease-in-out infinite; display:inline-block; }
       .arrow-pulse { animation: arrow-pulse 1s ease-in-out infinite; }
       .group:hover.arrow-animate { animation: arrow-bounce 0.6s ease-in-out infinite; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark? 'bg-[#0B0B0F]/80 border-white/5' : 'bg-[#FAF7F2]/80 border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-black text-[20px] tracking-tighter">PASA<span className="text-[#D4AF37]">GADANG</span><span className={`text-[10px] ml-2 tracking-[0.3em] ${isDark?'opacity-50':'opacity-60'}`}>.COM</span></Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold tracking-widest">
            <Link href="/properties" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">PROPERTI <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>
            <Link href="/estetikas" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">ESTETIKA <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>
            <Link href="/materials" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">MATERIAL <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>
            <Link href="/blogs" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">BLOG <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>
            <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${isDark?'bg-white/5 border-white/10':'bg-black/5 border-black/10'}`}>{isDark?'☀️':'🌙'}</button>
            <Link href="/admin/login" className={`${isDark?'bg-white text-black':'bg-black text-white'} px-5 py-2.5 rounded-full hover:bg-[#D4AF37] hover:text-black transition`}>LOGIN</Link>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">{isDark?'☀️':'🌙'}</button>
            <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1.5 border ${isDark?'bg-white/5 border-white/10':'bg-black/5 border-black/10'}`}>
              <span className={`w-4 h-[2px] ${isDark?'bg-white':'bg-black'} transition-all ${open? 'rotate-45 translate-y-[4px]' : ''}`}></span>
              <span className={`w-4 h-[2px] ${isDark?'bg-white':'bg-black'} transition-all ${open? 'opacity-0' : ''}`}></span>
              <span className={`w-4 h-[2px] ${isDark?'bg-white':'bg-black'} transition-all ${open? '-rotate-45 -translate-y-[4px]' : ''}`}></span>
            </button>
          </div>
        </div>
        {open && (
          <div className={`md:hidden border-t px-6 py-6 space-y-1 ${isDark?'border-white/5 bg-[#0B0B0F]':'border-black/5 bg-[#FAF7F2]'}`}>
            <Link href="/properties" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5 group">PROPERTI <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center arrow-animate">→</span></Link>
            <Link href="/estetikas" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5 group">ESTETIKA <span className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center arrow-animate">↗</span></Link>
            <Link href="/materials" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5 group">MATERIAL <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center arrow-animate">→</span></Link>
            <Link href="/blogs" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5 group">BLOG & TIPS <span className="w-8 h-8 bg-white text-black border rounded-full flex items-center justify-center arrow-animate">→</span></Link>
            <Link href="/calculator" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black">KALKULATOR KPR <span className="arrow-animate">→</span></Link>
          </div>
        )}
      </nav>

      {/* HERO + DIAGRAM */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-10">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest text-[#D4AF37]">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
          4 KATEGORI: PROPERTI • ESTETIKA • MATERIAL • BLOG
        </div>
        <h1 className="text-[42px] md:text-[68px] font-black leading-[0.9] tracking-tighter mt-6 font-serif">
          CARI APA<br/><span className="text-[#D4AF37]">HARI INI?</span>
        </h1>
        <p className={`text-[14px] mt-4 max-w-[420px] leading-relaxed ${isDark?'text-zinc-400':'text-zinc-600'}`}>
          Klik diagram di bawah - konsumen bisa pilih jalur pencarian langsung!
        </p>

        {/* DIAGRAM 4 ELEMEN KLIK */}
        <div className="relative w-full max-w-[380px] md:max-w-[560px] aspect-square mt-10 mx-auto md:mx-0">
          {/* GARIS */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <line x1="200" y1="200" x2="200" y2="70" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.1)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite'}}/>
            <line x1="200" y1="200" x2="330" y2="200" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.1)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.2s'}}/>
            <line x1="200" y1="200" x2="200" y2="330" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.1)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.4s'}}/>
            <line x1="200" y1="200" x2="70" y2="200" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.1)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.6s'}}/>
          </svg>

          {/* CENTER */}
          <div className="absolute top-1/2 left-1/2 w-[88px] h-[88px] md:w-[110px] md:h-[110px] bg-[#D4AF37] rounded-full flex flex-col items-center justify-center text-black font-black z-10 shadow-[0_0_30px_rgba(212,175,55,0.5)]" style={{transform:'translate(-50%,-50%)', animation:'floatCenter 3s ease-in-out infinite'}}>
            <div className="text-[9px] tracking-widest opacity-60">PASA</div><div className="text-[16px]">GADANG</div><div className="text-[7px] tracking-[0.3em]">.COM</div>
          </div>

          {/* TOP - PROPERTI */}
          <Link href="/properties" onMouseEnter={()=>setActive('p')} onMouseLeave={()=>setActive(null)} className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] group">
            <div className={`p-4 rounded-[20px] flex justify-between items-center transition-all ${active==='p'?'scale-110':'scale-100'} bg-white text-black shadow-lg group-hover:scale-110`}>
              <div><div className="text-[10px] font-bold opacity-60 tracking-widest">01 • {properties.length} UNIT</div><div className="font-black text-[14px] mt-1">PROPERTI</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow-animate">→</span></div>
            </div>
          </Link>

          {/* RIGHT - ESTETIKA */}
          <Link href="/estetikas" onMouseEnter={()=>setActive('e')} onMouseLeave={()=>setActive(null)} className="absolute top-1/2 right-0 -translate-y-1/2 w-[180px] group">
            <div className={`p-4 rounded-[20px] flex justify-between items-center border transition-all ${active==='e'?'scale-110':'scale-100'} ${isDark?'bg-[#1A1A1F] border-white/10 text-white':'bg-white border-black/10 text-black shadow'} group-hover:scale-110`}>
              <div><div className="text-[10px] font-bold opacity-60 tracking-widest">02 • ROSTER</div><div className="font-black text-[14px] mt-1">ESTETIKA</div></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark?'bg-white text-black':'bg-black text-white'}`}><span className="arrow-animate">↗</span></div>
            </div>
          </Link>

          {/* BOTTOM - MATERIAL */}
          <Link href="/materials" onMouseEnter={()=>setActive('m')} onMouseLeave={()=>setActive(null)} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] group">
            <div className={`p-4 rounded-[20px] flex justify-between items-center transition-all ${active==='m'?'scale-110':'scale-100'} bg-[#D4AF37] text-black shadow-lg group-hover:scale-110`}>
              <div><div className="text-[10px] font-bold opacity-70 tracking-widest">03 • SEMEN, BESI</div><div className="font-black text-[14px] mt-1">MATERIAL</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow-pulse">→</span></div>
            </div>
          </Link>

          {/* LEFT - BLOG */}
          <Link href="/blogs" onMouseEnter={()=>setActive('b')} onMouseLeave={()=>setActive(null)} className="absolute top-1/2 left-0 -translate-y-1/2 w-[180px] group">
            <div className={`p-4 rounded-[20px] flex justify-between items-center transition-all ${active==='b'?'scale-110':'scale-100'} bg-black text-white shadow-lg group-hover:scale-110`}>
              <div><div className="text-[10px] font-bold opacity-60 tracking-widest">04 • TIPS</div><div className="font-black text-[14px] mt-1">BLOG</div></div>
              <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"><span className="arrow-animate">→</span></div>
            </div>
          </Link>
        </div>

        {/* PREVIEW LIST */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div><h3 className="font-black text-[13px] flex items-center gap-2">PROPERTI <span className="text-[#D4AF37] arrow-animate">→</span></h3><div className="mt-3 space-y-2">{properties.map(p=>(<Link key={p.id} href={`/properties/${p.slug}`} className={`flex gap-3 p-3 rounded-xl border group ${isDark?'bg-white/5 border-white/5':'bg-white border-black/5'}`}><img src={p.thumbnail||p.foto_1} className="w-12 h-12 rounded-lg object-cover"/><div className="flex-1"><div className="text-[12px] font-bold line-clamp-1">{p.judul}</div><div className="text-[10px] opacity-60">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div></div><span className="arrow-animate opacity-0 group-hover:opacity-100 self-center">→</span></Link>))}</div></div>
          <div><h3 className="font-black text-[13px]">MATERIAL <span className="text-[#D4AF37] arrow-animate">→</span></h3><div className="mt-3 space-y-2">{materials.map(m=>(<Link key={m.id} href={`/materials/${m.slug}`} className={`flex gap-3 p-3 rounded-xl border group ${isDark?'bg-white/5 border-white/5':'bg-white border-black/5'}`}><img src={m.foto_1} className="w-12 h-12 rounded-lg object-cover"/><div><div className="text-[12px] font-bold">{m.nama}</div><div className="text-[10px] opacity-60">{m.brand} • Rp {Number(m.harga).toLocaleString('id-ID')}</div></div><span className="ml-auto arrow-animate opacity-0 group-hover:opacity-100">→</span></Link>))}</div></div>
          <div><h3 className="font-black text-[13px]">BLOG <span className="text-[#D4AF37] arrow-animate">→</span></h3><div className="mt-3 space-y-2">{blogs.map(b=>(<Link key={b.id} href={`/blogs/${b.slug}`} className={`flex gap-3 p-3 rounded-xl border group ${isDark?'bg-white/5 border-white/5':'bg-white border-black/5'}`}><img src={b.thumbnail} className="w-12 h-12 rounded-lg object-cover"/><div><div className="text-[12px] font-bold line-clamp-1">{b.judul}</div><div className="text-[10px] opacity-60">{b.kategori}</div></div><span className="ml-auto arrow-animate opacity-0 group-hover:opacity-100">→</span></Link>))}</div></div>
        </div>
      </div>
    </main>
  )
        }
