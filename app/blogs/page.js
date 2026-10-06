'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const COLORS = { gold: '#D4AF37', red: '#B22222' }

function LogoPasagadang(){
  return (
    <div className="flex flex-col leading-none">
      <div className="flex font-black text-[24px] tracking-tight">
        <span style={{color:COLORS.red}}>PA</span>
        <span className="bg-gradient-to-b from-[#FFEB7F] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">SAGA</span>
        <span style={{color:COLORS.red}}>DANG</span>
        <span className="text-[10px] ml-1 mt-1 tracking-widest" style={{color:COLORS.red}}>.COM</span>
      </div>
      <div className="relative w-[165px] h-[8px] mt-[2px]">
        <svg viewBox="0 0 165 10" className="w-full h-full"><path d="M0 6 Q22 0 44 4 T88 4 T132 3 T165 1 Q132 7 88 7 T44 7 T0 6" fill="#D4AF37" opacity="0.9"/></svg>
      </div>
    </div>
  )
}

export default function BlogPage(){
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [kat, setKat] = useState('semua')
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState('light')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 6

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    const load = async()=>{
      try{
        const r = await fetch(`${API}/blogs`, { cache: 'no-store' })
        const j = await r.json()
        setBlogs(Array.isArray(j)? j : j.blogs || j.data || [])
      }catch(e){} finally{ setLoading(false) }
    }
    load()
  },[])

  const isDark = theme==='dark'
  const toggleTheme = ()=>{ const n = theme==='dark'?'light':'dark'; setTheme(n); localStorage.setItem('theme',n) }

  const kategoriList = useMemo(()=> ['semua',...new Set(blogs.map(b=>b.kategori).filter(Boolean))],[blogs])
  const filtered = useMemo(()=> blogs.filter(b=>{
    const matchKat = kat==='semua' || (b.kategori||'').toLowerCase() === kat.toLowerCase()
    const matchSearch = search==='' || b.judul.toLowerCase().includes(search.toLowerCase())
    return matchKat && matchSearch
  }),[blogs, kat, search])
  const groupedByCat = useMemo(()=>{ const g={}; blogs.forEach(b=>{ const k=b.kategori||'Lainnya'; if(!g[k]) g[k]=[]; g[k].push(b)}); return g },[blogs])
  const totalPages = Math.ceil(filtered.length / perPage) || 1
  const paginated = filtered.slice((page-1)*perPage, page*perPage)

  if(loading) return <div className={`min-h-screen w-screen flex flex-col gap-3 items-center justify-center ${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'}`}><div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div><p className="text-[10px] tracking-[0.4em] font-black animate-pulse">PASA GADANG</p></div>

  return(
    <main className={`${isDark?'bg-[#08080A] text-white':'bg-[#FFFBF0] text-black'} min-h-screen w-full max-w-[100vw] overflow-x-clip`}>
      <style>{`
        html,body{max-width:100vw;overflow-x:hidden!important}
        *{min-width:0}
        img{max-width:100%}
       .scrollbar-hide::-webkit-scrollbar{display:none}
       .scrollbar-hide{scrollbar-width:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
       .anim{animation:fadeUp.6s ease both}
      `}</style>

      <nav className={`sticky top-0 z-50 w-full backdrop-blur-2xl border-b px-4 md:px-6 py-3.5 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/80 border-white/[0.06]':'bg-[#FFFBF0]/80 border-black/[0.06]'}`}>
        <Link href="/"><LogoPasagadang/></Link>
        <div className="flex gap-2 items-center">
          <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center transition hover:scale-105 ${isDark?'bg-white/10 border-white/10':'bg-white border-black/10'}`}>{isDark?'🌙':'☀️'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white text-black':'bg-black text-white'}`}>
            <span className={`w-5 h-[2px] bg-current transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-current ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-current transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span>
          </button>
        </div>
      </nav>

      {open && (
        <div className={`w-full px-4 py-4 border-b anim ${isDark?'bg-[#111113] border-white/10':'bg-white border-black/5'}`}>
          <div className="grid grid-cols-2 gap-2 max-w-7xl mx-auto">
            <Link href="/properties" className="p-4 rounded-2xl bg-black text-white font-black text-[11px] tracking-widest">01 • PROPERTI</Link>
            <Link href="/blogs" className="p-4 rounded-2xl bg-[#D4AF37] text-black font-black text-[11px] tracking-widest">04 • BLOG</Link>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[1.8fr_0.9fr] gap-8 overflow-hidden">
        <div className="w-full min-w-0 overflow-hidden">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#D4AF37]/15 blur-[50px] rounded-full"></div>
            <h1 className="text-[36px] md:text-[52px] font-black tracking-tighter leading-[0.85] anim">BLOG <span className="text-[#D4AF37]">PASA GADANG</span></h1>
            <p className={`mt-3 text-[11px] font-black tracking-[0.2em] uppercase opacity-50 anim`}>{filtered.length} dari {blogs.length} artikel • Tips rumah Minang • Padang</p>
          </div>

          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide w-full pb-2">
            {kategoriList.map(k=>(
              <button key={k} onClick={()=>{setKat(k); setPage(1)}} className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border shrink-0 transition-all hover:scale-105 ${kat===k?'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.3)]':'bg-white border-black/10 text-black/60'}`}>{k}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 w-full">
            {paginated.map((b,i)=>(
              <Link key={b.id} href={`/blogs/${b.slug}`} className={`group relative rounded-[22px] overflow-hidden border w-full min-w-0 bg-white border-black/10 hover:border-[#D4AF37]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 anim ${isDark?'bg-[#121216] border-white/10':''}`} style={{animationDelay:`${i*90}ms`}}>
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition"><div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shine_1.2s_ease]"></div></div>
                <div className="w-full aspect-[4/3] overflow-hidden bg-zinc-900">
                  <img src={b.thumbnail} alt={b.judul} className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-[1.2s] ease-out"/>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 items-center">
                    <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{b.kategori||'BLOG'}</span>
                    <span className="text-[10px] opacity-40 font-bold">{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID'):''} • {b.views||0} views</span>
                  </div>
                  <h3 className="font-black text-[15px] leading-[1.25] mt-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{b.judul}</h3>
                  <p className="text-[12px] opacity-60 line-clamp-2 mt-1 leading-relaxed">{b.excerpt || b.konten?.replace(/<[^>]+>/g,'').slice(0,90)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-[#2563EB] text-white text-[11px] font-bold px-4 py-1.5 rounded-full group-hover:bg-black transition">Read More</span>
                    <span className="text-[11px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex gap-2 mt-10 flex-wrap items-center">
            <div className="w-full h-[1px] bg-gradient-to-r from-[#2563EB]/40 to-transparent mb-4"></div>
            {Array.from({length: Math.min(totalPages,4)}).map((_,i)=>{
              const p=i+1
              return <button key={p} onClick={()=>setPage(p)} className={`w-11 h-11 rounded-xl border font-black text-[13px] transition-all hover:scale-105 ${page===p?'bg-[#2563EB] text-white border-[#2563EB] shadow-lg':'bg-white text-[#2563EB] border-black/10'}`}>{p}</button>
            })}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-6 h-11 rounded-xl bg-black text-white font-black text-[11px] tracking-widest hover:bg-[#D4AF37] hover:text-black transition">NEXT →</button>
          </div>
        </div>

        <div className="w-full min-w-0 space-y-6">
          <div className={`p-5 rounded-[20px] border ${isDark?'bg-[#121216] border-white/10':'bg-white border-black/5 shadow-sm'}`}>
            <h3 className="font-black text-[12px] tracking-[0.2em]">PENCARIAN</h3>
            <div className={`mt-3 flex items-center px-4 py-3 rounded-full border ${isDark?'bg-black/40 border-white/10':'bg-[#F3F3F3] border-black/5'}`}>
              <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1)}} placeholder="Cari tips rumah..." className="flex-1 bg-transparent outline-none text-[14px] font-bold min-w-0"/>
              <span className="opacity-30">⌕</span>
            </div>
          </div>

          <div className="rounded-[20px] overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" alt="banner" className="w-full h-[280px] object-cover group-hover:scale-105 transition duration-1000"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-[10px] font-black tracking-[0.3em] opacity-70">PASA GADANG ESTETIKA</p>
              <p className="font-black text-[18px] leading-tight mt-1">Rumah Minang Modern yang Tidak Lupa Adat</p>
            </div>
          </div>

          {Object.entries(groupedByCat).slice(0,2).map(([catName, items])=>(
            <div key={catName} className={`p-5 rounded-[20px] border ${isDark?'bg-[#121216] border-white/10':'bg-white border-black/5'}`}>
              <h3 className="font-black text-[12px] tracking-[0.2em] uppercase flex gap-2 items-center"><span className="w-1 h-4 bg-[#D4AF37] rounded-full"></span>{catName}</h3>
              <div className="mt-4 space-y-4">
                {items.slice(0,3).map(b=>(
                  <Link key={b.id} href={`/blogs/${b.slug}`} className="flex gap-3 group">
                    <div className="w-[84px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-zinc-200">
                      <img src={b.thumbnail} className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700"/>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[13px] leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition">{b.judul}</h4>
                      <p className="text-[10px] opacity-40 mt-1 font-bold">{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID'):''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER PREMIUM */}
      <footer className={`mt-16 border-t ${isDark?'bg-[#0A0A0C] border-white/10':'bg-[#111111] border-white/10 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <LogoPasagadang />
            <p className="text-[12px] leading-relaxed opacity-60 mt-4 max-w-[320px]">Platform properti asli Padang. Membantu kamu cari rumah Minang yang aman, legal, dan bisa cicil 300 Jt-an tanpa tertipu developer abal-abal.</p>
            <div className="flex gap-2 mt-5">
              <a href="https://wa.me/628979879518" className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-black text-[12px]">WA</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[12px]">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[12px]">TT</a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-[11px] tracking-[0.3em] opacity-50">MENU</h4>
            <div className="mt-4 space-y-3 text-[14px] font-bold">
              <Link href="/properties" className="block hover:text-[#D4AF37] transition">Properti Padang</Link>
              <Link href="/blogs" className="block hover:text-[#D4AF37] transition">Blog & Tips</Link>
              <Link href="/tentang-kami" className="block hover:text-[#D4AF37] transition">Tentang Kami</Link>
              <Link href="/redaksi" className="block hover:text-[#D4AF37] transition">Redaksi</Link>
            </div>
          </div>
          <div>
            <h4 className="font-black text-[11px] tracking-[0.3em] opacity-50">KONTAK</h4>
            <div className="mt-4 text-[13px] leading-relaxed opacity-80">
              <p>Jl. By Pass KM 8, Padang</p>
              <p className="mt-1">Sumatera Barat, Indonesia</p>
              <p className="mt-3 font-black text-[#D4AF37]">WA 0897-9879-8518</p>
              <p className="text-[11px] opacity-50 mt-2">Senin - Sabtu, 08.00 - 18.00 WIB</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] opacity-40">
            <p>© 2026 PasaGadang.com - Hak Cipta Dilindungi. Dibuat dengan bangga di Padang.</p>
            <p className="font-black tracking-widest">ESTETIKA MINANG • MODERN • SYARIAH</p>
          </div>
        </div>
      </footer>

      <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-24 right-5 z-[90] w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:bg-[#D4AF37] hover:text-black transition">↑</button>
      <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang" target="_blank" className="fixed bottom-6 right-5 z-[90] w-[56px] h-[56px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.5)] border-[3px] border-white hover:scale-110 transition">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M19.05 4.91A9.93 9.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.14 1.6 5.94L0 24l6.35-1.66A11.9 11.9 0 0 0 12 23.88h.01c6.53 0 11.86-5.33 11.86-11.88 0-3.17-1.24-6.16-3.49-8.4Z"/></svg>
      </a>
    </main>
  )
  }
