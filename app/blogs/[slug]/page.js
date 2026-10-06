'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
      <div className="relative w-[165px] h-[8px] mt-[2px]"><svg viewBox="0 0 165 10" className="w-full h-full"><path d="M0 6 Q22 0 44 4 T88 4 T132 3 T165 1 Q132 7 88 7 T44 7 T0 6" fill="#D4AF37" opacity="0.9"/></svg></div>
    </div>
  )
}

function safeClean(html){
  if(!html) return ''
  let s = html
  for(let i=0;i<4;i++){
    s = s.replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/&amp;/gi,'&')
  }
  s = s.replace(/&nbsp;/gi,' ')
  s = s.replace(/https:\/\/res\.cloudinary\.com\/[^\s"'<>]+/gi, (url)=>{
    let clean = url.split('"')[0].split("'")[0].split(' ')[0].trim()
    if(!/\.(jpg|jpeg|png|webp)/i.test(clean)) return ''
    return `<img src="${clean}" alt="blog pasagadang" loading="lazy" />`
  })
  s = s.replace(/<div><br><\/div>/gi,'').replace(/<div>\s*<\/div>/gi,'')
  s = s.replace(/<div>/gi,'<p>').replace(/<\/div>/gi,'</p>')
  s = s.replace(/<font[^>]*>/gi,'').replace(/<\/font>/gi,'')
  s = s.replace(/<span[^>]*>/gi,'').replace(/<\/span>/gi,'')
  s = s.replace(/class="[^"]*"/gi,'')
  s = s.replace(/style="[^"]*"/gi,'')
  s = s.replace(/<p>\s*<\/p>/gi,'')
  return s.trim()
}

function PremiumLoading({isDark}){
  return(
    <div className={`min-h-screen w-full ${isDark?'bg-[#0A0A0A]':'bg-[#FFFBF0]'} overflow-hidden`}>
      <style>{`
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes pulseGold{0%,100%{opacity:1; transform:scale(1)}50%{opacity:0.6; transform:scale(0.98)}}
       .shimmer{position:relative;overflow:hidden;background:${isDark?'#1A1A1A':'#EDE9E3'};border-radius:12px}
       .shimmer::after{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(90deg,transparent,${isDark?'rgba(212,175,55,0.18)':'rgba(212,175,55,0.25)'},transparent);animation:shimmer 1.3s infinite}
      `}</style>
      <div className={`h-[60px] border-b flex justify-between items-center px-6 ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <div className="w-[165px] h-[32px] shimmer"/>
        <div className="flex gap-2"><div className="w-11 h-11 rounded-full shimmer"/><div className="w-11 h-11 rounded-full shimmer"/></div>
      </div>
      <div className="max-w-[780px] mx-auto p-6 md:p-10">
        <div className="flex gap-2 mb-6"><div className="w-24 h-6 rounded-full bg-[#D4AF37]/20 animate-pulse"/><div className="w-32 h-4 rounded shimmer mt-1"/></div>
        <div className="space-y-3 mb-8"><div className="h-10 rounded-xl shimmer w-full"/><div className="h-10 rounded-xl shimmer w-[85%]"/><div className="h-5 rounded shimmer w-[60%] mt-4"/></div>
        <div className="w-full h-[380px] rounded-[28px] shimmer mb-8"/>
        <div className="space-y-4"><div className="h-4 rounded shimmer w-full"/><div className="h-4 rounded shimmer w-full"/><div className="h-4 rounded shimmer w-[70%]"/></div>
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="flex font-black text-[22px] tracking-tight" style={{animation:'pulseGold 1.2s infinite'}}>
            <span style={{color:'#B22222'}}>PA</span><span className="text-[#D4AF37]">SAGA</span><span style={{color:'#B22222'}}>DANG</span><span className="text-[10px] ml-1 mt-1 text-[#B22222]">.COM</span>
          </div>
          <div className="text-[10px] tracking-[0.5em] font-black opacity-40">PREMIUM LOADING</div>
          <div className="w-20 h-[2px] bg-[#D4AF37]/30 rounded-full overflow-hidden mt-1"><div className="h-full w-1/2 bg-[#D4AF37] animate-[shimmer_0.8s_infinite]"/></div>
        </div>
      </div>
    </div>
  )
}

export default function DetailBlog(){
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(()=>{ setIsDark((localStorage.getItem('admin_theme')||localStorage.getItem('theme')||'light')==='dark') },[])
  useEffect(()=>{ localStorage.setItem('theme', isDark?'dark':'light'); localStorage.setItem('admin_theme', isDark?'dark':'light') },[isDark])
  useEffect(()=>{
    if(!slug) return
    const load = async()=>{
      try{
        const r = await fetch(`${API}/blogs/${slug}`, { cache: 'no-store' })
        if(!r.ok) throw new Error(await r.text())
        const j = await r.json()
        setData(j.blog || j.data || j)
      }catch(e){ setErr(e.message) }finally{ setLoading(false) }
    }
    load()
  },[slug])

  const b = data
  const cleaned = useMemo(()=> b? safeClean(b.konten) : '', [b])
  const themeBg = isDark? 'bg-[#0A0A0A] text-white' : 'bg-[#FFFBF0] text-[#111]'
  const muted = isDark? 'text-white/70' : 'text-black/70'
  const cardBg = isDark? 'bg-[#16161E] border-white/10' : 'bg-white border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
  const hasNumberedList = useMemo(()=> (cleaned.match(/\b[1-5]\.\s/g)||[]).length >=2,[cleaned])
  const points = useMemo(()=>!hasNumberedList?[]:cleaned.split(/(?=\b[1-5]\.\s)/g),[cleaned, hasNumberedList])

  if(loading) return <PremiumLoading isDark={isDark} />
  if(err) return <div className={`min-h-screen p-10 ${themeBg}`}>Error: {err}</div>
  if(!b) return <div className={`min-h-screen p-10 ${themeBg}`}>Blog tidak ditemukan</div>

  return(
    <div className={`min-h-screen w-full max-w-[100vw] overflow-x-clip ${themeBg} pb-24`}>
      <style>{`
        html,body{max-width:100vw;overflow-x:hidden!important}
        strong,b{font-weight:900!important;color:${isDark?'#fff':'#111'}}
     .blog-content p{margin-bottom:18px;line-height:1.9;font-size:16px;word-break:break-word;overflow-wrap:anywhere}
     .blog-content h2{font-size:22px;font-weight:900;margin:28px 0 14px;color:#D4AF37}
     .blog-content h3{font-size:20px;font-weight:800;margin:22px 0 10px;color:${isDark?'#fff':'#111'}}
     .blog-content img{width:100%!important;max-width:100%!important;height:auto!important;object-fit:contain!important;border-radius:20px;margin:24px 0!important;background:#F5F5F0;display:block}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes shine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        @keyframes bounce-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    .animate-float{animation:float 4s ease-in-out infinite}
    .animate-float-delay{animation:float 4.5s ease-in-out infinite}
    .animate-bounce-slow{animation:bounce-slow 2.5s ease-in-out infinite}
    .shine-effect{position:absolute;top:0;left:0;width:50%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent);transform:translateX(-100%);pointer-events:none;animation:shine 3s infinite}
      `}</style>

      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-4 md:px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/"><LogoPasagadang/></Link>
        <div className="flex gap-2 items-center">
          <button onClick={()=>setIsDark(!isDark)} className={`w-11 h-11 rounded-full border flex items-center justify-center text-[18px] ${isDark?'bg-white text-black border-white':'bg-white border-black/5'}`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-11 h-11 rounded-full border flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white border-white':'bg-white border-black/5'}`}><span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span><span className={`w-5 h-[2px] bg-black ${open?'opacity-0':''}`}></span><span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span></button>
        </div>
      </nav>

      {open && (
        <div className={`w-full border-b shadow-xl ${isDark?'bg-[#16161E] border-white/10':'bg-white border-black/5'}`}>
          <div className="px-6 max-w-7xl mx-auto">
            <Link href="/properties" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-[22px] border-b font-black text-[18px] ${isDark?'text-white border-white/10':'text-black border-black/10'}`}>01 • PROPERTI <span className="opacity-30">→</span></Link>
            <Link href="/estetika" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-[22px] border-b font-black text-[18px] ${isDark?'text-white border-white/10':'text-black border-black/10'}`}>02 • ESTETIKA <span className="opacity-30">→</span></Link>
            <Link href="/materials" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-[22px] border-b font-black text-[18px] ${isDark?'text-white border-white/10':'text-black border-black/10'}`}>03 • MATERIAL <span className="opacity-30">→</span></Link>
            <Link href="/blogs" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-[22px] font-black text-[18px] ${isDark?'text-white':'text-black'}`}>04 • BLOG <span className="opacity-30">→</span></Link>
          </div>
          <div className="p-6 max-w-7xl mx-auto"><Link href="/" onClick={()=>setOpen(false)} className={`w-full rounded-full py-4 flex items-center justify-center font-black text-[13px] tracking-widest transition ${isDark?'bg-white text-black':'bg-black text-white'}`}>← KEMBALI KE BERANDA</Link></div>
        </div>
      )}

      <div className="max-w-[780px] mx-auto p-4 md:p-10 w-full min-w-0">
        <div className="flex gap-2 mb-6 flex-wrap"><span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{b.kategori||'BLOG'}</span><span className={`text-[11px] ${muted} font-bold`}>👁️ {b.views||0} views • {b.created_at? new Date(b.created_at).toLocaleDateString('id-ID'):''}</span></div>
        <h1 className="text-[30px] md:text-[42px] font-black leading-[0.95] tracking-tight break-words">{b.judul}</h1>
        {b.excerpt && <p className={`mt-5 italic border-l-4 pl-4 text-[17px] leading-relaxed ${muted}`} style={{borderColor:'#D4AF37'}}>{b.excerpt}</p>}
        <div className="w-full mt-8 rounded-[28px] border overflow-hidden bg-[#F5F5F0] border-black/10"><img src={b.thumbnail} alt={b.judul} className="w-full h-auto object-contain block"/></div>

        {!hasNumberedList? (
          <div className="mt-8 blog-content w-full max-w-full overflow-hidden" dangerouslySetInnerHTML={{__html: cleaned}} />
        ) : (
          <div className="mt-8 space-y-6">
            <div className={`text-[17px] leading-[1.9] break-words ${muted} blog-content`} dangerouslySetInnerHTML={{__html: points[0]}}/>
            {points.slice(1).map((raw,i)=>{
              const clean = raw.replace(/^\d+\.\s*/,'').trim()
              const firstLine = clean.split('\n')[0]
              const rest = clean.replace(firstLine,'').trim()
              return(
                <div key={i} className={`group relative rounded-[24px] p-6 border ${cardBg} animate-float overflow-hidden hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(212,175,55,0.18)] transition-all duration-500`} style={{animationDelay:`${i*0.15}s`}}>
                  <div className="shine-effect"></div>
                  <div className="flex gap-3 items-start relative z-10"><div className="w-9 h-9 rounded-full bg-[#D4AF37] text-black font-black flex items-center justify-center shrink-0 text-[14px]">{i+1}</div><h2 className="font-black text-[20px] leading-tight tracking-tight">{firstLine}</h2></div>
                  {rest && <div className={`mt-4 text-[16px] leading-[1.8] break-words ${muted} blog-content relative z-10`} dangerouslySetInnerHTML={{__html: rest}}/>}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-14">
          <h3 className="font-black text-[11px] tracking-[0.35em] opacity-40 mb-4">REKOMENDASI JANGAN SKIP</h3>
          <div className="grid gap-4">
            <Link href="/properties" className="group relative rounded-[24px] p-[1.5px] bg-gradient-to-br from-[#D4AF37] to-[#8B6914] hover:shadow-[0_20px_60px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all duration-500 animate-float overflow-hidden block">
              <div className={`rounded-[22px] p-6 ${isDark?'bg-[#16161E]':'bg-white'} relative overflow-hidden`}><div className="shine-effect"></div><div className="flex justify-between items-start relative z-10"><div className="min-w-0"><p className="text-[10px] font-black tracking-[0.3em] text-[#D4AF37]">01 • PROPERTI SIAP HUNI</p><p className="font-black text-[19px] leading-[1.1] mt-2">Rumah 300 Jt-an Legal di Padang<br/>Bisa KPR & Cicil Syariah</p><p className={`text-[12px] mt-2 ${muted}`}>Manggis, Kuranji, Balai Baru - SHM jelas</p></div><div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black group-hover:rotate-45 transition-all duration-500 shrink-0">→</div></div><div className="mt-4 relative z-10"><span className="bg-[#D4AF37] text-black px-5 py-2.5 rounded-full text-[11px] font-black">LIHAT PROPERTI →</span></div></div>
            </Link>
            <Link href="/estetika" className="group relative rounded-[24px] p-[1px] bg-black/10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-500 animate-float-delay overflow-hidden block">
              <div className={`rounded-[23px] p-6 ${cardBg} relative overflow-hidden`}><div className="shine-effect"></div><div className="flex justify-between items-start relative z-10"><div><p className="text-[10px] font-black tracking-[0.3em] opacity-50">02 • ESTETIKA MINANG MODERN</p><p className="font-black text-[19px] leading-[1.1] mt-2">Bikin Rumah Makin Cakep<br/>Pakai Roster & Batu Alam</p><p className={`text-[12px] mt-2 ${muted}`}>Fasad adem, nilai jual naik 40%</p></div><div className="w-12 h-12 rounded-full bg-white border border-black/10 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:rotate-12 transition-all">✨</div></div><div className="mt-4 relative z-10"><span className="bg-black text-white px-5 py-2.5 rounded-full text-[11px] font-black">LIHAT ESTETIKA →</span></div></div>
            </Link>
            <Link href="/materials" className="group relative rounded-[24px] p-[1px] bg-gradient-to-br from-[#25D366]/40 to-[#128C7E]/20 hover:shadow-[0_20px_60px_rgba(37,211,102,0.3)] hover:scale-[1.02] transition-all duration-500 animate-float overflow-hidden block" style={{animationDelay:'0.4s'}}>
              <div className={`rounded-[23px] p-6 ${cardBg} relative overflow-hidden`}><div className="shine-effect"></div><div className="flex justify-between items-start relative z-10"><div><p className="text-[10px] font-black tracking-[0.3em] text-[#25D366]">03 • MATERIAL & BAHAN</p><p className="font-black text-[19px] leading-[1.1] mt-2">Hemat 30% Biaya Bahan<br/>Langsung Dari Gudang</p><p className={`text-[12px] mt-2 ${muted}`}>Roster, bata, semen - free konsultasi</p></div><div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-all">🟡</div></div><div className="mt-4 flex gap-2 relative z-10"><span className="bg-[#D4AF37] text-black px-5 py-2.5 rounded-full text-[11px] font-black">LIHAT KATALOG →</span><a href="https://wa.me/628979879518" onClick={e=>e.stopPropagation()} target="_blank" className="bg-[#25D366] text-white px-5 py-2.5 rounded-full text-[11px] font-black">WA GRATIS</a></div></div>
            </Link>
          </div>
        </div>

        <Link href="/blogs" className="mt-10 inline-flex text-[12px] font-black tracking-widest opacity-50 hover:opacity-100 transition">← KEMBALI KE BLOG</Link>
      </div>

      <footer className="mt-16 bg-[#111] text-white py-8 text-center text-[11px] opacity-40">© 2026 PasaGadang.com - Dibuat di Padang</footer>
      <a href="https://wa.me/628979879518" target="_blank" className="fixed bottom-6 right-6 z-[99] w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] border-[3px] border-white animate-bounce-slow">💬</a>
    </div>
  )
  }
