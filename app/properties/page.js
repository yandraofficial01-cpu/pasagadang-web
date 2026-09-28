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
    const msg=`Halo Pasa Gadang, saya mau tanya:\n${p.judul}\nKec: ${p.kecamatan}\nAlamat: ${p.alamat}\nLT ${p.luas_tanah}m² LB ${p.luas_bangunan}m²\nKT ${p.kamar_tidur} KM ${p.kamar_mandi}\nSertifikat ${p.sertifikat}\nHarga Rp ${Number(p.harga_cash).toLocaleString('id-ID')}\n${typeof window!=='undefined'?window.location.origin+'/properties/'+(p.slug||p.id):''}`
    return `https://wa.me/${wa62}?text=${encodeURIComponent(msg)}`
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0] p-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-[11px] font-black">← HOME</Link>
        <h1 className="text-3xl font-black mt-2 tracking-tighter">PROPERTI<span className="text-[#D4AF37]"> GADANG</span> • {data.length}</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {data.map(p=>{
            const fotos=getFotos(p)
            return (
              <div key={p.id} className="bg-white rounded-[24px] overflow-hidden border-[2.5px] border-[#D4AF37] shadow-[0_8px_30px_rgba(212,175,55,0.12)] flex flex-col">
                <div className="h-[240px] relative cursor-zoom-in" onClick={()=>{setZoomFotos(fotos); setZoomIdx(0)}}>
                  <img src={fotos[0]} className="w-full h-full object-cover"/>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">{p.tipe_transaksi}</span>
                    {p.badge && <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full">{p.badge}</span>}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">📸 {fotos.length} • ZOOM</div>
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur text-white text-[10px] px-3 py-1.5 rounded-full border border-white/10">{p.kecamatan} • {p.sertifikat} • {p.tipe_properti}</div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-black text-[15px] line-clamp-2 leading-tight">{p.judul}</h3>
                  <div className="text-[11px] opacity-60 mt-1">{p.alamat}</div>

                  {/* SPEK SESUAI MODEL */}
                  <div className="grid grid-cols-4 gap-2 mt-3 p-3 rounded-xl bg-[#FFFBF0] border border-[#D4AF37]/20 text-center">
                    <div><div className="text-[8px] opacity-50">LT</div><b className="text-[12px]">{p.luas_tanah}m²</b></div>
                    <div><div className="text-[8px] opacity-50">LB</div><b className="text-[12px]">{p.luas_bangunan}m²</b></div>
                    <div><div className="text-[8px] opacity-50">KT</div><b className="text-[12px]">{p.kamar_tidur}</b></div>
                    <div><div className="text-[8px] opacity-50">KM</div><b className="text-[12px]">{p.kamar_mandi}</b></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                    <div className="bg-zinc-50 border p-2 rounded-xl"><div className="opacity-50 text-[9px]">SERTIFIKAT</div><b>{p.sertifikat}</b></div>
                    <div className="bg-zinc-50 border p-2 rounded-xl"><div className="opacity-50 text-[9px]">TIPE TRANSAKSI</div><b>{p.tipe_transaksi} {p.harga_sewa_per?`/${p.harga_sewa_per}`:''}</b></div>
                  </div>

                  {p.fasilitas && <div className="mt-2 text-[11px] bg-zinc-50 border p-2.5 rounded-xl line-clamp-2"><span className="opacity-50 text-[9px]">FASILITAS</span><br/>{p.fasilitas}</div>}

                  <div className="mt-3">
                    <div className="text-[10px] opacity-50">HARGA CASH</div>
                    <div className="font-black text-[19px] text-[#D4AF37]">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
                    {p.harga_kredit>0 && <div className="text-[10px] bg-black text-white inline-block px-2 py-1 rounded-full mt-1">Kredit: DP {Number(p.dp).toLocaleString('id-ID')} • {p.tenor_bulan} bln x {Number(p.cicilan_per_bulan).toLocaleString('id-ID')}</div>}
                  </div>

                  <div className="flex gap-1 mt-2">{fotos.slice(0,5).map((f,i)=><img key={i} src={f} className="w-8 h-8 rounded-md object-cover border"/>)}{fotos.length>5&&<div className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center text-[9px]">+{fotos.length-5}</div>}</div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-center py-3 rounded-full font-black text-[12px]">💬 {p.wa_number?.slice(-4)||'WA'}</a>
                    <Link href={`/properties/${p.slug}`} className="bg-black text-white text-center py-3 rounded-full font-black text-[12px]">DETAIL →</Link>
                  </div>
                  <div className="text-[9px] opacity-30 mt-2 text-center">👁️ {p.views} views • {p.slug}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {zoomFotos.length>0 && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center p-3">
          <button onClick={()=>setZoomFotos([])} className="absolute top-4 right-4 bg-white text-black w-10 h-10 rounded-full font-black">X</button>
          <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-[12px] font-black">{zoomIdx+1}/{zoomFotos.length}</div>
          <img src={zoomFotos[zoomIdx]} className="max-h-[68vh] rounded-xl border-2 border-[#D4AF37]"/>
          <div className="flex gap-4 mt-4">
            <button onClick={()=>setZoomIdx(i=>i>0?i-1:zoomFotos.length-1)} className="w-12 h-12 bg-white/20 text-white rounded-full text-xl">‹</button>
            <button onClick={()=>setZoomIdx(i=>i<zoomFotos.length-1?i+1:0)} className="w-12 h-12 bg-white text-black rounded-full text-xl">›</button>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto max-w-full">{zoomFotos.map((f,i)=><img key={i} src={f} onClick={()=>setZoomIdx(i)} className={`w-12 h-12 rounded-lg object-cover border-2 ${i===zoomIdx?'border-[#D4AF37]':'border-white/20'}`}/>)}</div>
        </div>
      )}
    </main>
  )
  }
