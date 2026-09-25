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

  const COLORS = { gold: '#D4AF37', cream: '#FFFBF0' }

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
    <main className={`${isDark? 'bg-[#0B0B0F] text-white' : 'bg-[#FFFBF0] text-black'} min-h-screen`}>
      <style>{`
        @keyframes float { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.08)} }
        @keyframes dash { 0%{stroke-dashoffset:24} 100%{stroke-dashoffset:0} }
        @keyframes arrow { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
     .arrow { animation: arrow 1.2s ease-in-out infinite; display:inline-block; }
     .scroll-hide::-webkit-scrollbar { display: none; }
     .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-4 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/80 border-white/5':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/" className="font-black text-[22px]">PASA<span style={{color:COLORS.gold}}>GADANG</span><span className="text-[10px] ml-2 tracking-[0.3em] opacity-50">.COM</span></Link>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center">{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className="w-10 h-10 rounded-full bg-white border shadow-sm flex flex-col items-center justify-center gap-1.5">
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span>
          </button>
        </div>
      </nav>

      {open && (
        <div className={`px-6 py-6 border-b space-y-1 ${isDark?'bg-[#0B0B0F]':'bg-white'} shadow-xl`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5">01 • PROPERTI <span className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center arrow">→</span></Link>
          <Link href="/estetikas" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5">02 • ESTETIKA <span className="w-9 h-9 border border-black rounded-full flex items-center justify-center arrow">↗</span></Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5">03 • MATERIAL <span className="w-9 h-9 bg-[#D4AF37] rounded-full flex items-center justify-center arrow">→</span></Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className="flex justify-between items-center py-4 font-black border-b border-black/5">04 • BLOG <span className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center arrow">→</span></Link>
          <Link href="/admin/login" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-widest flex items-center justify-center gap-2 mt-4">LOGIN ADMIN <span className="arrow">→</span></Link>
        </div>
      )}

      {/* DIAGRAM */}
      <div className="max-w-[400px] mx-auto px-6 pt-4">
        <p className="text-[14px] text-zinc-500">Klik diagram di bawah - konsumen bisa pilih jalur pencarian langsung!</p>
        <div className="relative w-full h-[540px] mt-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 540">
            <line x1="170" y1="270" x2="170" y2="85" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite'}}/>
            <line x1="170" y1="270" x2="170" y2="455" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.3s'}}/>
            <line x1="170" y1="270" x2="55" y2="270" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.5s'}}/>
            <line x1="170" y1="270" x2="285" y2="270" stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.7s'}}/>
          </svg>
          <div className="absolute top-1/2 left-1/2 w-[86px] h-[86px] rounded-full flex flex-col items-center justify-center text-black font-black z-30 shadow-[0_0_0_8px_#FFFBF0,0_8px_24px_rgba(212,175,55,0.4)]" style={{background:COLORS.gold, transform:'translate(-50%,-50%)', animation:'float 3s ease-in-out infinite'}}>
            <div className="text-[8px] tracking-widest opacity-60">PASA</div><div className="text-[14px]">GADANG</div><div className="text-[6px] tracking-[0.3em]">.COM</div>
          </div>
          <Link href="/properties" className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[190px] z-20"><div className="bg-white p-3.5 rounded-[20px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.08)]"><div><div className="text-[10px] font-black opacity-50">01 • {properties.length} UNIT</div><div className="font-black text-[14px] mt-0.5">PROPERTI</div></div><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div></div></Link>
          <Link href="/blogs" className="absolute top-1/2 left-0 -translate-y-1/2 w-[152px] z-20"><div className="p-3.5 rounded-[18px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] bg-black text-white"><div><div className="text-[10px] font-bold opacity-60">04 • TIPS</div><div className="font-black text-[14px] mt-0.5">BLOG</div></div><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-[12px]">→</div></div></Link>
          <Link href="/estetikas" className="absolute top-1/2 right-0 -translate-y-1/2 w-[152px] z-20"><div className="bg-white p-3.5 rounded-[18px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.08)]"><div><div className="text-[10px] font-bold opacity-50">02 • ROSTER</div><div className="font-black text-[13px] mt-0.5">ESTETIKA</div></div><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow" style={{transform:'rotate(-45deg)'}}>→</span></div></div></Link>
          <Link href="/materials" className="absolute bottom-[12px] left-1/2 -translate-x-1/2 w-[190px] z-20"><div className="p-3.5 rounded-[20px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.15)]" style={{background:COLORS.gold}}><div><div className="text-[10px] font-black opacity-70">03 • SEMEN, BESI</div><div className="font-black text-[14px] mt-0.5">MATERIAL</div></div><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div></div></Link>
        </div>
      </div>

      {/* PROMO SCROLL HORIZONTAL */}
      <div className="max-w-[400px] mx-auto px-6 pb-20 space-y-8 mt-2">

        {/* 1. PROPERTI */}
        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[16px] tracking-tighter">PROPERTI <span style={{color:COLORS.gold}}>PROMO</span></h2><Link href="/properties" className="text-[11px] font-bold tracking-widest flex gap-1 items-center">LIHAT SEMUA <span className="arrow">→</span></Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide snap-x snap-mandatory mt-3 pb-2">
            {properties.length===0? [1,2,3].map(i=><div key={i} className="min-w-[240px] h-[160px] bg-white border rounded-[20px] animate-pulse"></div>) :
            properties.map(p=>(
              <Link key={p.id} href={`/properties/${p.slug}`} className="min-w-[240px] snap-start bg-white border rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] group">
                <div className="h-[120px] bg-zinc-100 relative overflow-hidden">
                  {p.thumbnail||p.foto_1? <img src={p.thumbnail||p.foto_1} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/> : <div className="w-full h-full bg-zinc-200"/>}
                  <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full">{p.tipe_transaksi||'DIJUAL'}</div>
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full">{p.kecamatan} • {p.tipe_properti}</div>
                </div>
                <div className="p-3"><div className="font-bold text-[13px] line-clamp-1">{p.judul}</div><div className="text-[11px] opacity-60 mt-0.5">{p.luas_tanah}m² / {p.luas_bangunan}m² • {p.kamar_tidur}KT</div><div className="font-black text-[13px] mt-2">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div></div>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. ESTETIKA - ROSTER, GRANIT, BATU ALAM */}
        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[16px] tracking-tighter">ESTETIKA <span style={{color:COLORS.gold}}>ROSTER • GRANIT • BATU ALAM</span></h2><Link href="/estetikas" className="text-[11px] font-bold tracking-widest">LIHAT SEMUA →</Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide snap-x snap-mandatory mt-3 pb-2">
            {estetikas.length===0? [1,2,3].map(i=><div key={i} className="min-w-[160px] h-[140px] bg-white border rounded-[20px] animate-pulse"></div>) :
            estetikas.map(e=>(
              <Link key={e.id} href={`/estetikas/${e.slug}`} className="min-w-[160px] snap-start bg-white border rounded-[20px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="h-[80px] rounded-[12px] overflow-hidden bg-zinc-100"><img src={e.foto_bahan_1||e.thumbnail} className="w-full h-full object-cover"/></div>
                <div className="font-bold text-[12px] mt-2 line-clamp-1">{e.nama}</div>
                <div className="text-[10px] opacity-60 mt-1">{e.kategori}</div>
                <div className="text-[12px] font-black mt-1" style={{color:COLORS.gold}}>Rp {Number(e.harga||0).toLocaleString('id-ID')}/{e.satuan}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. MATERIAL */}
        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[16px] tracking-tighter">MATERIAL <span style={{color:COLORS.gold}}>BANGUNAN</span></h2><Link href="/materials" className="text-[11px] font-bold tracking-widest">LIHAT SEMUA →</Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide snap-x snap-mandatory mt-3 pb-2">
            {materials.length===0? [1,2,3].map(i=><div key={i} className="min-w-[160px] h-[140px] bg-white border rounded-[20px] animate-pulse"></div>) :
            materials.map(m=>(
              <Link key={m.id} href={`/materials/${m.slug}`} className="min-w-[160px] snap-start bg-white border rounded-[20px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="h-[80px] rounded-[12px] overflow-hidden bg-zinc-100"><img src={m.foto_1} className="w-full h-full object-cover"/></div>
                <div className="font-bold text-[12px] mt-2 line-clamp-1">{m.nama}</div>
                <div className="text-[10px] opacity-60 mt-1">{m.brand} • {m.kategori}</div>
                <div className="text-[12px] font-black mt-1">Rp {Number(m.harga||0).toLocaleString('id-ID')}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. BLOG TERBARU */}
        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[16px] tracking-tighter">BLOG <span style={{color:COLORS.gold}}>TERBARU</span></h2><Link href="/blogs" className="text-[11px] font-bold tracking-widest">LIHAT SEMUA →</Link></div>
          <div className="flex gap-3 overflow-x-auto scroll-hide snap-x snap-mandatory mt-3 pb-2">
            {blogs.length===0? [1,2,3].map(i=><div key={i} className="min-w-[220px] h-[120px] bg-white border rounded-[20px] animate-pulse"></div>) :
            blogs.map(b=>(
              <Link key={b.id} href={`/blogs/${b.slug}`} className="min-w-[220px] snap-start bg-white border rounded-[20px] p-3 flex gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <img src={b.thumbnail} className="w-[70px] h-[70px] rounded-[12px] object-cover"/>
                <div className="flex-1"><div className="font-bold text-[12px] line-clamp-2 leading-tight">{b.judul}</div><div className="text-[10px] opacity-60 mt-1">{b.kategori} • {b.views||0} views</div><div className="text-[10px] font-bold mt-2 flex items-center gap-1">BACA <span className="arrow">→</span></div></div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
