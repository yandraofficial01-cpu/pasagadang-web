'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const COLORS = { gold: '#D4AF37', red: '#B22222', cream: '#FFFBF0', dark: '#0B0B0F' }

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
        <svg viewBox="0 0 165 10" className="w-full h-full">
          <path d="M0 6 Q22 0 44 4 T88 4 T132 3 T165 1 Q132 7 88 7 T44 7 T0 6" fill="#D4AF37" opacity="0.9"/>
          <path d="M18 9 Q40 6 62 7.5 T106 7.5 T148 6 Q106 10 62 10.5 T18 9" fill="#D4AF37" opacity="0.8"/>
        </svg>
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
        const list = Array.isArray(j)? j : j.blogs || j.data || []
        setBlogs(list)
      }catch(e){ console.error(e) } finally{ setLoading(false) }
    }
    load()
  },[])

  const isDark = theme==='dark'
  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }

  const kategoriList = useMemo(()=> ['semua',...new Set(blogs.map(b=>b.kategori).filter(Boolean))],[blogs])

  const filtered = useMemo(()=> blogs.filter(b=>{
    const matchKat = kat==='semua' || (b.kategori||'').toLowerCase() === kat.toLowerCase()
    const matchSearch = search==='' || b.judul.toLowerCase().includes(search.toLowerCase()) || (b.excerpt||'').toLowerCase().includes(search.toLowerCase())
    return matchKat && matchSearch
  }),[blogs, kat, search])

  const groupedByCat = useMemo(()=>{
    const g = {}
    blogs.forEach(b=>{
      const k = b.kategori || 'Lainnya'
      if(!g[k]) g[k]=[]
      g[k].push(b)
    })
    return g
  },[blogs])

  const totalPages = Math.ceil(filtered.length / perPage) || 1
  const paginated = filtered.slice((page-1)*perPage, page*perPage)

  if(loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'}`}>
      <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      <p className="font-black text-[11px] tracking-[0.3em] animate-pulse">PASA GADANG STUDIO</p>
    </div>
  )

  return(
    <main className={`${isDark?'bg-[#08080A] text-white':'bg-[#FFFBF0] text-black'} min-h-screen transition-colors duration-500 overflow-x-hidden`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');
       .scrollbar-hide::-webkit-scrollbar{display:none}
       .scrollbar-hide{-ms-overflow-style:none; scrollbar-width:none}
        @keyframes fadeUp { from {opacity:0; transform: translateY(12px)} to {opacity:1; transform: translateY(0)} }
       .anim-fadeUp{animation: fadeUp 0.6s ease forwards}
      `}</style>

      {/* NAV PREMIUM */}
      <nav className={`sticky top-0 z-50 backdrop-blur-2xl border-b px-6 py-3.5 flex justify-between items-center transition-all ${isDark?'bg-[#0B0B0F]/80 border-white/[0.06] shadow-[0_1px_20px_rgba(0,0,0,0.5)]':'bg-[#FFFBF0]/80 border-black/[0.06] shadow-[0_1px_20px_rgba(0,0,0,0.04)]'}`}>
        <Link href="/"><LogoPasagadang /></Link>
        <div className="flex gap-2 items-center">
          <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md transition hover:scale-105 ${isDark?'bg-white/10 border-white/10':'bg-white border-black/5 shadow-sm'}`}>{isDark?'🌙':'☀️'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-1.5 transition hover:scale-105 ${isDark?'bg-white text-black border-white':'bg-black text-white border-black'}`}>
            <span className={`w-5 h-[2px] bg-current transition-all duration-300 ${open?'rotate-45 translate-y-[7px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-current transition-all ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-current transition-all duration-300 ${open?'-rotate-45 -translate-y-[7px]':''}`}></span>
          </button>
        </div>
      </nav>

      {open && (
        <div className={`px-6 py-6 border-b sticky top-[66px] z-40 anim-fadeUp ${isDark?'bg-[#0E0E12]/95 backdrop-blur-2xl border-white/10':'bg-white/95 backdrop-blur-2xl border-black/5'}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3">
            {[
              {href:'/properties', label:'PROPERTI', no:'01'},
              {href:'/estetika', label:'ESTETIKA', no:'02'},
              {href:'/materials', label:'MATERIAL', no:'03'},
              {href:'/blogs', label:'BLOG', no:'04'},
            ].map(m=>(
              <Link key={m.href} href={m.href} onClick={()=>setOpen(false)} className={`group flex justify-between items-center p-4 rounded-2xl border font-black text-[12px] tracking-widest transition ${isDark?'bg-white/[0.04] border-white/10 hover:bg-[#D4AF37] hover:text-black':'bg-black/[0.02] border-black/5 hover:bg-black hover:text-white'}`}>
                <span>{m.no} • {m.label}</span><span className="group-hover:translate-x-1 transition">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[1.8fr_0.9fr] gap-10">
        {/* KIRI */}
        <div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4AF37]/10 blur-[60px] rounded-full pointer-events-none"></div>
            <h1 className="text-[38px] md:text-[56px] font-black tracking-[-0.04em] leading-[0.9] font-[Plus_Jakarta_Sans]" style={{fontFamily:'Plus Jakarta Sans'}}>
              BLOG <span className="bg-gradient-to-r from-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">PASA GADANG</span>
            </h1>
            <p className={`${isDark?'text-white/40':'text-black/50'} text-[11px] font-black tracking-[0.2em] mt-4 uppercase`}>{filtered.length} dari {blogs.length} artikel • Tips rumah Minang • Padang</p>
          </div>

          <div className="flex gap-2 mt-8 overflow-x-auto pb-3 scrollbar-hide">
            {kategoriList.map(k=>(
              <button key={k} onClick={()=>{setKat(k); setPage(1)}} className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border shrink-0 transition-all duration-300 hover:scale-[1.02] ${kat===k?'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.3)]': isDark?'bg-white/[0.06] border-white/10 text-white/60 hover:bg-white/10':'bg-white border-black/10 text-black/60 hover:border-[#D4AF37]/40 shadow-sm'}`}>{k}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {paginated.map((b,i)=>(
              <Link key={b.id} href={`/blogs/${b.slug}`} className={`group rounded-[24px] overflow-hidden border anim-fadeUp ${isDark?'bg-[#121216] border-white/[0.06] hover:border-[#D4AF37]/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]':'bg-white border-black/[0.06] hover:border-[#D4AF37]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]'} transition-all duration-500`} style={{animationDelay:`${i*80}ms`}}>
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-900">
                  <img src={b.thumbnail} alt={b.judul} className="w-full h-full object-cover object-top group-hover:scale-[1.08] transition duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)]"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{b.kategori||'BLOG'}</div>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 items-center text-[10px] opacity-50 font-bold">
                    <span>{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID') : ''}</span>
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    <span>{b.views||0} views</span>
                  </div>
                  <h3 className="font-black text-[16px] leading-[1.25] mt-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2 tracking-tight">{b.judul}</h3>
                  <p className="text-[12.5px] opacity-60 line-clamp-2 mt-2 leading-relaxed">{b.excerpt || b.konten?.replace(/<[^>]+>/g,'').slice(0,120)}</p>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-black tracking-widest">
                    <span className="text-[#2563EB] group-hover:gap-3 flex items-center gap-2 transition-all">READ MORE <span className="group-hover:translate-x-1 transition">→</span></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex gap-2 mt-12 flex-wrap items-center">
            <div className="w-full h-[1px] bg-gradient-to-r from-[#2563EB] to-transparent mb-6"></div>
            {Array.from({length: Math.min(totalPages,4)}).map((_,i)=>{
              const p = i+1
              return <button key={p} onClick={()=>setPage(p)} className={`w-11 h-11 rounded-xl border font-black text-[13px] transition-all duration-300 hover:scale-105 ${page===p?'bg-[#2563EB] text-white border-[#2563EB] shadow-[0_8px_20px_rgba(37,99,235,0.3)]':'bg-white text-[#2563EB] border-black/10 hover:border-[#2563EB]'}`}>{p}</button>
            })}
            {totalPages>5 && <>
              <span className="w-11 h-11 rounded-xl border bg-white flex items-center justify-center text-black/30">...</span>
              <button onClick={()=>setPage(totalPages)} className={`w-11 h-11 rounded-xl border font-black ${page===totalPages?'bg-[#2563EB] text-white':'bg-white text-[#2563EB]'}`}>{totalPages}</button>
            </>}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-6 h-11 rounded-xl bg-black text-white font-black text-[11px] tracking-widest hover:bg-[#D4AF37] hover:text-black transition">NEXT →</button>
          </div>
        </div>

        {/* KANAN PREMIUM SIDEBAR */}
        <div className="space-y-8 lg:sticky lg:top-[90px] h-fit">
          <div className={`p-5 rounded-[20px] border ${isDark?'bg-[#121216] border-white/10':'bg-white border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]'}`}>
            <h3 className="font-black text-[13px] tracking-[0.2em]">PENCARIAN</h3>
            <div className={`mt-4 flex items-center px-4 py-3.5 rounded-full border transition focus-within:border-[#D4AF37] ${isDark?'bg-black/50 border-white/10':'bg-[#F5F5F5] border-black/5'}`}>
              <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1)}} placeholder="Cari tips rumah..." className="flex-1 bg-transparent outline-none text-[14px] font-bold placeholder:text-black/30"/>
              <span className="opacity-40">⌕</span>
            </div>
          </div>

          <div className="rounded-[20px] overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" alt="Explore" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-[1.5s]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-black text-[11px] tracking-[0.3em]">ESTETIKA MINANG</p>
              <p className="text-white font-black text-[18px] leading-tight mt-1">Hunian yang menghormati adat</p>
            </div>
          </div>

          {Object.entries(groupedByCat).slice(0,3).map(([catName, items])=>(
            <div key={catName} className={`p-5 rounded-[20px] border ${isDark?'bg-[#121216] border-white/[0.06]':'bg-white border-black/[0.05] shadow-sm'}`}>
              <h3 className="font-black text-[13px] tracking-[0.2em] uppercase mb-5 flex items-center gap-2"><span className="w-1 h-4 bg-[#D4AF37] rounded-full"></span>{catName}</h3>
              <div className="space-y-5">
                {items.slice(0,3).map(b=>(
                  <Link key={b.id} href={`/blogs/${b.slug}`} className="flex gap-3 group">
                    <div className="w-[84px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-zinc-200">
                      <img src={b.thumbnail} className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-[13px] leading-[1.3] group-hover:text-[#D4AF37] transition line-clamp-2">{b.judul}</h4>
                      <div className="flex items-center gap-1 mt-1.5 opacity-40 text-[10px] font-bold">📅 {b.created_at? new Date(b.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short'}):''}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-24 right-6 z-[90] w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-[#D4AF37] hover:text-black hover:scale-110 transition-all">↑</button>
      <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang%20saya%20mau%20tanya%20blog" target="_blank" className="fixed bottom-6 right-6 z-[90] w-[58px] h-[58px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.5)] border-[3px] border-white hover:scale-110 transition">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M19.05 4.91A9.93 9.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.14 1.6 5.94L0 24l6.35-1.66A11.9 11.9 0 0 0 12 23.88h.01c6.53 0 11.86-5.33 11.86-11.88 0-3.17-1.24-6.16-3.49-8.4Z"/></svg>
      </a>
    </main>
  )
        }
