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

  // === FIX MAP REAL ===
  const mapData = useMemo(()=>{
    if(!p?.fasilitas) return { mapUrl: null, fasilitasBersih: '', list: [] }
    const m = p.fasilitas.match(/\[MAP:(.*?)\]/)
    const mapUrl = m? m[1].trim() : null
    const bersih = p.fasilitas.replace(/\[MAP:.*?\]/g, '').trim()
    const list = bersih.split(',').map(s=>s.trim()).filter(Boolean)
    return { mapUrl, fasilitasBersih: bersih, list }
  },[p])

  const cicilanAuto = useMemo(()=>{
    if(!p?.harga_cash ||!p?.dp) return 0
    const sisa = Number(p.harga_cash) - Number(p.dp)
    return Math.ceil(sisa / (Number(p.tenor_bulan)||120))
  },[p])

  if(!p) return <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center font-black tracking-widest animate-pulse">LOADING {slug}...</div>

  const raw=String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
  const wa62=raw.startsWith('0')?'62'+raw.slice(1):raw
  const waMsg=encodeURIComponent(`Halo Pasa Gadang, saya serius mau tanya detail:\n\n${p.judul}\nAlamat: ${p.alamat}\nKecamatan: ${p.kecamatan}\nLT ${p.luas_tanah}m² LB ${p.luas_bangunan}m² KT ${p.kamar_tidur} KM ${p.kamar_mandi}\nSertifikat: ${p.sertifikat}\nHarga: Rp ${Number(p.harga_cash).toLocaleString('id-ID')}\n\nLink: ${typeof window!=='undefined'?window.location.href+'?ref=pasagadang':''}`)

  const realMapLink = mapData.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.alamat||p.kecamatan||'Padang')}`
  const embedUrl = mapData.mapUrl
   ? `https://www.google.com/maps?q=${encodeURIComponent(mapData.mapUrl)}&z=17&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(p.alamat||'Padang')}&z=15&output=embed`

  return (
    <main className="min-h-screen bg-[#FFFBF0] pb-28">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#D4AF37]/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <Link href="/properties" className="bg-black text-white px-5 py-2.5 rounded-full font-black text-[12px]">← KEMBALI</Link>
          <div className="flex gap-2">
            <span className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-full font-black text-[11px] tracking-widest">{p.tipe_transaksi?.toUpperCase()}</span>
            {p.badge && <span className="bg-black text-[#D4AF37] px-4 py-1.5 rounded-full font-black text-[11px] border border-[#D4AF37]">{p.badge}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-6 p-4 mt-4">
        <div>
          <div className="relative h-[380px] md:h-[520px] rounded-[32px] overflow-hidden border-[3px] border-[#D4AF37] shadow-[0_20px_60px_rgba(212,175,55,0.25)] bg-black cursor-zoom-in" onClick={()=>setZoom(true)}>
            {fotos[active] && <Image src={fotos[active]} alt={p.judul} fill className="object-cover" priority />}
            <div className="absolute top-5 left-5 bg-black/80 backdrop-blur text-white px-4 py-2 rounded-full font-bold text-[12px] border border-white/20">{p.kecamatan} • {p.sertifikat} • {p.tipe_properti}</div>
            <div className="absolute top-5 right-5 bg-white text-black px-4 py-2 rounded-full font-black text-[12px]">{active+1} / {fotos.length}</div>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-2 rounded-full flex gap-2">{fotos.map((_,i)=><button key={i} onClick={e=>{e.stopPropagation();setActive(i)}} className={`h-2 rounded-full transition-all ${i===active?'w-8 bg-[#D4AF37]':'w-2 bg-white/50'}`}/>)}</div>
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {fotos.map((f,i)=>(
              <div key={i} onClick={()=>setActive(i)} className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-[3px] cursor-pointer flex-shrink-0 transition-all ${i===active?'border-[#D4AF37] scale-105 shadow-lg':'border-white'}`}>
                <Image src={f} alt={`foto ${i}`} fill className="object-cover"/>
              </div>
            ))}
          </div>
          {p.video_url && (
            <div className="mt-6 rounded-[24px] overflow-hidden border-2 border-black">
              <div className="bg-black text-white p-3 font-black text-[12px] tracking-widest">VIDEO TOUR</div>
              <div className="aspect-video bg-black"><iframe src={p.video_url} className="w-full h-full" allowFullScreen/></div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-[28px] p-7 border-[2.5px] border-[#D4AF37] shadow-xl">
            <h1 className="text-[26px] md:text-[30px] font-black leading-[0.95] text-black tracking-tight">{p.judul}</h1>
            <p className="text-[14px] font-bold text-black/60 mt-3 leading-snug">{p.alamat}</p>
            <p className="text-[12px] font-black tracking-widest text-[#B8960C] mt-2 uppercase">KEC. {p.kecamatan}</p>

            <div className="mt-6">
              <div className="text-[11px] font-black tracking-[0.2em] text-black/40 uppercase">Harga Cash</div>
              <div className="text-[34px] font-black text-[#B8960C] tracking-tighter leading-none mt-1">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
              {p.harga_sewa_per && <div className="text-[12px] font-bold mt-1">Sewa {p.harga_sewa_per}</div>}
            </div>

            <div className="mt-5 bg-black text-white rounded-2xl p-5 border border-[#D4AF37]/50">
              <div className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase">SIMULASI KPR SYARIAH CEPAT</div>
              <div className="mt-2 space-y-1 text-[13px] font-bold">
                <div>DP: Rp {Number(p.dp||0).toLocaleString('id-ID')}</div>
                <div>Cicilan Auto: Rp {cicilanAuto.toLocaleString('id-ID')} /bulan x {p.tenor_bulan||120} bulan</div>
                <div className="text-[11px] opacity-60 mt-1">*Hitung otomatis, nego bisa langsung WA</div>
              </div>
            </div>

            {p.harga_kredit>0 && (
              <div className="mt-3 bg-[#FFFBF0] rounded-2xl p-4 border border-[#D4AF37]/40 text-[13px] font-bold">
                Harga Kredit: Rp {Number(p.harga_kredit).toLocaleString('id-ID')} • Tenor {p.tenor_bulan} Bulan x Rp {Number(p.cicilan_per_bulan).toLocaleString('id-ID')}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-[#FFFBF0] border border-[#D4AF37]/40 rounded-2xl p-4"><div className="text-[10px] font-bold text-black/40 tracking-widest uppercase">Luas Tanah</div><div className="text-[18px] font-black text-black mt-1">{p.luas_tanah} m²</div></div>
              <div className="bg-[#FFFBF0] border border-[#D4AF37]/40 rounded-2xl p-4"><div className="text-[10px] font-bold text-black/40 tracking-widest uppercase">Luas Bangunan</div><div className="text-[18px] font-black text-black mt-1">{p.luas_bangunan} m²</div></div>
              <div className="bg-[#FFFBF0] border border-[#D4AF37]/40 rounded-2xl p-4"><div className="text-[10px] font-bold text-black/40 tracking-widest uppercase">Kamar Tidur</div><div className="text-[18px] font-black text-black mt-1">{p.kamar_tidur} Kamar</div></div>
              <div className="bg-[#FFFBF0] border border-[#D4AF37]/40 rounded-2xl p-4"><div className="text-[10px] font-bold text-black/40 tracking-widest uppercase">Kamar Mandi</div><div className="text-[18px] font-black text-black mt-1">{p.kamar_mandi} Kamar</div></div>
              <div className="bg-white border border-black/10 rounded-2xl p-4"><div className="text-[10px] font-bold text-black/40 tracking-widest uppercase">Sertifikat</div><div className="text-[15px] font-black text-black mt-1">{p.sertifikat}</div></div>
              <div className="bg-white border border-black/10 rounded-2xl p-4"><div className="text-[10px] font-bold text-black/40 tracking-widest uppercase">Tipe Properti</div><div className="text-[15px] font-black text-black mt-1">{p.tipe_properti}</div></div>
            </div>

            {mapData.fasilitasBersih && (
              <div className="mt-5 p-5 bg-zinc-50 border rounded-2xl">
                <div className="text-[11px] font-black tracking-widest uppercase text-black/40">Fasilitas Lengkap</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {mapData.list.map((f,i)=>(
                    <span key={i} className="bg-white border border-black/10 px-3 py-1.5 rounded-full text-[12px] font-bold">{f}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <div className="text-[11px] font-black tracking-widest uppercase text-black/40">Deskripsi</div>
              <div className="text-[14px] font-medium text-black/80 mt-2 whitespace-pre-line leading-relaxed">{p.deskripsi}</div>
            </div>

            {/* MAP REAL - TAMPILAN ASLI KAYAK GOOGLE MAPS */}
            <div className="mt-6 rounded-[20px] overflow-hidden border-2 border-[#D4AF37]/30">
              <div className="bg-black text-[#D4AF37] p-3 font-black text-[11px] tracking-widest flex justify-between items-center">
                <span>LOKASI REAL - GOOGLE MAPS</span>
                {mapData.mapUrl && <span className="bg-[#D4AF37] text-black px-2 py-0.5 rounded-full text-[9px]">REAL</span>}
              </div>
              <div className="h-[280px] bg-zinc-100">
                <iframe src={embedUrl} width="100%" height="100%" style={{border:0}} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a href={realMapLink} target="_blank" className="bg-white border-2 border-black rounded-full py-3 text-center font-black text-[12px] hover:bg-black hover:text-white transition">📍 MAP</a>
              <button onClick={()=>{navigator.clipboard.writeText(window.location.href); alert('Link disalin!')}} className="bg-black text-[#D4AF37] rounded-full py-3 text-center font-black text-[12px] border border-[#D4AF37]">🔗 SHARE</button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <a href={`https://wa.me/${wa62}?text=${waMsg}`} target="_blank" className="w-full bg-[#25D366] text-white text-center py-5 rounded-full font-black text-[16px] shadow-[0_10px_30px_rgba(37,211,102,0.4)] tracking-wide">WHATSAPP SEKARANG</a>
              <div className="text-center text-[10px] font-bold tracking-widest text-black/30 uppercase mt-1">👁️ {p.views} Views • ID {p.id} • {p.slug}</div>
            </div>
          </div>
        </div>
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center p-4">
          <button onClick={()=>setZoom(false)} className="absolute top-6 right-6 bg-white text-black w-12 h-12 rounded-full font-black text-xl z-50">✕</button>
          <div className="absolute top-6 left-6 bg-[#D4AF37] text-black px-5 py-2 rounded-full font-black text-[13px] tracking-widest z-50">{active+1} / {fotos.length} • {p.judul}</div>
          <div className="relative w-[92vw] h-[70vh]"><Image src={fotos[active]} alt="zoom" fill className="object-contain rounded-[20px] border-[3px] border-[#D4AF37]"/></div>
          <div className="flex gap-6 mt-6">
            <button onClick={()=>setActive(i=>i>0?i-1:fotos.length-1)} className="w-16 h-16 bg-white/15 backdrop-blur text-white rounded-full text-3xl border border-white/20">‹</button>
            <button onClick={()=>setActive(i=>i<fotos.length-1?i+1:0)} className="w-16 h-16 bg-white text-black rounded-full text-3xl font-black shadow-2xl">›</button>
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-[#D4AF37]/30 flex gap-3 z-40">
        <a href={`https://wa.me/${wa62}?text=${waMsg}`} target="_blank" className="flex-1 bg-[#25D366] text-white text-center py-4 rounded-full font-black">WHATSAPP</a>
        <a href={realMapLink} target="_blank" className="px-6 bg-black text-white py-4 rounded-full font-black text-[12px]">MAP</a>
      </div>
    </main>
  )
    }
