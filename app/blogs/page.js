'use client'
import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

export default function BlogPage(){
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [kat, setKat] = useState('semua')

  useEffect(()=>{
    fetch(`${API}/blogs/`, { cache: 'no-store' })
     .then(r=>r.json())
     .then(d=>{
        setBlogs(Array.isArray(d)?d: d.blogs || d.data || [])
        setLoading(false)
      })
  },[])

  const filtered = kat==='semua'? blogs : blogs.filter(b=>b.kategori?.toLowerCase()===kat.toLowerCase())
  const kategoriList = ['semua',...new Set(blogs.map(b=>b.kategori).filter(Boolean))]

  if(loading) return <div className="p-10 text-center text-white bg-black min-h-screen">Loading blog Pasa Gadang...</div>

  return(
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-2">BLOG <span className="text-[#D4AF37]">PASA GADANG</span></h1>
        <p className="text-white/50 mb-6">Tips, inspirasi rumah & kuliner Minang dari Padang.</p>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {kategoriList.map(k=>(
            <button key={k} onClick={()=>setKat(k)}
              className={`px-4 py-2 rounded-full text-[11px] font-black tracking-widest uppercase border ${kat===k?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-white/10 border-white/10 text-white/60'}`}>
              {k}
            </button>
          ))}
        </div>

        {filtered.length===0? (
          <div className="bg-[#16161E] border border-white/10 p-10 rounded-[24px] text-center">
            <p className="text-white/40">Belum ada artikel publish.</p>
            <p className="text-[11px] text-white/20 mt-2">Publish dari /admin/blog dulu bro.</p>
          </div>
        ):(
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(b=>(
              <a key={b.id} href={`/blog/${b.slug}`} className="group bg-[#16161E] border border-white/10 rounded-[24px] overflow-hidden hover:border-[#D4AF37]/50 transition">
                <img src={b.thumbnail} alt={b.judul} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"/>
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black px-2 py-1 rounded-full uppercase">{b.kategori}</span>
                    <span className="text-white/30 text-[10px]">{new Date(b.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  <h3 className="font-black text-[15px] leading-tight mb-2 group-hover:text-[#D4AF37]">{b.judul}</h3>
                  <p className="text-[12px] text-white/50 line-clamp-2">{b.excerpt || b.konten?.substring(0,100)}</p>
                  <div className="mt-3 text-[10px] text-white/20">👁️ {b.views||0} views</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
