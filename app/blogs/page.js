'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const COLORS = { gold: '#D4AF37', red: '#B22222' }

function LogoPasagadang(){
  return (
    <div className="flex flex-col leading-none">
      <div className="flex font-black text-[26px] tracking-tight">
        <span style={{color:COLORS.red}}>PA</span>
        <span className="bg-gradient-to-b from-[#FFEB7F] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">SAGA</span>
        <span style={{color:COLORS.red}}>DANG</span>
        <span className="text-[10px] ml-1 mt-1 tracking-widest" style={{color:COLORS.red}}>.COM</span>
      </div>
      <div className="relative w-[175px] h-[8px] mt-[2px]">
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
    const saved = localStorage.getItem('admin_theme') || localStorage.getItem('theme') || 'light'
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
  const toggleTheme = ()=>{ const n = theme==='dark'?'light':'dark'; setTheme(n); localStorage.setItem('theme',n); localStorage.setItem('admin_theme',n) }

  const kategoriList = useMemo(()=> {
    const counts={}
    blogs.forEach(b=>{ const k=(b.kategori||'Lainnya').trim(); counts[k]=(counts[k]||0)+1 })
    const top5 = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>k)
    return ['semua',...top5]
  },[blogs])

  const filtered = useMemo(()=> blogs.filter(b=> (kat==='semua' || (b.kategori||'').toLowerCase()===kat.toLowerCase()) && (search==='' || b.judul.toLowerCase().includes(search.toLowerCase()))),[blogs,kat,search])
  const groupedByCat = useMemo(()=>{ const g={}; blogs.forEach(b=>{ const k=b.kategori||'Lainnya'; if(!g[k]) g[k]=[]; g[k].push(b)}); return g },[blogs])
  const totalPages = Math.ceil(filtered.length / perPage) || 1
  const paginated = filtered.slice((page-1)*perPage, page*perPage)

  if(loading) return <div className="min-h-screen w-screen flex flex-col gap-3 items-center justify-center bg-[#FFFBF0] text-black"><div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div><p className="text-[10px] tracking-[0.4em] font-black animate-pulse">PASA GADANG</p></div>

  const cardBg = isDark? 'bg-[#16161E] border-white/10' : 'bg-white border-black/10'
  const textMain = isDark? 'text-white' : 'text-black'
  const textMuted = isDark? 'text-white/60' : 'text-black/60'
  const inputBg = isDark? 'bg-[#0A0A0A] border-white/10 text-white' : 'bg-[#F3F3F3] border-black/5 text-black'

  return(
    <main className={`${isDark?'bg-[#08080A] text-white':'bg-[#FFFBF0] text-black'} min-h-screen w-full max-w-[100vw] overflow-x-clip`}>
      <style>{`
        html,body{max-width:100vw;overflow-x:hidden!important}
        *{min-width:0}
        img{max-width:100%}
      .scrollbar-hide::-webkit-scrollbar{display:none}
      .scrollbar-hide{scrollbar-width:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      .anim{animation:fadeUp.5s ease both}
      `}</style>

      <nav className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b px-4 md:px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/"><LogoPasagadang/></Link>
        <div className="flex gap-2 items-center">
          <button onClick={toggleTheme} className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-sm text-[18px] ${isDark?'bg-white text-black border-white':'bg-white border-black/5 text-black'}`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-sm font-black text-[22px] leading-none ${isDark?'bg-white text-black border-white':'bg-white border-black/5 text-black'}`}>{open?'✕':'☰'}</button>
        </div>
      </nav>

      {open && (
        <div className={`w-full anim ${isDark?'bg-[#16161E] border-white/10':'bg-white border-black/5'} shadow-[0_20px_60px_rgba(0,0,0,0.12)] border-b`}>
          <div className="max-w-7xl mx-auto">
            <div className="px-6">
              {[
                {h:'/properties',t:'01 • PROPERTI'},
                {h:'/estetika',t:'02 • ESTETIKA'},
                {h:'/materials',t:'03 • MATERIAL'},
                {h:'/blogs',t:'04 • BLOG'},
              ].map(m=>(
                <Link key={m.h} href={m.h} onClick={()=>setOpen(false)} className={`flex justify-between items-center py-[22px] border-b group ${isDark?'border-white/10':'border-black/10'}`}>
                  <span className={`font-black text-[18px] tracking-tight ${textMain}`}>{m.t}</span>
                  <span className={`${isDark?'text-white/30':'text-black/30'} group-hover:translate-x-1 transition-all`}>→</span>
                </Link>
              ))}
            </div>
            <div className="p-6">
              <Link href="/" onClick={()=>setOpen(false)} className={`w-full rounded-full py-[16px] flex items-center justify-center font-black text-[13px] tracking-[0.15em] transition-all ${isDark?'bg-white text-black':'bg-black text-white hover:bg-[#D4AF37] hover:text-black'}`}>
                ← KEMBALI KE BERANDA
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 grid lg:grid-cols-[1.8fr_0.9fr] gap-8 overflow-hidden">
        <div className="w-full min-w-0 overflow-hidden">
          <h1 className="text-[36px] md:text-[52px] font-black tracking-tighter leading-[0.85] anim">BLOG <span className="text-[#D4AF37]">PASA GADANG</span></h1>
          <p className="mt-3 text-[11px] font-black tracking-[0.2em] uppercase opacity-50 anim">{filtered.length} dari {blogs.length} artikel • Tips rumah Minang • Padang</p>

          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide w-full pb-2">
            {kategoriList.map(k=>(
              <button key={k} onClick={()=>{setKat(k); setPage(1)}} className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border shrink-0 transition-all hover:scale-105 ${kat===k?'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.3)]': isDark?'bg-[#16161E] border-white/10 text-white/60':'bg-white border-black/10 text-black/60'}`}>{k}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 w-full">
            {paginated.map((b,i)=>(
              <Link key={b.id} href={`/blogs/${b.slug}`} className={`group rounded-[22px] overflow-hidden border w-full min-w-0 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 anim block ${cardBg}`} style={{animationDelay:`${i*80}ms`}}>
                <div className="w-full bg-[#F5F5F0] overflow-hidden">
                  <img src={b.thumbnail} alt={b.judul} className="w-full h-auto object-contain object-center block group-hover:scale-[1.02] transition duration-700" loading="lazy"/>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${isDark?'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20':'bg-[#FFF3B0] text-[#8B6914]'}`}>{b.kategori||'BLOG'}</span>
                    <span className={`text-[10px] font-bold ${textMuted}`}>{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID'):''} • {b.views||0} views</span>
                  </div>
                  <h3 className={`font-black text-[15px] leading-[1.25] mt-2 line-clamp-2 group-hover:text-[#D4AF37] ${textMain}`}>{b.judul}</h3>
                  <p className={`text-[12px] line-clamp-2 mt-1 leading-relaxed ${textMuted}`}>{b.excerpt || b.konten?.replace(/<[^>]+>/g,'').slice(0,90)}</p>
                  <span className="mt-3 inline-block bg-[#2563EB] text-white text-[11px] font-bold px-4 py-1.5 rounded-full">Read More</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex gap-2 mt-10 flex-wrap items-center">
            <div className="w-full h-[1px] bg-gradient-to-r from-[#2563EB]/40 to-transparent mb-4"></div>
            {Array.from({length: Math.min(totalPages,4)}).map((_,i)=>{
              const p=i+1
              return <button key={p} onClick={()=>setPage(p)} className={`w-11 h-11 rounded-xl border font-black text-[13px] transition-all hover:scale-105 ${page===p?'bg-[#2563EB] text-white border-[#2563EB] shadow-lg': isDark?'bg-[#16161E] text-white border-white/10':'bg-white text-[#2563EB] border-black/10'}`}>{p}</button>
            })}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-6 h-11 rounded-xl bg-black text-white font-black text-[11px] tracking-widest hover:bg-[#D4AF37] hover:text-black transition">NEXT →</button>
          </div>
        </div>

        <div className="w-full min-w-0 space-y-6">
          <div className={`p-5 rounded-[20px] border shadow-sm ${cardBg}`}>
            <h3 className={`font-black text-[12px] tracking-[0.2em] ${textMain}`}>PENCARIAN</h3>
            <div className={`mt-3 flex items-center px-4 py-3 rounded-full border ${inputBg}`}>
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
            <div key={catName} className={`p-5 rounded-[20px] border ${cardBg}`}>
              <h3 className={`font-black text-[12px] tracking-[0.2em] uppercase flex gap-2 items-center ${textMain}`}><span className="w-1 h-4 bg-[#D4AF37] rounded-full"></span>{catName}</h3>
              <div className="mt-4 space-y-4">
                {items.slice(0,3).map(b=>(
                  <Link key={b.id} href={`/blogs/${b.slug}`} className="flex gap-3 group">
                    <div className="w-[84px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-zinc-200">
                      <img src={b.thumbnail} className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700"/>
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-bold text-[13px] leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition ${textMain}`}>{b.judul}</h4>
                      <p className={`text-[10px] mt-1 font-bold ${textMuted}`}>{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID'):''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-16 border-t bg-[#111111] border-white/10 text-white">
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
            <p>© 2026 PasaGadang.com - Hak Cipta Dilindungi.</p>
            <p className="font-black tracking-widest">ESTETIKA MINANG • MODERN • SYARIAH</p>
          </div>
        </div>
      </footer>

      <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-24 right-5 z-[90] w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-xl">↑</button>
      <a href="https://wa.me/628979879518" target="_blank" className="fixed bottom-6 right-5 z-[90] w-[56px] h-[56px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.5)] border-[3px] border-white">W</a>
    </main>
  )
    }
