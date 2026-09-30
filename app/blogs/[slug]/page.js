'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

function safeRender(html){
  if(!html) return ''
  // 1. Decode kalau ke-save jadi &lt;img&gt;
  let s = html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&')

  // 2. Amankan semua tag <img> biar gak kerusak pas linkify
  const imgMap = []
  s = s.replace(/<img[^>]*>/gi, (m)=>{
    imgMap.push(m)
    return `__IMG_${imgMap.length-1}__`
  })

  // 3. Baru linkify link yang di luar gambar
  s = s.replace(/(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#D4AF37;text-decoration:underline;word-break:break-all">$1</a>')

  // 4. Balikin lagi tag img nya + kasih style biar cantik
  s = s.replace(/__IMG_(\d+)__/g, (_, i)=>{
    let tag = imgMap[Number(i)] || ''
    // paksa img jadi responsive
    if(!tag.includes('style=')){
      tag = tag.replace('<img', '<img style="width:100%;border-radius:16px;margin:16px 0;display:block;background:#18181b" loading="lazy"')
    }
    // ganti class rounded-xl jadi inline style biar gak depend tailwind di dalam konten
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
  const [isDark, setIsDark] = useState(true)

  useEffect(()=>{
    const saved = localStorage.getItem('pg-theme')
    if(saved) setIsDark(saved === 'dark')
  },[])
  useEffect(()=>{ localStorage.setItem('pg-theme', isDark? 'dark':'light') },[isDark])

  useEffect(()=>{
    if(!slug) return
    const load = async()=>{
      try{
        const r = await fetch(`${API}/blogs/${slug}`, { cache: 'no-store' })
        if(!r.ok) throw new Error(await r.text())
        const j = await r.json()
        setData(j)
      }catch(e){ setErr(e.message) }finally{ setLoading(false) }
    }
    load()
  },[slug])

  if(loading) return <div className={`min-h-screen p-10 ${isDark?'bg-black text-white':'bg-[#FAFAF7] text-black'}`}>Loading {slug}...</div>
  if(err) return <div className={`min-h-screen p-10 ${isDark?'bg-[#0A0A0A] text-white':'bg-white text-black'}`}>Error: {err}</div>

  const b = data.blog || data
  const themeBg = isDark? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAF7] text-[#111]'
  const muted = isDark? 'text-white/60' : 'text-black/60'
  const muted2 = isDark? 'text-white/80' : 'text-black/80'
  const cardBg = isDark? 'bg-[#16161E] border-white/10' : 'bg-white border-black/10 shadow-xl'

  return(
    <div className={`min-h-screen transition-colors ${themeBg}`}>
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <a href="/blogs" className={`px-4 py-2 rounded-full text-[11px] font-black border ${isDark?'bg-white/10 border-white/10':'bg-black/5 border-black/10'}`}>← KEMBALI</a>
          <button onClick={()=>setIsDark(!isDark)} className={`px-4 py-2 rounded-full text-[11px] font-black ${isDark?'bg-[#D4AF37] text-black':'bg-black text-white'}`}>{isDark?'☀️ TERANG':'🌙 GELAP'}</button>
        </div>

        <img src={b.thumbnail} alt={b.judul} className="w-full h-[320px] md:h-[460px] object-cover rounded-[24px] border bg-zinc-900" style={{borderColor:isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'}}/>
        <h1 className="text-[28px] md:text-[36px] font-black mt-7 leading-[1.1]">{b.judul}</h1>
        {b.excerpt && <p className={`mt-4 italic border-l-2 pl-4 ${muted}`} style={{borderColor:'#D4AF37'}}>{b.excerpt}</p>}

        <div className={`mt-8 text-[15px] leading-[1.9] prose max-w-none ${isDark?'prose-invert':''} ${muted2} prose-img:rounded-[16px]`} dangerouslySetInnerHTML={{__html: safeRender(b.konten)}} />

        <div className={`mt-12 p-6 rounded-[20px] border ${cardBg}`}>
          <p className="font-black text-[13px]">BUTUH BAHAN BANGUNAN?</p>
          <p className={`text-[13px] mt-1 ${muted}`}>Konsultasi gratis roster & batu alam Pasa Gadang</p>
          <a href="/estetika" className="inline-block mt-4 bg-[#D4AF37] text-black px-5 py-2.5 rounded-full text-[11px] font-black">LIHAT KATALOG →</a>
        </div>
      </div>
    </div>
  )
}
