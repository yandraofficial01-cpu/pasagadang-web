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
    const txt=encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${p.judul} - ${p.kecamatan} - LT ${p.luas_tanah}m² LB ${p.luas_bangunan}m² - Rp ${Number(p.harga_cash).toLocaleString('id-ID')} \n${p.alamat}`)
    return `https://wa.me/${wa62}?text=${txt}`
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0] p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black">PROPERTI<span className="text-[#D4AF37]"> LENGKAP</span></h1>
        <p className="text-[12px] opacity-60 mt-1">Model DB: judul, alamat, LT/LB, KT/KM, sertifikat, tipe, fasilitas, harga cash/kredit, wa_number, 8 foto, video</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {data.map(p=>{
            const fotos=getFotos(p)
            return (
              <div key={p.id} className="bg-white rounded-[24px] overflow-hidden border-[2.5px] border-[#D4AF37] shadow-[0_8px_30px_rgba(212,175,55,0.15)] flex flex-col">
                <div className="h-[220px] relative" onClick={()=>{setZoomFotos(fotos); setZoomIdx(0)}}>
                  <img src={fotos[0]} className="w-full h-full object-cover cursor-zoom-in"/>
                  <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full">{p.tipe_transaksi?.toUpperCase()} {p.badge?`• ${p.badge}`:''}</div>
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">📸 {fotos.length} FOTO • ZOOM</div>
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] px-3 py-1.5 rounded-full">{p.kecamatan} • {p.sertifikat} • {p.tipe_properti}</div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="font-black text-[15px] leading-tight">{p.judul}</div>
                  <div className="text-[11px] opacity-60 mt-1 line-clamp-1">{p.alamat}</div>

                  {/* SPEK LENGKAP MODEL */}
                  <div className="grid grid-cols-4 gap-2 mt-3 p-3 rounded-xl bg-[#FFFBF0] border border-[#D4AF37]/20 text-center">
                    <div><div className="text-[9px] opacity-50">LT</div><div className="font-black text-[12px]">{p.luas_tanah}m²</div></div>
                    <div><div className="text-[9px] opacity-50">LB</div><div className="font-black text-[12px]">{p.luas_bangunan}m²</div></div>
                    <div><div className="text-[9px] opacity-50">KT</div><div className="font-black text-[12px]">{p.kamar_tidur}</div></div>
                    <div><div className="text-[9px] opacity-50">KM</div><div className="font-black text-[12px]">{p.kamar_mandi}</div></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div className="bg-zinc-50 p-2 rounded-lg"><div className="opacity-50 text-[9px]">SERTIFIKAT</div><b>{p.sertifikat||'SHM'}</b></div>
                    <div className="bg-zinc-50 p-2 rounded-lg"><div className="opacity-50 text-[9px]">TIPE</div><b>{p.tipe_properti||'Rumah'}</b></div>
                  </div>

                  {p.fasilitas && <div className="text-[11px] mt-2 p-2 bg-zinc-50 rounded-lg"><span className="opacity-50 text-[9px]">FASILITAS:</span><br/><b className="line-clamp-2">{p.fasilitas}</b></div>}

                  <div className="mt-3">
                    <div className="text-[10px] opacity-50">Harga Cash</div>
                    <div className="font-black text-[19px] text-[#D4AF37]">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
                    {p.harga_kredit? <div className="text-[10px] mt-1">Kredit: DP Rp {Number(p.dp).toLocaleString('id-ID')} • {p.tenor_bulan} bln x Rp {Number(p.cicilan_per_bulan).toLocaleString('id-ID')}</div> : <div className="text-[10px] opacity-50">Cash keras • Siap survei</div>}
                  </div>

                  <div className="mt-3 flex gap-2 text-[9px] opacity-40">
                    <span>👁️ {p.views||0} views</span><span>• {p.wa_number}</span>{p.video_url&&<span>• 🎥 Video</span>}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-center py-3 rounded-full font-black text-[12px]">💬 WA</a>
                    <Link href={`/properties/${p.slug||p.id}`} className="bg-black text-white text-center py-3 rounded-full font-black text-[12px]">DETAIL SPEK →</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ZOOM GALLERY BISA GESER */}
      {zoomFotos.length>0 && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center p-2">
          <button onClick={()=>setZoomFotos([])} className="absolute top-4 right-4 bg-white text-black w-10 h-10 rounded-full font-black">X</button>
          <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-[12px] font-black">{zoomIdx+1}/{zoomFotos.length}</div>
          <img src={zoomFotos[zoomIdx]} className="max-h-[70vh] rounded-xl border-2 border-[#D4AF37] object-contain"/>
          <div className="flex gap-3 mt-4">
            <button onClick={()=>setZoomIdx(i=>i>0?i-1:zoomFotos.length-1)} className="w-12 h-12 bg-white/20 text-white rounded-full">‹</button>
            <button onClick={()=>setZoomIdx(i=>i<zoomFotos.length-1?i+1:0)} className="w-12 h-12 bg-white text-black rounded-full">›</button>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto max-w-full">
            {zoomFotos.map((f,i)=><img key={i} src={f} onClick={()=>setZoomIdx(i)} className={`w-12 h-12 rounded-lg object-cover border-2 ${i===zoomIdx?'border-[#D4AF37]':'border-white/20'}`}/>)}
          </div>
        </div>
      )}
    </main>
  )
}
