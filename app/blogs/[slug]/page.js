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

// FIX DOM CLEAN - YANG TADI NGE-BUG LINK & JARAK
function domClean(html){
  if(!html) return ''
  let s = html
  for(let i=0;i<6;i++){
    s = s.replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/&amp;/gi,'&')
  }
  s = s.replace(/&nbsp;/gi,' ')
  s = s.replace(/src="<img src="/gi,'src="').replace(/src=""https/gi,'src="https')
  s = s.replace(/<img[^>]*src="[^"]*<img[^>]*src="([^"]+)"[^>]*>/gi,'<img src="$1">')

  if(typeof document === 'undefined'){
    return s
  }

  const div = document.createElement('div')
  div.innerHTML = s
  const allowed = ['P','H2','H3','B','STRONG','I','U','UL','OL','LI','BR','IMG','A']
  let out = ''

  function walk(node){
    if(node.nodeType === 3){
      return node.textContent || ''
    }
    if(node.nodeName === 'IMG'){
      let src = node.getAttribute('src') || ''
      const m = src.match(/https:\/\/res\.cloudinary\.com\/[^\s"'<>]+\.(jpg|jpeg|png|webp)/i)
      if(m) src = m[0]
      if(src && src.includes('cloudinary')){
        return `__CLOUD_IMG__${src}__CLOUD_IMG__`
      }
      return ''
    }
    if(!allowed.includes(node.nodeName)){
      let inner = ''
      node.childNodes.forEach(c=>{ inner += walk(c) })
      return inner
    }
    if(node.nodeName === 'BR') return '<br/>'
    if(node.nodeName === 'A'){
      let inner = ''
      node.childNodes.forEach(c=>{ inner += walk(c) })
      if(!inner.trim()) return ''
      let href = node.getAttribute('href') || ''
      if(!href) return inner
      // FIX LINK - BIAR JADI BIRU & BISA DI KLIK
      if(href.startsWith('pasagadang.com')) href = 'https://' + href
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${inner}</a>`
    }
    if(['P','H2','H3','UL','OL','LI'].includes(node.nodeName)){
      let inner = ''
      node.childNodes.forEach(c=>{ inner += walk(c) })
      if(!inner.trim()) return ''
      const tag = node.nodeName.toLowerCase()
      return `<${tag}>${inner}</${tag}>`
    }
    if(['B','STRONG'].includes(node.nodeName)){
      let inner = ''
      node.childNodes.forEach(c=>{ inner += walk(c) })
      return inner? `<strong>${inner}</strong>` : ''
    }
    if(node.nodeName === 'I'){
      let inner = ''
      node.childNodes.forEach(c=>{ inner += walk(c) })
      return inner? `<em>${inner}</em>` : ''
    }
    return ''
  }

  div.childNodes.forEach(n=>{ out += walk(n) })
  out = out.replace(/__CLOUD_IMG__(.*?)__CLOUD_IMG__/g, (_,src)=>{
    return `<img src="${src}" alt="blog pasagadang" loading="lazy" style="width:100%;max-width:100%;height:auto;object-fit:contain;border-radius:20px;margin:24px 0;display:block;background:#F5F5F0" />`
  })
  // HAPUS P KOSONG BIAR GAK RENGGANG
  return out.replace(/<p>\s*<\/p>/gi,'').replace(/<p>\s*<br\/>\s*<\/p>/gi,'').trim()
}

function PremiumLoading({isDark}){
  return(
    <div className={`min-h-screen w-full ${isDark?'bg-[#0A0A0A]':'bg-[#FFFBF0]'}`}>
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}.shimmer{position:relative;overflow:hidden;background:${isDark?'#1A1A1A':'#EDE9E3'}}.shimmer::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.2),transparent);animation:shimmer 1.2s infinite}`}</style>
      <div className="h-[60px] border-b px-6 flex justify-between items-center"><div className="w-[150px] h-6 shimmer rounded"/><div className="flex gap-2"><div className="w-11 h-11 rounded-full shimmer"/><div className="w-11 h-11 rounded-full shimmer"/></div></div>
      <div className="max-w-[780px] mx-auto p-6"><div className="w-full h-[350px] rounded-[28px] shimmer mb-6"/><div className="space-y-3"><div className="h-4 shimmer w-full"/><div className="h-4 shimmer w-full"/><div className="h-4 shimmer w-[70%]"/></div></div>
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
  const cleaned = useMemo(()=> b? domClean(b.konten) : '', [b])
  const themeBg = isDark? 'bg-[#0A0A0A] text-white' : 'bg-[#FFFBF0] text-[#111]'
  const muted = isDark? 'text-white/70' : 'text-black/70'
  const cardBg = isDark? 'bg-[#16161E] border-white/10' : 'bg-white border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'

  if(loading) return <PremiumLoading isDark={isDark} />
  if(err) return <div className={`min-h-screen p-10 ${themeBg}`}>Error: {err}</div>
  if(!b) return <div className={`min-h-screen p-10 ${themeBg}`}>Blog tidak ditemukan</div>

  return(
    <div className={`min-h-screen w-full max-w-[100vw] overflow-x-clip ${themeBg} pb-24`}>
      <style>{`
        html,body{max-width:100vw;overflow-x:hidden!important}
     .blog-content p{margin-bottom:14px;line-height:1.8;font-size:16px;word-break:break-word;overflow-wrap:anywhere}
     .blog-content h2{font-size:24px;font-weight:900;margin:28px 0 14px;color:#D4AF37;line-height:1.2}
     .blog-content h3{font-size:20px;font-weight:800;margin:22px 0 10px;color:${isDark?'#fff':'#111'}}
     .blog-content b,.blog-content strong{font-weight:900!important;color:${isDark?'#fff':'#111'}}
     .blog-content a{color:#2563EB!important;text-decoration:underline!important;font-weight:700!important;word-break:break-all}
     .blog-content a:hover{color:#D4AF37!important}
     .blog-content img{width:100%!important;max-width:100%!important;height:auto!important;object-fit:contain!important;border-radius:20px;margin:24px 0!important;background:#F5F5F0;display:block}
      `}</style>

      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-4 md:px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/"><LogoPasagadang/></Link>
        <div className="flex gap-2 items-center">
          <button onClick={()=>setIsDark(!isDark)} className={`w-11 h-11 rounded-full border flex items-center justify-center text-[18px] ${isDark?'bg-white text-black':'bg-white border-black/5'}`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className="w-11 h-11 rounded-full bg-white border border-black/5 flex flex-col items-center justify-center gap-1.5"><span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span><span className={`w-5 h-[2px] bg-black ${open?'opacity-0':''}`}></span><span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span></button>
        </div>
      </nav>

      <div className="max-w-[780px] mx-auto p-4 md:p-10 w-full min-w-0">
        <div className="flex gap-2 mb-6 flex-wrap"><span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{b.kategori||'BLOG'}</span><span className={`text-[11px] ${muted} font-bold`}>👁️ {b.views||0} views • {b.created_at? new Date(b.created_at).toLocaleDateString('id-ID'):''}</span></div>
        <h1 className="text-[30px] md:text-[42px] font-black leading-[0.95] tracking-tight break-words">{b.judul}</h1>
        {b.excerpt && <p className={`mt-5 italic border-l-4 pl-4 text-[17px] leading-relaxed ${muted}`} style={{borderColor:'#D4AF37'}}>{b.excerpt}</p>}
        <div className="w-full mt-8 rounded-[28px] border overflow-hidden bg-[#F5F5F0] border-black/10"><img src={b.thumbnail} alt={b.judul} className="w-full h-auto object-contain block"/></div>
        <div className="mt-8 blog-content w-full max-w-full overflow-hidden" dangerouslySetInnerHTML={{__html: cleaned}} />
        <Link href="/blogs" className="mt-10 inline-flex text-[12px] font-black tracking-widest opacity-50 hover:opacity-100 transition">← KEMBALI KE BLOG</Link>
      </div>
    </div>
  )
  }
