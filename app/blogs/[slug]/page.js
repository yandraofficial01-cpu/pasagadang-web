'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

export default function DetailBlog(){
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

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

  if(loading) return <div className="min-h-screen bg-black text-white p-10">Loading {slug}...</div>
  if(err) return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-10">
      <a href="/blogs" className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[11px] font-black">← KEMBALI</a>
      <div className="mt-6 bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
        <p className="text-red-400 text-sm font-bold">Gagal load artikel</p>
        <p className="text-white/60 text-xs mt-2 break-all">{err}</p>
        <p className="text-white/20 text-[11px] mt-3">Slug: {slug}</p>
      </div>
    </div>
  )

  const b = data.blog || data
  const related = data.baca_juga || []

  return(
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <a href="/blogs" className="inline-block bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[11px] font-black tracking-widest mb-6">← KEMBALI KE BLOG</a>
        <img src={b.thumbnail} alt={b.judul} className="w-full h-[320px] md:h-[460px] object-cover rounded-[24px] border border-white/10 bg-zinc-900"/>
        <div className="mt-7">
          <h1 className="text-[28px] md:text-[36px] font-black mt-4 leading-[1.1]">{b.judul}</h1>
          {b.excerpt && <p className="text-white/60 mt-4 text-[15px] leading-relaxed italic border-l-2 border-[#D4AF37]/60 pl-4">{b.excerpt}</p>}
          <div className="mt-8 text-[15px] leading-[1.9] text-white/80 prose prose-invert max-w-none" dangerouslySetInnerHTML={{__html: b.konten}} />
        </div>
      </div>
    </div>
  )
}
