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
  const API = process.env.NEXT_PUBLIC_API_URL

  // THEME LOGIC
  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'dark'
    setTheme(saved)
  },[])
  const toggleTheme = ()=>{
    const newTheme = theme === 'dark'? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // FETCH 4 MODEL LU
  useEffect(()=>{
    if(!API) return
    fetch(`${API}/properties?is_published=true&limit=3`).then(r=>r.json()).then(j=>setProperties(j.data||j||[])).catch(()=>{})
    fetch(`${API}/materials?is_active=true&limit=3`).then(r=>r.json()).then(j=>setMaterials(j.data||j||[])).catch(()=>{})
    fetch(`${API}/estetikas?is_active=true&limit=3`).then(r=>r.json()).then(j=>setEstetikas(j.data||j||[])).catch(()=>{})
    fetch(`${API}/blogs?is_published=true&limit=3`).then(r=>r.json()).then(j=>setBlogs(j.data||j||[])).catch(()=>{})
  },[API])

  const isDark = theme === 'dark'

  return (
    <main className={`${isDark? 'bg-[#0B0B0F] text-[#E5E5E5]' : 'bg-[#FAF7F2] text-[#1A1A1A]'} min-h-screen transition-colors duration-500`}>
      <style>{`
        @keyframes arrow-bounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes arrow-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
       .arrow-animate { animation: arrow-bounce 1.5s infinite; }
       .arrow-pulse { animation: arrow-pulse 1.2s infinite; }
       .group:hover.arrow-animate { animation: arrow-bounce 0.6s infinite; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark? 'bg-[#0B0B0F]/80 border-white/5' : 'bg-[#FAF7F2]/80 border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-black text-[20px] tracking-tighter">
            PASA<span className="text-[#D4AF37]">GADANG</span><span className={`text-[10px] ml-2 tracking-[0.3em] ${isDark?'opacity-50':'opacity-60'}`}>.COM</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold tracking-widest">
            <Link href="/properties" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">PROPERTI <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>
            <Link href="/estetikas" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">ESTETIKA <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>
            <Link href="/materials" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">MATERIAL <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>
            <Link href="/blogs" className="hover:text-[#D4AF37] transition flex items-center gap-1 group">BLOG <span className="arrow-animate opacity-0 group-hover:opacity-100 transition">→</span></Link>

            <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${isDark?'bg-white/5 border-white/10':'bg-black/5 border-black/10'}`}>
              {isDark?'☀️':'🌙'}
            </button>

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

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest text-[#D4AF37]">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
          4 KATEGORI: PROPERTI • ESTETIKA • MATERIAL • BLOG
        </div>
        <h1 className="text-[56px] md:text-[88px] font-black leading-[0.9] tracking-tighter mt-6 font-serif">
          CARI APA<br/><span className="text-[#D4AF37]">HARI INI?</span>
        </h1>
        <p className={`text-[14px] mt-6 max-w-[420px] leading-relaxed ${isDark?'text-zinc-400':'text-zinc-600'}`}>
          Klik panah di bawah, gua udah siapin animasi biar lu penasaran! Ada rumah, roster, semen, sampe tips bangun rumah gadang.
        </p>

        {/* 4 TOMBOL UTAMA DENGAN ANIMASI PANAH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-[600px]">
          <Link href="/properties" className="group relative bg-white text-black p-7 rounded-[24px] font-black flex justify-between items-center hover:bg-[#D4AF37] transition-all overflow-hidden">
            <div><div className="text-[11px] tracking-widest opacity-60">01 • {properties.length} UNIT</div><div className="text-[18px] mt-1">PROPERTI</div></div>
            <span className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-[20px] arrow-pulse group-hover:bg-black group-hover:rotate-[45deg] transition-all duration-300">→</span>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-black/5 rounded-full group-hover:scale-150 transition duration-700"></div>
          </Link>
          <Link href="/estetikas" className={`group p-7 rounded-[24px] font-black flex justify-between items-center transition-all border ${isDark?'bg-white/5 border-white/10 hover:bg-white/10':'bg-black/5 border-black/10 hover:bg-black/10'}`}>
            <div><div className="text-[11px] tracking-widest opacity-60">02 • ROSTER & GRANIT</div><div className="text-[18px] mt-1">ESTETIKA</div></div>
            <span className={`w-12 h-12 rounded-full flex items-center justify-center text-[20px] arrow-animate border ${isDark?'bg-white text-black':'bg-black text-white'}`}>↗</span>
          </Link>
          <Link href="/materials" className={`group p-7 rounded-[24px] font-black flex justify-between items-center transition-all border ${isDark?'bg-white/5 border-white/10 hover:bg-white/10':'bg-black/5 border-black/10 hover:bg-black/10'}`}>
            <div><div className="text-[11px] tracking-widest opacity-60">03 • SEMEN, BESI, BATA</div><div className="text-[18px] mt-1">MATERIAL</div></div>
            <span className="w-12 h-12 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-[20px] arrow-animate group-hover:translate-x-1 transition">→</span>
          </Link>
          <Link href="/blogs" className="group bg-black text-white p-7 rounded-[24px] font-black flex justify-between items-center hover:bg-zinc-900 transition-all">
            <div><div className="text-[11px] tracking-widest opacity-60">04 • TIPS & INSPIRASI</div><div className="text-[18px] mt-1">BLOG</div></div>
            <span className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-[20px] arrow-animate group-hover:rotate-45 transition-all">→</span>
          </Link>
        </div>

        {/* PREVIEW 4 MODEL */}
        <div className="mt-20 space-y-16">
          {/* PROPERTI */}
          <div>
            <div className="flex justify-between items-center"><h2 className="text-[24px] font-black">PROPERTI <span className="text-[#D4AF37]">TERBARU</span></h2><Link href="/properties" className="group flex items-center gap-2 text-[11px] font-bold">LIHAT SEMUA <span className="arrow-animate">→</span></Link></div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">{properties.map(p=>(<Link key={p.id} href={`/properties/${p.slug}`} className={`rounded-[20px] overflow-hidden border p-4 flex gap-4 group ${isDark?'bg-white/5 border-white/10':'bg-white border-black/5 shadow-sm'}`}><img src={p.thumbnail||p.foto_1} className="w-20 h-20 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-[13px] line-clamp-1">{p.judul}</div><div className="text-[11px] opacity-60">{p.kecamatan} • {p.tipe_transaksi}</div><div className="text-[13px] font-black mt-1">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div></div><span className="arrow-animate opacity-0 group-hover:opacity-100 self-center">→</span></Link>))}</div>
          </div>

          {/* ESTETIKA + MATERIAL + BLOG */}
          <div className="grid md:grid-cols-3 gap-8">
            <div><h3 className="font-black text-[14px] flex items-center gap-2">ESTETIKA <span className="text-[#D4AF37] arrow-animate">→</span></h3><div className="mt-3 space-y-2">{estetikas.map(e=>(<Link key={e.id} href={`/estetikas/${e.slug}`} className={`flex gap-3 p-3 rounded-xl border group ${isDark?'bg-white/5 border-white/5':'bg-white border-black/5'}`}><img src={e.foto_bahan_1} className="w-12 h-12 rounded-lg object-cover"/><div><div className="text-[12px] font-bold">{e.nama}</div><div className="text-[10px] opacity-60">{e.kategori} • Rp {Number(e.harga).toLocaleString('id-ID')}/{e.satuan}</div></div><span className="ml-auto arrow-animate opacity-0 group-hover:opacity-100">↗</span></Link>))}</div></div>

            <div><h3 className="font-black text-[14px] flex items-center gap-2">MATERIAL <span className="text-[#D4AF37] arrow-animate">→</span></h3><div className="mt-3 space-y-2">{materials.map(m=>(<Link key={m.id} href={`/materials/${m.slug}`} className={`flex gap-3 p-3 rounded-xl border group ${isDark?'bg-white/5 border-white/5':'bg-white border-black/5'}`}><img src={m.foto_1} className="w-12 h-12 rounded-lg object-cover"/><div><div className="text-[12px] font-bold">{m.nama}</div><div className="text-[10px] opacity-60">{m.kategori} • {m.brand} • Rp {Number(m.harga).toLocaleString('id-ID')}</div></div><span className="ml-auto arrow-animate opacity-0 group-hover:opacity-100">→</span></Link>))}</div></div>

            <div><h3 className="font-black text-[14px] flex items-center gap-2">BLOG <span className="text-[#D4AF37] arrow-animate">→</span></h3><div className="mt-3 space-y-2">{blogs.map(b=>(<Link key={b.id} href={`/blogs/${b.slug}`} className={`flex gap-3 p-3 rounded-xl border group ${isDark?'bg-white/5 border-white/5':'bg-white border-black/5'}`}><img src={b.thumbnail} className="w-12 h-12 rounded-lg object-cover"/><div><div className="text-[12px] font-bold line-clamp-1">{b.judul}</div><div className="text-[10px] opacity-60">{b.kategori} • {b.views} views</div></div><span className="ml-auto arrow-animate opacity-0 group-hover:opacity-100">→</span></Link>))}</div></div>
          </div>
        </div>

      </div>
    </main>
  )
}
