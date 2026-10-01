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
      <div className="relative w-[165px] h-[8px] mt-[2px]">
        <svg viewBox="0 0 165 10" className="w-full h-full">
          <path d="M0 6 Q22 0 44 4 T88 4 T132 3 T165 1 Q132 7 88 7 T44 7 T0 6" fill="#D4AF37" opacity="0.9"/>
          <path d="M18 9 Q40 6 62 7.5 T106 7.5 T148 6 Q106 10 62 10.5 T18 9" fill="#D4AF37" opacity="0.8"/>
        </svg>
      </div>
    </div>
  )
}

function safeRender(html){
  if(!html) return ''
  let s = html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&')
  const imgMap = []
  s = s.replace(/<img[^>]*>/gi, (m)=>{ imgMap.push(m); return `__IMG_${imgMap.length-1}__` })

  // auto bold: **teks** -> <strong>
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // auto bold sub-judul yang diakhiri titik dua: Tips:, Catatan:
  s = s.replace(/([A-Z][a-zA-Z\s]{2,30}:)/g, '<strong style="color:#111">$1</strong>')

  s = s.replace(/(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#D4AF37;text-decoration:underline;word-break:break-all">$1</a>')
  s = s.replace(/__IMG_(\d+)__/g, (_, i)=>{
    let tag = imgMap[Number(i)] || ''
    if(!tag.includes('style=')){
      tag = tag.replace('<img', '<img style="width:100%;border-radius:20px;margin:20px 0;display:block;background:#18181b" loading="lazy"')
    }
    tag = tag.replace(/class="[^"]*"/g, '')
    return tag
  })
  return s
}

export default function DetailBlog(){
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || localStorage.getItem('pg-theme') || 'light'
    setIsDark(saved==='dark')
  },[])
  useEffect(()=>{ localStorage.setItem('theme', isDark?'dark':'light'); localStorage.setItem('pg-theme', isDark?'dark':'light') },[isDark])

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
  const themeBg = isDark? 'bg-[#0A0A0A] text-white' : 'bg-[#FFFBF0] text-[#111]'
  const muted = isDark? 'text-white/70' : 'text-black/70'
  const cardBg = isDark? 'bg-[#16161E] border-white/10' : 'bg-white border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'

  const hasNumberedList = useMemo(()=>{
    const c = b?.konten || ''
    return (c.match(/\b[1-5]\.\s/g) || []).length >= 2
  },[b])

  const points = useMemo(()=>{
    if(!b?.konten ||!hasNumberedList) return []
    return b.konten.split(/(?=\b[1-5]\.\s)/g)
  },[b, hasNumberedList])

  if(loading) return <div className={`min-h-screen p-10 ${themeBg}`}>Loading {slug}...</div>
  if(err) return <div className={`min-h-screen p-10 ${themeBg}`}>Error: {err}</div>
  if(!b) return <div className={`min-h-screen p-10 ${themeBg}`}>Blog tidak ditemukan</div>

  return(
    <div className={`min-h-screen transition-colors ${themeBg} pb-24`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/"><LogoPasagadang/></Link>
        <div className="flex gap-2 items-center">
          <button onClick={()=>setIsDark(!isDark)} className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span>
          </button>
        </div>
      </nav>

      {open && (
        <div className={`px-6 py-4 shadow-xl border-b ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}>
          <Link href="/blogs" onClick={()=>setOpen(false)} className="flex justify-between py-4 font-black text-[14px] border-b border-black/5">← KEMBALI KE BLOG</Link>
          <Link href="/properties" onClick={()=>setOpen(false)} className="flex justify-between py-4 font-black text-[14px]">01 • PROPERTI</Link>
        </div>
      )}

      <div className="max-w-3xl mx-auto p-5 md:p-10">
        <div className="flex gap-2 mb-6">
          <span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">{b.kategori||'BLOG'}</span>
          <span className={`text-[11px] ${muted}`}>👁️ {b.views||0} views • {b.created_at? new Date(b.created_at).toLocaleDateString('id-ID') : ''}</span>
        </div>

        <h1 className="text-[30px] md:text-[42px] font-black leading-[0.95] tracking-tight">{b.judul}</h1>
        {b.excerpt && <p className={`mt-5 italic border-l-4 pl-4 text-[17px] leading-relaxed ${muted}`} style={{borderColor:'#D4AF37'}}>{b.excerpt}</p>}

        <img src={b.thumbnail} alt={b.judul} className="w-full h-[320px] md:h-[460px] object-cover rounded-[28px] border mt-8 bg-zinc-900" style={{borderColor:isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'}}/>

        {!hasNumberedList? (
          <div className={`mt-8 text-[17px] leading-[1.9] prose max-w-none ${isDark?'prose-invert':''} prose-strong:font-black prose-strong:text-[#111] prose-img:rounded-[20px] prose-a:text-[#D4AF37]`} dangerouslySetInnerHTML={{__html: safeRender(b.konten)}} />
        ) : (
          <div className="mt-8 space-y-6">
            <div className={`text-[17px] leading-[1.9] ${muted}`} dangerouslySetInnerHTML={{__html: safeRender(points[0])}}/>
            {points.slice(1).map((raw,i)=>{
              // Ambil baris pertama sebagai JUDUL BOLD
              const clean = raw.replace(/^\d+\.\s*/,'').trim()
              const lines = clean.split('\n').filter(Boolean)
              const firstLine = lines[0] || clean.split('.')[0]
              const rest = clean.replace(firstLine,'').trim()

              return(
                <div key={i} className={`rounded-[24px] p-6 border ${cardBg}`}>
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-[#D4AF37] text-black font-black flex items-center justify-center shrink-0 text-[14px]">{i+1}</div>
                    <h2 className="font-black text-[20px] leading-tight tracking-tight" style={{fontWeight:900}}>{firstLine}</h2>
                  </div>
                  {rest && <div className={`mt-4 text-[16px] leading-[1.8] ${muted} prose-strong:font-black prose-strong:text-black`} dangerouslySetInnerHTML={{__html: safeRender(rest)}}/>}
                </div>
              )
            })}
          </div>
        )}

        <div className={`mt-12 p-6 rounded-[24px] border ${cardBg}`}>
          <p className="font-black text-[13px] tracking-widest">BUTUH BAHAN BANGUNAN?</p>
          <p className={`text-[13px] mt-1 ${muted}`}>Konsultasi gratis roster & batu alam Pasa Gadang. Hemat 30% biaya bahan.</p>
          <div className="flex gap-2 mt-4">
            <a href="/estetika" className="bg-[#D4AF37] text-black px-5 py-3 rounded-full text-[11px] font-black">LIHAT KATALOG →</a>
            <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang%20dari%20blog" target="_blank" className="bg-[#25D366] text-white px-5 py-3 rounded-full text-[11px] font-black">WA 08979879518</a>
          </div>
        </div>
      </div>

      <a href="https://wa.me/628979879518" target="_blank" className="fixed bottom-6 right-6 z-[99] w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] border-[3px] border-white">💬</a>

      <style>{`
        strong, b { font-weight: 900!important; color: ${isDark?'#fff':'#111'}; }
       .prose strong { font-weight: 900!important; }
      `}</style>
    </div>
  )
                }
