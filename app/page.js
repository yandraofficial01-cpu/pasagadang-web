'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home(){
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [properties, setProperties] = useState([])
  const [materials, setMaterials] = useState([])
  const [estetikas, setEstetikas] = useState([])
  const [blogs, setBlogs] = useState([])
  const API = process.env.NEXT_PUBLIC_API_URL

  const COLORS = { gold: '#D4AF37', cream: '#FFFBF0', dark: '#0B0B0F' }

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    if(!API) return
    fetch(`${API}/properties?is_published=true&limit=6`).then(r=>r.json()).then(j=>setProperties(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/materials?is_active=true&limit=6`).then(r=>r.json()).then(j=>setMaterials(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/estetikas?is_active=true&limit=6`).then(r=>r.json()).then(j=>setEstetikas(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/blogs?is_published=true&limit=6`).then(r=>r.json()).then(j=>setBlogs(j.data||j.items||j||[])).catch(()=>{})
  },[API])

  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }
  const isDark = theme==='dark'

  return (
    <main className={`${isDark? 'bg-[#0B0B0F] text-white' : 'bg-[#FFFBF0] text-black'} min-h-screen transition-colors duration-300`}>
      <style>{`
        @keyframes float { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.08)} }
        @keyframes dash { 0%{stroke-dashoffset:24} 100%{stroke-dashoffset:0} }
        @keyframes arrow { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
      .arrow { animation: arrow 1.2s ease-in-out infinite; display:inline-block; }
      .scroll-hide::-webkit-scrollbar { display: none; }
      .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAVBAR - FIX DARK/LIGHT */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-4 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/" className="font-black text-[22px]">PASA<span style={{color:COLORS.gold}}>GADANG</span><span className="text-[10px] ml-2 tracking-[0.3em] opacity-50">.COM</span></Link>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center transition ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full border shadow-sm flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span>
          </button>
        </div>
      </nav>

      {open && (
        <div className={`px-6 py-6 border-b space-y-1 shadow-xl ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black border-b ${isDark?'border-white/10':'border-black/5'}`}>01 • PROPERTI <span className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center arrow">→</span></Link>
          <Link href="/estetikas" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black border-b ${isDark?'border-white/10':'border-black/5'}`}>02 • ESTETIKA <span className={`w-9 h-9 rounded-full flex items-center justify-center arrow border ${isDark?'bg-white text-black border-white':'bg-white text-black border-black'}`}>↗</span></Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black border-b ${isDark?'border-white/10':'border-black/5'}`}>03 • MATERIAL <span className="w-9 h-9 bg-[#D4AF37] text-black rounded-full flex items-center justify-center arrow">→</span></Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black border-b ${isDark?'border-white/10':'border-black/5'}`}>04 • BLOG <span className="w-9 h-9 bg-zinc-100 text-black rounded-full flex items-center justify-center arrow">→</span></Link>
          <Link href="/admin/login" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-widest flex items-center justify-center gap-2 mt-4 border border-white/10">LOGIN ADMIN <span className="arrow">→</span></Link>
        </div>
      )}

      {/* DIAGRAM - FIX DARK/LIGHT TOTAL */}
      <div className="max-w-[400px] mx-auto px-6 pt-4">
        <p className={`text-[14px] ${isDark?'text-zinc-400':'text-zinc-500'}`}>Klik diagram di bawah - konsumen bisa pilih jalur pencarian langsung!</p>
        <div className="relative w-full h-[540px] mt-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 540">
            <line x1="170" y1="270" x2="170" y2="85" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite'}}/>
            <line x1="170" y1="270" x2="170" y2="455" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.3s'}}/>
            <line x1="170" y1="270" x2="55" y2="270" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.5s'}}/>
            <line x1="170" y1="270" x2="285" y2="270" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.7s'}}/>
          </svg>

          <div className="absolute top-1/2 left-1/2 w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center text-black font-black z-30 shadow-[0_0_0_8px_rgba(0,0,0,0),0_8px_24px_rgba(212,175,55,0.5)]" style={{background:COLORS.gold, transform:'translate(-50%,-50%)', animation:'float 3s ease-in-out infinite', boxShadow: isDark? '0 0 0 8px #0B0B0F, 0 8px 30px rgba(212,175,55,0.5)' : '0 0 0 8px #FFFBF0, 0 8px 24px rgba(212,175,55,0.4)'}}>
            <div className="text-[8px] tracking-widest opacity-60">PASA</div><div className="text-[14px]">GADANG</div><div className="text-[6px] tracking-[0.3em]">.COM</div>
          </div>

          {/* PROPERTI - FIX DARK */}
          <Link href="/properties" className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[190px] z-20">
            <div className={`p-3.5 rounded-[20px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-105 transition ${isDark?'bg-white text-black border-white':'bg-white text-black border-black/5'}`}>
              <div><div className="text-[10px] font-black opacity-50">01 • {properties.length} UNIT</div><div className="font-black text-[14px] mt-0.5">PROPERTI</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div>
            </div>
          </Link>

          {/* BLOG - FIX DARK */}
          <Link href="/blogs" className="absolute top-1/2 left-0 -translate-y-1/2 w-[152px] z-20">
            <div className={`p-3.5 rounded-[18px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-105 transition ${isDark?'bg-[#1A1A1F] text-white border border-white/10':'bg-black text-white'}`}>
              <div><div className="text-[10px] font-bold opacity-60">04 • TIPS</div><div className="font-black text-[14px] mt-0.5">BLOG</div></div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-[12px]">→</div>
            </div>
          </Link>

          {/* ESTETIKA - FIX DARK */}
          <Link href="/estetikas" className="absolute top-1/2 right-0 -translate-y-1/2 w-[152px] z-20">
            <div className={`p-3.5 rounded-[18px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-105 transition ${isDark?'bg-white text-black border-white':'bg-white text-black border-black/5'}`}>
              <div><div className="text-[10px] font-bold opacity-50">02 • ROSTER</div><div className="font-black text-[13px] mt-0.5">ESTETIKA</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow" style={{transform:'rotate(-45deg)'}}>→</span></div>
            </div>
          </Link>

          {/* MATERIAL - TETAP GOLD */}
          <Link href="/materials" className="absolute bottom-[12px] left-1/2 -translate-x-1/2 w-[190px] z-20">
            <div className="p-3.5 rounded-[20px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-105 transition" style={{background:COLORS.gold}}>
              <div><div className="text-[10px] font-black opacity-70">03 • SEMEN, BESI</div><div className="font-black text-[14px] mt-0.5 text-black">MATERIAL</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div>
            </div>
          </Link>
        </div>
      </div>

      {/* PROMO - FIX DARK */}
      <div className="max-w-[400px] mx-auto px-6 pb-20 space-y-8 mt-2">
        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[16px]">PROPERTI <span style={{color:COLORS.gold}}>PROMO</span></h2><Link href="/properties" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide mt-3 pb-2">
            {properties.length===0? [1,2,3].map(i=><div key={i} className={`min-w-[240px] h-[160px] border rounded-[20px] animate-pulse ${isDark?'bg-white/5 border-white/10':'bg-white border-black/5'}`}></div>) :
            properties.map(p=>(
              <Link key={p.id} href={`/properties/${p.slug}`} className={`min-w-[240px] border rounded-[22px] overflow-hidden ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'}`}>
                <div className="h-[110px] bg-zinc-800 relative"><img src={p.thumbnail||p.foto_1} className="w-full h-full object-cover"/><div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[10px] font-black px-2 py-1 rounded-full">{p.tipe_transaksi||'DIJUAL'}</div></div>
                <div className="p-3"><div className="font-bold text-[13px] line-clamp-1">{p.judul}</div><div className="font-black text-[12px] mt-1">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div></div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[14px]">ESTETIKA <span style={{color:COLORS.gold}}>ROSTER • GRANIT</span></h2><Link href="/estetikas" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide mt-3 pb-2">
            {estetikas.map(e=>(
              <Link key={e.id} href={`/estetikas/${e.slug}`} className={`min-w-[150px] border rounded-[18px] p-2.5 ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}><div className="h-[70px] rounded-[10px] overflow-hidden bg-zinc-800"><img src={e.foto_bahan_1} className="w-full h-full object-cover"/></div><div className="font-bold text-[11px] mt-2">{e.nama}</div><div className="text-[11px] font-black mt-1" style={{color:COLORS.gold}}>Rp {Number(e.harga||0).toLocaleString('id-ID')}</div></Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[14px]">MATERIAL <span style={{color:COLORS.gold}}>BANGUNAN</span></h2><Link href="/materials" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide mt-3 pb-2">
            {materials.map(m=>(
              <Link key={m.id} href={`/materials/${m.slug}`} className={`min-w-[150px] border rounded-[18px] p-2.5 ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}><div className="h-[70px] rounded-[10px] overflow-hidden bg-zinc-800"><img src={m.foto_1} className="w-full h-full object-cover"/></div><div className="font-bold text-[11px] mt-2">{m.nama}</div><div className="text-[10px] opacity-60">{m.brand}</div></Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[14px]">BLOG <span style={{color:COLORS.gold}}>TERBARU</span></h2><Link href="/blogs" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide mt-3 pb-2">
            {blogs.map(b=>(
              <Link key={b.id} href={`/blogs/${b.slug}`} className={`min-w-[210px] border rounded-[18px] p-3 flex gap-3 ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}><img src={b.thumbnail} className="w-[60px] h-[60px] rounded-[10px] object-cover"/><div><div className="font-bold text-[11px] line-clamp-2">{b.judul}</div><div className="text-[10px] opacity-60 mt-1">{b.kategori}</div></div></Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
        }
