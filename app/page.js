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

  const waLink = (p)=>{
    const text = encodeURIComponent(`Halo Pasa Gadang, saya mau tanya properti ${p.judul} - ${p.kecamatan||''} harga Rp ${Number(p.harga_cash||0).toLocaleString('id-ID')} \nLink: https://pasagadang-web.vercel.app/properties/${p.slug}`)
    return `https://wa.me/6281234567890?text=${text}`
  }

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

      <div className="max-w-[400px] mx-auto px-6 pt-4">
        <p className={`text-[14px] ${isDark?'text-zinc-400':'text-zinc-500'}`}>Klik diagram di bawah - konsumen bisa pilih jalur pencarian langsung!</p>
        <div className="relative w-full h-[540px] mt-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 540">
            <line x1="170" y1="270" x2="170" y2="85" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite'}}/>
            <line x1="170" y1="270" x2="170" y2="455" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.3s'}}/>
            <line x1="170" y1="270" x2="55" y2="270" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.5s'}}/>
            <line x1="170" y1="270" x2="285" y2="270" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.7s'}}/>
          </svg>
          <div className="absolute top-1/2 left-1/2 w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center text-black font-black z-30" style={{background:COLORS.gold, transform:'translate(-50%,-50%)', animation:'float 3s ease-in-out infinite', boxShadow: isDark? '0 0 0 8px #0B0B0F, 0 8px 30px rgba(212,175,55,0.5)' : '0 0 0 8px #FFFBF0, 0 8px 24px rgba(212,175,55,0.4)'}}>
            <div className="text-[8px] tracking-widest opacity-60">PASA</div><div className="text-[14px]">GADANG</div><div className="text-[6px] tracking-[0.3em]">.COM</div>
          </div>
          <Link href="/properties" className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[190px] z-20">
            <div className={`p-3.5 rounded-[20px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-105 transition ${isDark?'bg-white text-black border-white':'bg-white text-black border-black/5'}`}>
              <div><div className="text-[10px] font-black opacity-50">01 • {properties.length} UNIT</div><div className="font-black text-[14px] mt-0.5">PROPERTI</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div>
            </div>
          </Link>
          <Link href="/blogs" className="absolute top-1/2 left-0 -translate-y-1/2 w-[152px] z-20">
            <div className={`p-3.5 rounded-[18px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-105 transition ${isDark?'bg-[#1A1A1F] text-white border border-white/10':'bg-black text-white'}`}>
              <div><div className="text-[10px] font-bold opacity-60">04 • TIPS</div><div className="font-black text-[14px] mt-0.5">BLOG</div></div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-[12px]">→</div>
            </div>
          </Link>
          <Link href="/estetikas" className="absolute top-1/2 right-0 -translate-y-1/2 w-[152px] z-20">
            <div className={`p-3.5 rounded-[18px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-105 transition ${isDark?'bg-white text-black border-white':'bg-white text-black border-black/5'}`}>
              <div><div className="text-[10px] font-bold opacity-50">02 • ROSTER</div><div className="font-black text-[13px] mt-0.5">ESTETIKA</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow" style={{transform:'rotate(-45deg)'}}>→</span></div>
            </div>
          </Link>
          <Link href="/materials" className="absolute bottom-[12px] left-1/2 -translate-x-1/2 w-[190px] z-20">
            <div className="p-3.5 rounded-[20px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-105 transition" style={{background:COLORS.gold}}>
              <div><div className="text-[10px] font-black opacity-70">03 • SEMEN, BESI</div><div className="font-black text-[14px] mt-0.5 text-black">MATERIAL</div></div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"><span className="arrow">→</span></div>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-[400px] mx-auto px-6 pb-20 space-y-8 mt-2">
        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[16px]">PROPERTI <span style={{color:COLORS.gold}}>PROMO</span></h2><Link href="/properties" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-4 overflow-x-auto scroll-hide mt-4 pb-2">
            {properties.length===0? [1,2,3].map(i=><div key={i} className={`min-w-[260px] h-[380px] border rounded-[22px] animate-pulse ${isDark?'bg-white/5 border-white/10':'bg-white border-black/5'}`}></div>) :
            properties.map(p=>(
              <div key={p.id} className={`min-w-[270px] max-w-[270px] rounded-[24px] overflow-hidden flex flex-col relative ${isDark?'bg-[#121214]':'bg-white'} shadow-[0_10px_40px_rgba(0,0,0,0.12)]`} style={{border:'2px solid #D4AF37', boxShadow:'0 0 0 1px rgba(212,175,55,0.3), 0 10px 40px rgba(212,175,55,0.15)'}}>
                <Link href={`/properties/${p.slug}`} className="block">
                  <div className="h-[210px] bg-zinc-800 relative overflow-hidden">
                    <img src={p.thumbnail||p.foto_1||p.foto_2} className="w-full h-full object-cover hover:scale-110 transition duration-700" alt={p.judul}/>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full border border-black/10 shadow"> {p.tipe_transaksi?.toUpperCase()||'JUAL'} </div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur text-white text-[10px] px-3 py-1.5 rounded-full border border-white/10">
                      {p.kecamatan||'Padang'} • {p.sertifikat||'SHM'}
                    </div>
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/properties/${p.slug}`}><div className="font-black text-[14px] leading-tight line-clamp-2 min-h-[36px] hover:text-[#D4AF37] transition">{p.judul}</div></Link>
                  <div className="font-black text-[17px] mt-2" style={{color:COLORS.gold}}>Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
                  {p.harga_kredit? <div className="text-[10px] opacity-70 mt-1">Kredit DP {Number(p.dp||0).toLocaleString('id-ID')} • {p.tenor_bulan}bln x {Number(p.cicilan_per_bulan||0).toLocaleString('id-ID')}</div> : <div className="text-[10px] opacity-50 mt-1">Cash keras • Siap survei</div>}
                  <div className={`grid grid-cols-4 gap-2 mt-3 text-[10px] p-2.5 rounded-xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/20'}`}>
                    <div className="text-center"><div className="opacity-50 text-[9px]">LT</div><div className="font-black text-[11px]">{p.luas_tanah||0}m²</div></div>
                    <div className="text-center"><div className="opacity-50 text-[9px]">LB</div><div className="font-black text-[11px]">{p.luas_bangunan||0}m²</div></div>
                    <div className="text-center"><div className="opacity-50 text-[9px]">KT</div><div className="font-black text-[11px]">{p.kamar_tidur||0}</div></div>
                    <div className="text-center"><div className="opacity-50 text-[9px]">KM</div><div className="font-black text-[11px]">{p.kamar_mandi||0}</div></div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-[11px] font-black py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(37,211,102,0.3)] hover:scale-[1.02] transition">
                      <span>💬</span> WA
                    </a>
                    <Link href={`/properties/${p.slug}`} className={`text-[11px] font-black py-2.5 rounded-full flex items-center justify-center gap-1 border ${isDark?'bg-white text-black border-white':'bg-black text-white border-black'}`}>
                      DETAIL →
                    </Link>
                  </div>
                  <div className="mt-2 text-[9px] opacity-40 text-center">{p.views||0} views • Premium Listing</div>
                </div>
              </div>
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
      </div>
    </main>
  )
}
