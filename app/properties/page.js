'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PropertiesPage(){
  const [data,setData]=useState([])
  const [zoom,setZoom]=useState(null)
  const [loading,setLoading]=useState(true)
  const API=process.env.NEXT_PUBLIC_API_URL

  useEffect(()=>{
    if(!API){ setLoading(false); return }
    fetch(`${API}/properties?is_published=true`)
     .then(r=>r.json())
     .then(j=>{
        const arr = j.data||j.items||j||[]
        setData(Array.isArray(arr)?arr:[])
      })
     .catch(()=>{})
     .finally(()=>setLoading(false))
  },[API])

  const waLink=(p)=>{
    const raw=String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
    const wa62=raw.startsWith('0')?'62'+raw.slice(1):raw
    const text=encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${p.judul} di ${p.kecamatan} LT ${p.luas_tanah}m² LB ${p.luas_bangunan}m² harga Rp ${Number(p.harga_cash||0).toLocaleString('id-ID')} - Link: https://pasagadang.com/properties/${p.slug||p.id}`)
    return `https://wa.me/${wa62}?text=${text}`
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">PROPERTI<span className="text-[#D4AF37]"> GADANG</span></h1>
            <p className="text-gray-500 mt-3 max-w-xl">Kurasi rumah adat Minang dengan sentuhan modern. KPR syariah, material toko sendiri, harga transparan. Data langsung dari DB • WA {data[0]?.wa_number||''}</p>
          </div>
          <Link href="/" className="hidden md:block bg-black text-white px-5 py-2.5 rounded-full text-sm font-black">← HOME</Link>
        </div>

        {loading? (
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[1,2,3].map(i=><div key={i} className="h-[380px] bg-white border border-black/5 rounded-[24px] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {data.map(p=>{
              const fotos=[p.thumbnail,p.foto_1,p.foto_2].filter(Boolean)
              const mainImg=fotos[0]||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'
              return (
                <div key={p.id} className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col" style={{border:'2.5px solid #D4AF37', boxShadow:'0 0 0 1px rgba(212,175,55,0.2), 0 12px 32px rgba(212,175,55,0.12)'}}>
                  <div className="h-[240px] overflow-hidden relative cursor-zoom-in" onClick={()=>setZoom(mainImg)}>
                    <img src={mainImg} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                    <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase border border-black/10 shadow">{p.tipe_transaksi} {p.badge?`• ${p.badge}`:''}</span>
                    <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur text-white text-[10px] px-3 py-1.5 rounded-full border border-white/10">{p.kecamatan} • {p.sertifikat} • {p.tipe_properti}</span>
                    <span className="absolute top-4 right-4 bg-black/60 text-white text-[9px] px-2 py-1 rounded-full">🔍 ZOOM</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-black text-[16px] leading-tight line-clamp-2 min-h-[42px]">{p.judul}</h3>
                    <p className="text-[12px] text-gray-500 mt-1 line-clamp-1">{p.alamat||p.kecamatan} • LT {p.luas_tanah}m² LB {p.luas_bangunan}m²</p>

                    <div className="grid grid-cols-4 gap-2 mt-3 p-2.5 rounded-xl bg-[#FFFBF0] border border-[#D4AF37]/20 text-[11px] text-center">
                      <div><div className="opacity-50 text-[9px]">LT</div><b>{p.luas_tanah}m²</b></div>
                      <div><div className="opacity-50 text-[9px]">LB</div><b>{p.luas_bangunan}m²</b></div>
                      <div><div className="opacity-50 text-[9px]">KT</div><b>{p.kamar_tidur}</b></div>
                      <div><div className="opacity-50 text-[9px]">KM</div><b>{p.kamar_mandi}</b></div>
                    </div>

                    <div className="flex justify-between items-center mt-5">
                      <div>
                        <p className="text-[11px] opacity-50">Harga Cash</p>
                        <p className="text-[20px] font-black text-[#D4AF37]">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-center py-3 rounded-full font-black text-[12px] shadow">💬 WA</a>
                      <Link href={`/properties/${p.slug||p.id}`} className="bg-black text-white text-center py-3 rounded-full font-black text-[12px]">DETAIL →</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {data.length===0 &&!loading && <div className="text-center mt-20 opacity-50">Belum ada properti publish. Cek di /admin/properti is_published = true</div>}
      </div>

      {zoom && (
        <div onClick={()=>setZoom(null)} className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <img src={zoom} className="max-w-full max-h-[90vh] rounded-2xl object-contain border-2 border-[#D4AF37]"/>
          <button className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full font-black">X</button>
        </div>
      )}
    </main>
  )
                                      }
