'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

export default function DetailBlog(){
  const { slug } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{
    if(!slug) return
    fetch(`${API}/blogs/${slug}`, { cache: 'no-store' })
     .then(r=>r.json())
     .then(d=>setData(d))
  },[slug])

  if(!data) return <div className="min-h-screen bg-black text-white p-10">Loading...</div>
  const b = data.blog || data

  return(
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <a href="/blogs" className="text-[11px] font-black text-white/40">← KEMBALI KE BLOG</a>
        <img src={b.thumbnail} className="w-full h-[380px] object-cover rounded-[24px] mt-6 border border-white/10"/>
        <div className="mt-6">
          <span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full">{b.kategori}</span>
          <h1 className="text-3xl font-black mt-3 leading-tight">{b.judul}</h1>
          <p className="text-white/40 text-[11px] mt-2">{new Date(b.created_at).toLocaleDateString('id-ID')} • {b.views} views</p>
          <div className="prose prose-invert mt-6 text-white/80 text-[14px] leading-relaxed" dangerouslySetInnerHTML={{__html: b.konten}} />
        </div>

        {data.baca_juga?.length>0 && (
          <div className="mt-12">
            <h3 className="font-black tracking-widest text-[11px] text-white/40 mb-4">BACA JUGA</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {data.baca_juga.map(x=>(
                <a key={x.id} href={`/blog/${x.slug}`} className="bg-[#16161E] border border-white/10 rounded-xl p-3">
                  <img src={x.thumbnail} className="w-full h-24 object-cover rounded-lg"/>
                  <p className="text-[12px] font-black mt-2 line-clamp-2">{x.judul}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
