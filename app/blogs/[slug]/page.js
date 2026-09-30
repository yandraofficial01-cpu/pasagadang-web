r'use client'
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
        setErr(e.message || 'Artikel tidak ditemukan. Pastikan di admin sudah ✅ PUBLISH')
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
        <p className="text-white/20 text-[11px] mt-3">Slug: {slug}<br/>API: {API}/blogs/{slug}<br/>Cek di admin/blog pastikan status ✅ PUBLISH</p>
      </div>
    </div>
  )

  // BE return {blog, baca_juga} -> sesuai admin lu
  const b = data.blog || data
  const related = data.baca_juga || []

  return(
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <a href="/blogs" className="inline-block bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[11px] font-black tracking-widest mb-6">← KEMBALI KE BLOG</a>

        <img src={b.thumbnail} alt={b.judul} className="w-full h-[320px] md:h-[460px] object-cover rounded-[24px] border border-white/10 bg-zinc-900"/>

        <div className="mt-7">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">{b.kategori}</span>
            {b.tags && <span className="text-white/20 text-[10px] uppercase">{b.tags}</span>}
            <span className="text-white/30 text-[11px]">• {b.created_at? new Date(b.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : ''} • {b.views||0} views</span>
          </div>

          <h1 className="text-[28px] md:text-[36px] font-black mt-4 leading-[1.1]">{b.judul}</h1>
          {b.excerpt && <p className="text-white/60 mt-4 text-[15px] leading-relaxed italic border-l-2 border-[#D4AF37]/60 pl-4">{b.excerpt}</p>}

          {/* Konten dari admin: udah include <img> Cloudinary dari tombol + Gambar Isi */}
          <div
            className="mt-8 text-[15px] leading-[1.9] text-white/80 prose prose-invert max-w-none
            prose-p:my-4 prose-headings:font-black prose-headings:text-white prose-strong:text-white
            prose-a:text-[#D4AF37] prose-img:rounded-2xl prose-img:w-full prose-img:my-6 prose-img:border prose-img:border-white/10"
            dangerouslySetInnerHTML={{__html: b.konten}}
          />
        </div>

        {related.length>0 && (
          <div className="mt-14 border-t border-white/10 pt-8">
            <h3 className="font-black tracking-[0.25em] text-[11px] text-white/40 mb-4">BACA JUGA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(x=>(
                <a key={x.id} href={`/blog/${x.slug}`} className="group bg-[#16161E] border border-white/10 rounded-2xl p-3 hover:border-[#D4AF37]/40 transition">
                  <img src={x.thumbnail} className="w-full h-28 object-cover rounded-xl bg-zinc-900"/>
                  <p className="text-[12px] font-black mt-3 line-clamp-2 leading-tight group-hover:text-[#D4AF37]">{x.judul}</p>
                  <p className="text-[10px] text-white/30 mt-1">{x.kategori}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
              
