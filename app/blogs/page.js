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

  if(loading) return <div className={`min-h-screen flex items-center justify-center ${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'}`}><p className="font-black animate-pulse">LOADING BLOG PASA GADANG...</p></div>

  return(
    <main className={`${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'} min-h-screen transition-colors pb-24`}>
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
        <div className={`px-6 py-4 shadow-xl border-b sticky top-[66px] z-40 ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className={`flex justify-between py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>01 • PROPERTI →</Link>
          <Link href="/estetika" onClick={()=>setOpen(false)} className={`flex justify-between py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>02 • ESTETIKA →</Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className={`flex justify-between py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>03 • MATERIAL →</Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className={`flex justify-between py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>04 • BLOG →</Link>
          <Link href="/" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-widest flex items-center justify-center mt-4">← BERANDA</Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid lg:grid-cols-[1.8fr_0.9fr] gap-8">
        {/* KIRI */}
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">BLOG <span style={{color:COLORS.gold}}>PASA GADANG</span></h1>
          <p className={`${isDark?'text-white/50':'text-black/60'} text-[13px] font-bold mt-2`}>{filtered.length} dari {blogs.length} artikel • Tips rumah Minang</p>

          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {kategoriList.map(k=>(
              <button key={k} onClick={()=>{setKat(k); setPage(1)}} className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase border shrink-0 ${kat===k?'bg-[#D4AF37] text-black border-[#D4AF37]': isDark?'bg-white/10 border-white/10 text-white/60':'bg-white border-[#D4AF37]/30 text-black/60'}`}>{k}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {paginated.map(b=>(
              <Link key={b.id} href={`/blogs/${b.slug}`} className={`rounded-[20px] overflow-hidden border group ${isDark?'bg-[#121214] border-white/10':'bg-white border-[#D4AF37]/20'} hover:border-[#D4AF37] transition`}>
                <img src={b.thumbnail} alt={b.judul} className="h-[190px] w-full object-cover group-hover:scale-105 transition duration-500 bg-zinc-900"/>
                <div className="p-4">
                  <div className="flex gap-2 items-center">
                    <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black px-2 py-1 rounded-full uppercase">{b.kategori||'BLOG'}</span>
                    <span className="text-[10px] opacity-40">{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID'):''} • 👁️ {b.views||0}</span>
                  </div>
                  <h3 className="font-black text-[15px] leading-tight mt-2 group-hover:text-[#D4AF37] line-clamp-2">{b.judul}</h3>
                  <p className="text-[12px] opacity-60 line-clamp-2 mt-1">{b.excerpt || b.konten?.replace(/<[^>]+>/g,'').slice(0,90)}</p>
                  <span className="mt-3 inline-block bg-[#2563EB] text-white text-[12px] font-bold px-4 py-1.5 rounded-lg">Read More..</span>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION - KAYAK SCREENSHOT */}
          <div className="flex gap-2 mt-10 flex-wrap items-center border-t-4 border-[#2563EB] pt-6">
            {Array.from({length: Math.min(totalPages,4)}).map((_,i)=>{
              const p = i+1
              return <button key={p} onClick={()=>setPage(p)} className={`w-10 h-10 rounded-lg border font-medium ${page===p?'bg-[#2563EB] text-white border-[#2563EB]':'bg-white text-[#2563EB] border-black/10'}`}>{p}</button>
            })}
            {totalPages>5 && <>
              <span className="w-10 h-10 rounded-lg border bg-white flex items-center justify-center text-[#2563EB]">...</span>
              <button onClick={()=>setPage(totalPages)} className={`w-10 h-10 rounded-lg border ${page===totalPages?'bg-[#2563EB] text-white':'bg-white text-[#2563EB]'}`}>{totalPages}</button>
            </>}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-4 h-10 rounded-lg border bg-white text-[#2563EB]">Next »</button>
          </div>
        </div>

        {/* KANAN - SIDEBAR KAYA SCREENSHOT */}
        <div className="space-y-8">
          <div>
            <h3 className="font-black text-[22px]">Pencarian</h3>
            <div className={`mt-3 flex items-center px-4 py-3 rounded-lg ${isDark?'bg-[#121214] border border-white/10':'bg-[#EBEBEB]'}`}>
              <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1)}} placeholder="Cari Produk" className="flex-1 bg-transparent outline-none text-[16px] placeholder:text-black/60"/>
              <span className="text-xl">⌕</span>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600" alt="Explore" className="w-full h-[260px] object-cover"/>
          </div>

          {Object.entries(groupedByCat).slice(0,3).map(([catName, items])=>(
            <div key={catName}>
              <h3 className="font-black text-[22px] capitalize mb-4">{catName}</h3>
              <div className="space-y-4">
                {items.slice(0,3).map(b=>(
                  <Link key={b.id} href={`/blogs/${b.slug}`} className="flex gap-3 group border-b border-dashed border-black/20 pb-4 last:border-0">
                    <img src={b.thumbnail} className="w-[88px] h-[68px] rounded-lg object-cover bg-zinc-200 shrink-0"/>
                    <div>
                      <h4 className="font-bold text-[14px] leading-snug group-hover:text-[#B8960C] line-clamp-2">{b.judul}</h4>
                      <div className="flex items-center gap-1 mt-1 opacity-60 text-[12px]">📅 {b.created_at? new Date(b.created_at).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}):'Jun 23, 2025'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="font-black text-[22px]">Pengunjung</h3>
            <div className={`mt-3 text-[14px] ${isDark?'text-white/70':'text-black/80'}`}>
              <div className="flex justify-between max-w-[150px]"><span>Pages</span><span className="font-bold">843</span></div>
              <div className="flex justify-between max-w-[150px]"><span>Online</span><span className="font-bold">1</span></div>
              <div className="flex justify-between max-w-[150px]"><span>Vis. today</span><span className="font-bold">{blogs.length*3+2}</span></div>
              <div className="w-[50px] h-[3px] bg-black mt-4"></div>
            </div>
          </div>

          <div className={`border-t pt-6 space-y-4 text-[18px] ${isDark?'border-white/10':'border-black/10'}`}>
            <Link href="/" className="block hover:text-[#D4AF37]">Home</Link>
            <Link href="/tentang-kami" className="block hover:text-[#D4AF37]">Tentang Kami</Link>
            <Link href="/redaksi" className="block hover:text-[#D4AF37]">Redaksi</Link>
          </div>
        </div>
      </div>

      <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-20 right-6 z-[99] w-12 h-12 rounded-full bg-[#6B7280]/90 text-white flex items-center justify-center text-xl shadow-lg">^</button>
      <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang%20saya%20mau%20tanya%20blog" target="_blank" className="fixed bottom-6 right-6 z-[99] w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] border-[3px] border-white">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19.05 4.91A9.93 9.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.14 1.6 5.94L0 24l6.35-1.66A11.9 11.9 0 0 0 12 23.88h.01c6.53 0 11.86-5.33 11.86-11.88 0-3.17-1.24-6.16-3.49-8.4Z"/></svg>
      </a>
    </main>
  )
    }
