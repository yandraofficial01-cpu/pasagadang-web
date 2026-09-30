'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

function linkify(html){
  if(!html) return ''
  return html.replace(
    /(?<!href=")(https?:\/\/[^\s<"]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#D4AF37;text-decoration:underline;word-break:break-all">$1</a>'
  )
}

export default function DetailBlog(){
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [isDark, setIsDark] = useState(true)

  // load theme dari localStorage
  useEffect(()=>{
    const saved = localStorage.getItem('pg-theme')
    if(saved) setIsDark(saved === 'dark')
  },[])

  useEffect(()=>{
    localStorage.setItem('pg-theme', isDark? 'dark' : 'light')
  },[isDark])

  useEffect(()=>{
    if(!slug) return
    const load = async()=>{
      try{
        const r = await fetch(`${API}/blogs/${slug}`, { cache: 'no-store' })
        if(!r.ok){
          const t = await r.text()
          throw new Error(t)
        }
        const j = await r.json()
        setData(j)
      }catch(e){
        setErr(e.message || 'Artikel tidak ditemukan')
      }finally{
        setLoading(false)
      }
    }
    load()
  },[slug])

  if(loading) return <div className={`min-h-screen p-10 ${isDark?'bg-black text-white':'bg-[#FAFAF7] text-black'}`}>Loading {slug}...</div>
  if(err) return (
    <div className={`min-h-screen p-10 ${isDark?'bg-[#0A0A0A] text-white':'bg-[#FAFAF7] text-black'}`}>
      <a href="/blogs" className={`px-4 py-2 rounded-full text-[11px] font-black border ${isDark?'bg-white/10 border-white/10':'bg-black/5 border-black/10'}`}>← KEMBALI</a>
      <div className="mt-6 bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
        <p className="text-red-400 text-sm font-bold">Gagal load artikel</p>
        <p className="text-[12px] mt-2 break-all opacity-60">{err}</p>
      </div>
    </div>
  )

  const b = data.blog || data
  const themeBg = isDark? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAF7] text-[#111]'
  const cardBg = isDark? 'bg-[#16161E] border-white/10' : 'bg-white border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
  const muted = isDark? 'text-white/60' : 'text-black/60'
  const muted2 = isDark? 'text-white/80' : 'text-black/80'

  return(
    <div className={`min-h-screen transition-colors duration-300 ${themeBg}`}>
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <a href="/blogs" className={`px-4 py-2 rounded-full text-[11px] font-black tracking-widest border transition ${isDark?'bg-white/10 border-white/10 hover:bg-white/20':'bg-black/5 border-black/10 hover:bg-black/10'}`}>← KEMBALI KE BLOG</a>

          <button onClick={()=>setIsDark(!isDark)} className={`px-4 py-2 rounded-full text-[11px] font-black tracking-widest border transition ${isDark?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-[#111] text-white border-[#111]'}`}>
            {isDark? '☀️ MODE TERANG' : '🌙 MODE GELAP'}
          </button>
        </div>

        <img src={b.thumbnail} alt={b.judul} className="w-full h-[320px] md:h-[460px] object-cover rounded-[24px] border bg-zinc-900" style={{borderColor: isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'}}/>

        <div className="mt-7">
          <h1 className="text-[28px] md:text-[36px] font-black leading-[1.1]">{b.judul}</h1>
          {b.excerpt && <p className={`mt-4 text-[15px] leading-relaxed italic border-l-2 pl-4 ${muted}`} style={{borderColor:'#D4AF37'}}>{b.excerpt}</p>}

          {/* KONTEN */}
          <div className={`mt-8 text-[15px] leading-[1.9] prose max-w-none ${isDark?'prose-invert':''} ${muted2}`} dangerouslySetInnerHTML={{__html: linkify(b.konten)}} />

          {/* FOOTER CTA */}
          <div className={`mt-12 p-6 rounded-[20px] border ${cardBg}`}>
            <p className="font-black text-[13px] tracking-widest">BUTUH BAHAN BANGUNAN?</p>
            <p className={`text-[13px] mt-1 ${muted}`}>Konsultasi gratis hitung kebutuhan roster & batu alam Pasa Gadang</p>
            <a href="/estetika" className="inline-block mt-4 bg-[#D4AF37] text-black px-5 py-2.5 rounded-full text-[11px] font-black tracking-widest">LIHAT KATALOG ESTETIKA →</a>
          </div>
        </div>
      </div>
    </div>
  )
}
