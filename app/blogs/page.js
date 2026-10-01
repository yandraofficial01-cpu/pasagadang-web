'use client'
import { useEffect, useState } from 'react'
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

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    const load = async()=>{
      try{
        const r = await fetch(`${API}/blogs`, { cache: 'no-store' })
        const j = await r.json()
        const list = Array.isArray(j)? j : j.blogs || j.data || []
        setBlogs(list)
      }catch(e){
        console.error("GAGAL FETCH BLOG:", e)
      }finally{
        setLoading(false)
      }
    }
    load()
  },[])

  const isDark = theme==='dark'
  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }

  const kategoriList = ['semua',...new Set(blogs.map(b=>b.kategori).filter(Boolean))]

  const filtered = blogs.filter(b=>{
    const matchKat = kat==='semua' || (b.kategori||'').toLowerCase() === kat.toLowerCase()
    const matchSearch = search==='' || b.judul.toLowerCase().includes(search.toLowerCase()) || (b.excerpt||'').toLowerCase().includes(search.toLowerCase())
    return matchKat && matchSearch
  })

  if(loading) return <div className={`min-h-screen flex items-center justify-center ${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'}`}><p className="font-black animate-pulse">LOADING BLOG PASA GADANG...</p></div>

  return(
    <main className={`${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'} min-h-screen transition-colors pb-24`}>
      {/* NAVBAR SAMA PERSIS 4 HALAMAN LAIN */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/"><LogoPasagadang /></Link>
        <div className="flex gap-2 items-center">
          <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span>
          </button>
        </div>
      </nav>

      {open && (
        <div className={`px-6 py-4 space-y-0 shadow-xl border-b sticky top-[66px] z-40 ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>01 • PROPERTI</Link>
          <Link href="/estetika" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>02 • ESTETIKA</Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>03 • MATERIAL</Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>04 • BLOG</Link>
          <Link href="/" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-widest flex items-center justify-center mt-4">← BERANDA</Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">BLOG <span style={{color:COLORS.gold}}>PASA GADANG</span></h1>
        <p className={`${isDark?'text-white/50':'text-black/60'} text-[13px] font-bold mt-2`}>Tips, inspirasi rumah & kuliner Minang dari Padang. ({filtered.length} dari {blogs.length} artikel)</p>

        <div className="mt-6 relative">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari tips bangun rumah, roster, kuliner..." className={`w-full p-5 rounded-full font-bold text-[14px] outline-none border-[2px] ${isDark?'bg-[#121214] border-white/10 text-white placeholder:text-white/40':'bg-white border-[#D4AF37] text-black placeholder:text-black/40'}`}/>
          <span className="absolute right-6 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {kategoriList.map(k=>(
            <button key={k} onClick={()=>setKat(k)}
              className={`px-5 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase border shrink-0 transition ${kat===k?'bg-[#D4AF37] text-black border-[#D4AF37]': isDark?'bg-white/10 border-white/10 text-white/60':'bg-white border-[#D4AF37]/30 text-black/60'}`}>
              {k}
            </button>
          ))}
        </div>

        {filtered.length===0? (
          <div className={`${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'} border p-10 rounded-[24px] text-center mt-8`}>
            <p className="opacity-50">Belum ada artikel untuk "{search || kat}"</p>
            <p className="text-[11px] opacity-20 mt-2">Publish dari /admin/blogs dulu bro.</p>
            <button onClick={()=>{setKat('semua'); setSearch('')}} className="mt-4 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-[12px] font-black">RESET</button>
          </div>
        ):(
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filtered.map(b=>(
              <Link key={b.id} href={`/blogs/${b.slug}`} className={`group rounded-[24px] overflow-hidden border-[2px] transition hover:scale-[1.02] ${isDark?'bg-[#121214] border-white/10 hover:border-[#D4AF37]/50':'bg-white border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.1)]'}`}>
                <div className="relative h-48 overflow-hidden bg-zinc-900">
                  <img src={b.thumbnail} alt={b.judul} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                  <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[9px] font-black px-3 py-1 rounded-full uppercase">{b.kategori||'BLOG'}</span>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-2 items-center">
                    <span className="text-[10px] opacity-40">{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID') : ''} • 👁️ {b.views||0}</span>
                  </div>
                  <h3 className="font-black text-[15px] leading-tight mb-2 group-hover:text-[#B8960C] line-clamp-2">{b.judul}</h3>
                  <p className={`text-[12px] line-clamp-2 ${isDark?'text-white/50':'text-black/50'}`}>{b.excerpt || b.konten?.replace(/<[^>]+>/g,'').substring(0,100)}</p>
                  <div className={`mt-4 text-[11px] font-black ${isDark?'text-white':'text-black'}`}>BACA →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang%20saya%20mau%20tanya%20blog" target="_blank" className="fixed bottom-6 right-6 z-[99] w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] border-[3px] border-white">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19.05 4.91A9.93 9.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.14 1.6 5.94L0 24l6.35-1.66A11.9 11.9 0 0 0 12 23.88h.01c6.53 0 11.86-5.33 11.86-11.88 0-3.17-1.24-6.16-3.49-8.4Z"/></svg>
      </a>
    </main>
  )
}
