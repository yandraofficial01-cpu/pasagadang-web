'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PropertiesPage(){
  const [data,setData]=useState([])
  const [zoomFotos,setZoomFotos]=useState([])
  const [zoomIdx,setZoomIdx]=useState(0)
  const API=process.env.NEXT_PUBLIC_API_URL

  useEffect(()=>{
    fetch(`${API}/properties?is_published=true`)
   .then(r=>r.json()).then(j=>setData(j.data||j||[]))
  },[])

  const getFotos=(p)=>[p.thumbnail,p.foto_1,p.foto_2,p.foto_3,p.foto_4,p.foto_5,p.foto_6,p.foto_7,p.foto_8].filter(Boolean)

  const waLink=(p)=>{
    const raw=String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
    const wa62=raw.startsWith('0')?'62'+raw.slice(1):raw
    return `https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%20saya%20mau%20tanya%20${encodeURIComponent(p.judul)}%20di%20${p.kecamatan}`
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0] p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black tracking-tighter text-black">PROPERTI<span className="text-[#D4AF37]"> GADANG</span></h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {data.map(p=>{
            const fotos=getFotos(p)
            return (
              <div key={p.id} className="bg-white rounded-[28px] overflow-hidden border-[2px] border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.18)] flex flex-col">
                {/* FOTO */}
                <div className="h-[260px] relative cursor-pointer" onClick={()=>{setZoomFotos(fotos); setZoomIdx(0)}}>
                  <img src={fotos[0]} className="w-full h-full object-cover"/>
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest">{p.tipe_transaksi?.toUpperCase()}</div>
                  <div className="absolute top-4 right-4 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{fotos.length} FOTO • ZOOM</div>
                  <div className="absolute bottom-4 left-4 bg-black text-white text-[12px] font-bold px-4 py-2 rounded-full">{p.kecamatan} • {p.sertifikat} • {p.tipe_properti}</div>
                </div>

                {/* CONTENT PREMIUM - TEKS TAJAM HITAM */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-black text-[18px] text-black leading-tight">{p.judul}</h3>
                  <p className="text-[13px] font-medium text-black/70 mt-1">{p.alamat}</p>

                  {/* 1. SPEK LENGKAP BUKAN SINGKATAN */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl">
                      <div className="text-[10px] font-bold tracking-widest text-black/50 uppercase">Luas Tanah</div>
                      <div className="text-[15px] font-black text-black mt-1">{p.luas_tanah} m²</div>
                    </div>
                    <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl">
                      <div className="text-[10px] font-bold tracking-widest text-black/50 uppercase">Luas Bangunan</div>
                      <div className="text-[15px] font-black text-black mt-1">{p.luas_bangunan} m²</div>
                    </div>
                    <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl">
                      <div className="text-[10px] font-bold tracking-widest text-black/50 uppercase">Kamar Tidur</div>
                      <div className="text-[15px] font-black text-black mt-1">{p.kamar_tidur} Kamar</div>
                    </div>
                    <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl">
                      <div className="text-[10px] font-bold tracking-widest text-black/50 uppercase">Kamar Mandi</div>
                      <div className="text-[15px] font-black text-black mt-1">{p.kamar_mandi} Kamar</div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-2xl bg-black text-white">
                    <div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Fasilitas</div>
                    <div className="text-[13px] font-bold mt-1 line-clamp-2">{p.fasilitas||'- Free carport, free taman'}</div>
                  </div>

                  {/* HARGA TAJAM */}
                  <div className="mt-5">
                    <div className="text-[11px] font-black tracking-widest text-black/50 uppercase">Harga Cash</div>
                    <div className="text-[26px] font-black text-[#B8960C] tracking-tight">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
                    {p.harga_kredit>0 && <div className="text-[12px] font-bold text-black/70 mt-1">Kredit: DP {Number(p.dp).toLocaleString('id-ID')} • {p.tenor_bulan} bln</div>}
                  </div>

                  {/* 3 & 4. HAPUS FOTO KECIL, TOMBOL WA JADI WHATSAPP */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[14px] shadow-lg">Whatsapp</a>
                    <Link href={`/properties/${p.slug}`} className="bg-black text-white text-center py-4 rounded-full font-black text-[14px]">DETAIL →</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ZOOM MODAL BISA NEXT */}
      {zoomFotos.length>0 && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center p-4">
          <button onClick={()=>setZoomFotos([])} className="absolute top-5 right-5 bg-white text-black w-10 h-10 rounded-full font-black">X</button>
          <div className="absolute top-5 left-5 bg-[#D4AF37] text-black px-4 py-1 rounded-full text-[13px] font-black">{zoomIdx+1} / {zoomFotos.length}</div>
          <img src={zoomFotos[zoomIdx]} className="max-h-[70vh] rounded-2xl border-2 border-[#D4AF37] object-contain"/>
          <div className="flex gap-4 mt-5">
            <button onClick={()=>setZoomIdx(i=>i>0?i-1:zoomFotos.length-1)} className="w-14 h-14 bg-white/20 text-white rounded-full text-2xl">‹</button>
            <button onClick={()=>setZoomIdx(i=>i<zoomFotos.length-1?i+1:0)} className="w-14 h-14 bg-white text-black rounded-full text-2xl">›</button>
          </div>
        </div>
      )}
    </main>
  )
}
