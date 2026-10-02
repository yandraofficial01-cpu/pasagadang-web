'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function PropertyDetailMewah(){
  const {slug}=useParams()
  const [p,setP]=useState(null)
  const [active,setActive]=useState(0)
  const [zoom,setZoom]=useState(false)
  const API=process.env.NEXT_PUBLIC_API_URL

  useEffect(()=>{
    if(!slug) return
    fetch(`${API}/properties/${slug}`)
.then(r=>r.json()).then(j=>setP(j.data||j))
  },[slug,API])

  useEffect(()=>{
    document.body.style.overflow = zoom? 'hidden' : 'auto'
    return ()=>{document.body.style.overflow='auto'}
  },[zoom])

  const fotos = useMemo(()=> {
    if(!p) return []
    return [p.thumbnail,p.foto_1,p.foto_2,p.foto_3,p.foto_4,p.foto_5,p.foto_6,p.foto_7,p.foto_8].filter(Boolean)
  },[p])

  const mapData = useMemo(()=>{
    if(!p?.fasilitas) return { mapUrl: null, fasilitasBersih: '', list: [], lat:null, lng:null }
    const m = p.fasilitas.match(/\[MAP:(.*?)\]/)
    const mapUrl = m? m[1].trim() : null
    let lat=null,lng=null
    if(mapUrl){
      const at = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
      if(at){ lat=at[1]; lng=at[2] }
    }
    const bersih = p.fasilitas.replace(/\[MAP:.*?\]/g, '').trim()
    const list = bersih.split(',').map(s=>s.trim()).filter(Boolean)
    return { mapUrl, fasilitasBersih: bersih, list, lat, lng }
  },[p])

  if(!p) return <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center font-black tracking-widest animate-pulse">LOADING {slug}...</div>

  const raw=String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
  const wa62=raw.startsWith('0')?'62'+raw.slice(1):raw
  const waMsg=encodeURIComponent(`Halo Pasa Gadang, saya mau tanya:\n\n${p.judul}\n${p.alamat}\nHarga: Rp ${Number(p.harga_cash).toLocaleString('id-ID')}\nLink: ${typeof window!=='undefined'?window.location.href:''}`)

  const realMapLink = mapData.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.alamat||'')}`

  // PIN EXACT MANGGIS GARDEN AA01 - ANTI GESER KE BLOK T5
  const embedUrl = mapData.lat && mapData.lng
 ? `https://www.google.com/maps?q=${mapData.lat},${mapData.lng}&z=19&t=k&output=embed`
  : mapData.mapUrl && mapData.mapUrl.includes('/embed')
 ? mapData.mapUrl
  : `https://www.google.com/maps?q=-0.914529,100.383185&z=19&t=k&output=embed`

  return (
    <main className="min-h-screen bg-[#FFFBF0] pb-10">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#D4AF37]/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <Link href="/properties" className="bg-black text-white px-5 py-2.5 rounded-full font-black text-[12px]">← KEMBALI</Link>
          <span className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-full font-black text-[11px]">{p.tipe_transaksi?.toUpperCase()} {p.badge?`• ${p.badge}`:''}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-6 p-4 mt-4">
        <div>
          {/* FIX FOTO MELEBAR - GAK PAKAI FILL LAGI, PAKAI AUTO HEIGHT */}
          <div className="relative w-full bg-black rounded-[24px] overflow-hidden border-[3px] border-[#D4AF37] flex items-center justify-center min-h-[340px] md:min-h-[500px] cursor-zoom-in" onClick={()=>setZoom(true)}>
            {fotos[active] && (
              <img
                src={fotos[active]}
                alt={p.judul}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}
            {p.badge && (
              <div className="absolute top-3 left-3 z-20">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3.5 py-1.5 rounded-full font-black text-[11px] border border-white flex gap-1 animate-bounce shadow-lg">🔥 {p.badge}</div>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full font-bold text-[10px] border border-white/20">{p.kecamatan}</div>
            <div className="absolute bottom-3 right-3 bg-white text-black px-3 py-1 rounded-full font-black text-[10px]">{active+1}/{fotos.length}</div>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {fotos.map((f,i)=>(
              <div key={i} onClick={()=>setActive(i)} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-black flex-shrink-0 cursor-pointer ${i===active?'border-[#D4AF37]':'border-transparent'}`}>
                <img src={f} alt="" className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border-[2.5px] border-[#D4AF37] shadow-xl h-fit">
          <h1 className="text-[22px] font-black leading-tight">{p.judul}</h1>
          <p className="text-[13px] font-bold text-black/60 mt-2">{p.alamat}</p>
          <p className="text-[11px] font-black text-[#B8960C] mt-1 uppercase">KEC. {p.kecamatan}</p>
          <div className="text-[28px] font-black text-[#B8960C] mt-4">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-[#FFFBF0] border rounded-2xl p-3"><div className="text-[10px] opacity-50">LT</div><div className="font-black">{p.luas_tanah} m²</div></div>
            <div className="bg-[#FFFBF0] border rounded-2xl p-3"><div className="text-[10px] opacity-50">LB</div><div className="font-black">{p.luas_bangunan} m²</div></div>
            <div className="bg-[#FFFBF0] border rounded-2xl p-3"><div className="text-[10px] opacity-50">KT</div><div className="font-black">{p.kamar_tidur} Kamar</div></div>
            <div className="bg-[#FFFBF0] border rounded-2xl p-3"><div className="text-[10px] opacity-50">KM</div><div className="font-black">{p.kamar_mandi} Kamar</div></div>
          </div>

          {mapData.fasilitasBersih && (
            <div className="mt-4 p-4 bg-zinc-50 border rounded-2xl">
              <div className="text-[11px] font-black uppercase opacity-40">Fasilitas</div>
              <div className="flex flex-wrap gap-2 mt-2">{mapData.list.map((f,i)=><span key={i} className="bg-white border px-3 py-1 rounded-full text-[12px] font-bold">{f}</span>)}</div>
            </div>
          )}

          <div className="mt-4 text-[13px] whitespace-pre-line opacity-70">{p.deskripsi}</div>

          <div className="mt-6 rounded-[16px] overflow-hidden border-2 border-[#D4AF37]/30">
            <div className="bg-black text-[#D4AF37] p-2.5 font-black text-[10px] tracking-widest flex justify-between">
              <span>LOKASI EXACT - SATELIT</span>
              <span className="bg-[#D4AF37] text-black px-2 rounded-full">PIN AA01</span>
            </div>
            <div className="h-[340px] bg-zinc-100">
              <iframe src={embedUrl} width="100%" height="100%" style={{border:0}} loading="lazy"></iframe>
            </div>
          </div>

          {/* CUMA 1 SET - GAK DOUBLE LAGI */}
          <div className="mt-5 space-y-3">
            <a href={realMapLink} target="_blank" className="w-full bg-white border-2 border-black rounded-full py-3.5 text-center font-black text-[13px] block">📍 BUKA DI GOOGLE MAPS</a>
            <a href={`https://wa.me/${wa62}?text=${waMsg}`} target="_blank" className="w-full bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[15px] block shadow-lg">WHATSAPP SEKARANG</a>
          </div>
        </div>
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center p-4">
          <button onClick={()=>setZoom(false)} className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full font-black">✕</button>
          <img src={fotos[active]} alt="" className="max-w-[92vw] max-h-[80vh] object-contain rounded-[16px] border-2 border-[#D4AF37]"/>
        </div>
      )}
      {/* HAPUS STICKY BOTTOM BAR BIAR GAK DOUBLE */}
    </main>
  )
    }
