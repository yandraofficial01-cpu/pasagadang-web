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
          throw new Error(t || `Artikel ${slug} tidak ditemukan`)
        }
        const j = await r.json()
        console.log("DETAIL BLOG:", j)
        setData(j)
      }catch(e){
        console.error(e)
        setErr(e.message)
      }finally{
        setLoading(false)
      }
    }
    load()
  },[slug])

  if(loading) return <div className="min-h-screen bg-black text-white p-10">Loading artikel {slug}...</div>
  if(err) return (
    <div className="min-h-screen bg-black text-white p-10">
      <a href="/blogs" className="bg-white/10 px-4 py-2 rounded-full text-[11px] font-black">← KEMBALI</a>
      <p className="mt-6 text-red-400 text-sm">Gagal load: {err}</p>
      <p className="text-white/30 text-[11px] mt-2">Slug: {slug} | API: {API}/blogs/{slug}</p>
    </div>
  )
  if(!data) return null

  const b = data.blog || data
  if(!b ||!b.judul) return <div className="min-h-screen bg-black text-white p-10">Data blog kosong</div>

  return(
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <a href="/blogs" className="inline-block bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[11px] font-black mb-6">← KEMBALI KE BLOG</a>

        <img
          src={b.thumbnail}
          alt={b.judul}
          className="w-full h-[280px] md:h-[420px] object-cover rounded-[24px] border border-white/10 bg-zinc-900"
        />

        <div className="mt-6">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">{b.kategori || 'tips'}</span>
            <span className="text-white/30 text-[11px]">{b.created_at? new Date(b.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : ''}</span>
            <span className="text-white/30 text-[11px]">• {b.views||0} views</span>
          </div>

          <h1 className="text-[28px] md:text-4xl font-black mt-4 leading-tight">{b.judul}</h1>

          {b.excerpt && (
            <p className="text-white/60 mt-3 text-[15px] leading-relaxed italic border-l-2 border-[#D4AF37]/50 pl-4">{b.excerpt}</p>
          )}

          {/* KONTEN UTAMA - render HTML dari admin */}
          <div
            className="mt-8 text-[15px] leading-[1.8] text-white/80 prose prose-invert max-w-none
            prose-p:my-4 prose-headings:font-black prose-headings:text-white prose-strong:text-white
            prose-img:rounded-2xl prose-img:w-full prose-img:my-6 prose-img:border prose-img:border-white/10"
            dangerouslySetInnerHTML={{__html: b.konten || '<p>Konten kosong</p>'}}
          />
        </div>

        {data.baca_juga?.length>0 && (
          <div className="mt-14 border-t border-white/10 pt-8">
            <h3 className="font-black tracking-[0.2em] text-[11px] text-white/40 mb-4">BACA JUGA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.baca_juga.map(x=>(
                <a key={x.id} href={`/blog/${x.slug}`} className="group bg-[#16161E] border border-white/10 rounded-2xl p-3 hover:border-[#D4AF37]/40 transition">
                  <img src={x.thumbnail} alt={x.judul} className="w-full h-28 object-cover rounded-xl bg-zinc-900 group-hover:scale-[1.02] transition"/>
                  <p className="text-[12px] font-black mt-3 line-clamp-2 leading-tight group-hover:text-[#D4AF37]">{x.judul}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
