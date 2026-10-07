'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function PropertyDetailMewah(){
  const {slug}=useParams()
  const [p,setP]=useState(null)
  const [isLoading,setIsLoading]=useState(true) // FIX 1
  const [active,setActive]=useState(0)
  const [zoom,setZoom]=useState(false)
  const API=process.env.NEXT_PUBLIC_API_URL

  useEffect(()=>{
    if(!slug) return
    setIsLoading(true)
    fetch(`${API}/properties/${slug}`)
     .then(r=>r.json())
     .then(j=>setP(j.data||j))
     .catch(()=>{})
     .finally(()=>setIsLoading(false)) // FIX 2
  },[slug,API])

  useEffect(()=>{
    document.body.style.overflow = zoom? 'hidden' : 'auto'
    return ()=>{document.body.style.overflow='auto'}
  },[zoom])

  const fotos = useMemo(()=> p? [p.thumbnail,p.foto_1,p.foto_2,p.foto_3,p.foto_4,p.foto_5,p.foto_6,p.foto_7,p.foto_8].filter(Boolean) : [],[p])

  const mapData = useMemo(()=>{
    if(!p?.fasilitas) return { mapUrl: null, mapImg: null, fasilitasBersih: '', list: [] }
    const m = p.fasilitas.match(/\[MAP:(.*?)\]/)
    const mImg = p.fasilitas.match(/\[MAP_IMG:(.*?)\]/)
    const mapUrl = m? m[1].trim() : null
    const mapImg = mImg? mImg[1].trim() : null
    const bersih = p.fasilitas.replace(/\[MAP:.*?\]/g,'').replace(/\[MAP_IMG:.*?\]/g,'').trim()
    const list = bersih.split(',').map(s=>s.trim()).filter(Boolean)
    return { mapUrl, mapImg, fasilitasBersih: bersih, list }
  },[p])

  const cicilanAuto = useMemo(()=>{
    if(!p?.harga_cash ||!p?.dp) return 0
    const sisa = Number(p.harga_cash) - Number(p.dp)
    return Math.ceil(sisa / (Number(p.tenor_bulan)||120))
  },[p])

  const handleShare = async ()=>{
    const url = window.location.href
    const title = p.judul
    const text = `${p.judul} - Rp ${Number(p.harga_cash).toLocaleString('id-ID')} - ${p.alamat}\n`
    if(navigator.share){
      try{ await navigator.share({ title, text, url }) }catch(e){}
    }else{
      await navigator.clipboard.writeText(url)
      window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank')
    }
  }

  // LOADING BENERAN - SAMA KAYAK LIST
  if(isLoading){
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-2 border-[#F5E6C8] rounded-full"></div>
          <div className="absolute inset-0 border-2 border-t-[#D4AF37] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[12px] tracking-[0.4em] font-black text-[#333]">PASA GADANG</p>
        <p className="text-[10px] tracking-widest opacity-30 mt-2 font-bold">LOADING {slug}...</p>
      </div>
    )
  }

  if(!p) return <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center font-black">Properti tidak ditemukan</div>

  const raw=String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
  const wa62=raw.startsWith('0')?'62'+raw.slice(1):raw
  const waMsg=encodeURIComponent(`Halo Pasa Gadang, saya serius mau tanya detail:\n\n${p.judul}\nAlamat: ${p.alamat}\nKecamatan: ${p.kecamatan}\nLT ${p.luas_tanah}m² LB ${p.luas_bangunan}m² KT ${p.kamar_tidur} KM ${p.kamar_mandi}\nHarga: Rp ${Number(p.harga_cash).toLocaleString('id-ID')}\n\nLink: ${typeof window!=='undefined'?window.location.href:''}`)
  const realMapLink = mapData.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.alamat||'')}`

  // DETEKSI TERJUAL - SAMA LOGIKA KAYAK LIST
  const isTerjual = (p.badge||'').toLowerCase().includes('terjual') || (p.status_properti||p.status||'').toLowerCase().includes('terjual')

  return (
    <main className="min-h-screen bg-[#FFFBF0] pb-10 overflow-x-hidden w-full">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#D4AF37]/30 w-full">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4 w-full">
          <Link href="/properties" className="bg-black text-white px-5 py-2.5 rounded-full font-black text-[12px]">← KEMBALI</Link>
          <div className="flex gap-2 shrink-0">
            <span className="bg-[#D4AF37] text-black px-4 py-1.5 rounded-full font-black text-[11px]">{p.tipe_transaksi?.toUpperCase()}</span>
            {p.badge &&!isTerjual && <span className="bg-black text-[#D4AF37] px-4 py-1.5 rounded-full font-black text-[11px] border border-[#D4AF37] animate-bounce">🔥 {p.badge}</span>}
            {isTerjual && <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-black text-[11px] border border-white">TERJUAL</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 mt-4 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="w-full min-w-0">
          <div className="relative aspect-[4/3] md:aspect-[16/10] w-full rounded-[32px] overflow-hidden border-[3px] border-[#D4AF37] bg-black cursor-zoom-in" onClick={()=>!isTerjual && setZoom(true)}>
            {fotos[active] && <Image src={fotos[active]} alt={p.judul} fill className="object-cover" priority />}
            <div className="absolute top-5 left-5 bg-black/80 text-white px-4 py-2 rounded-full font-bold text-[12px] border border-white/20 max-w-[70%] truncate">{p.kecamatan} • {p.sertifikat}</div>
            <div className="absolute top-5 right-5 bg-white text-black px-4 py-2 rounded-full font-black text-[12px]">{active+1} / {fotos.length}</div>

            {/* BADGE KECIL KALO BUKAN TERJUAL */}
            {p.badge &&!isTerjual && <div className="absolute bottom-5 left-5 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-black text-[11px] border border-white shadow-lg animate-pulse">🔥 {p.badge}</div>}

            {/* BADGE TERJUAL BULAT GEDE - PERSIS SCREENSHOT */}
            {isTerjual && (
              <div className="absolute inset-0 z-20">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#D4AF37] blur-[30px] opacity-70 rounded-full scale-125"></div>
                    <div className="relative w-[210px] h-[210px] rounded-full bg-[#CC0000] border-[7px] border-[#D4AF37] flex flex-col items-center justify-center rotate-[-12deg] shadow-2xl">
                      <div className="absolute inset-[10px] rounded-full border border-dashed border-white/60"></div>
                      <div className="text-[#FFEB7F] text-[12px] font-black tracking-[0.2em]">★ TERJUAL ★</div>
                      <div className="text-white text-[34px] font-black tracking-tight leading-none mt-1">TERJUAL</div>
                      <div className="w-[70%] h-[3px] bg-[#D4AF37] my-2"></div>
                      <div className="text-[#FFEB7F] text-[10px] font-black tracking-[0.4em]">PASA GADANG</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-2 rounded-full font-black text-[11px] shadow-xl whitespace-nowrap">UNIT INI SUDAH TERJUAL</div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 w-full">
            {fotos.map((f,i)=>(
              <div key={i} onClick={()=>{if(!isTerjual) setActive(i)}} className={`relative w-20 h-20 rounded-2xl overflow-hidden border-[3px] cursor-pointer shrink-0 ${i===active?'border-[#D4AF37]':'border-white'} ${isTerjual?'opacity-50':''}`}>
                <Image src={f} alt="" fill className="object-cover"/>
              </div>
            ))}
          </div>
          {p.video_url &&!isTerjual && (
            <div className="mt-6 rounded-[24px] overflow-hidden border-2 border-black w-full">
              <div className="bg-black text-white p-3 font-black text-[12px]">🎥 VIDEO TOUR</div>
              <div className="aspect-video bg-black"><iframe src={p.video_url} className="w-full h-full" allowFullScreen/></div>
            </div>
          )}
        </div>

        <div className="w-full min-w-0">
          <div className="bg-white rounded-[28px] p-7 border-[2.5px] border-[#D4AF37] shadow-xl w-full text-black">
            <h1 className="text-[26px] font-black leading-[0.95] text-black">{p.judul}</h1>
            <p className="text-[14px] font-bold text-black/60 mt-3">{p.alamat}</p>
            <p className="text-[12px] font-black text-[#B8960C] mt-2 uppercase">KEC. {p.kecamatan}</p>
            <div className="text-[30px] font-black text-[#B8960C] mt-4">Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>

            {isTerjual? (
              <div className="mt-5 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-4 text-center font-black text-[13px]">⚠️ MAAF, UNIT INI SUDAH TERJUAL. LIHAT UNIT LAIN DI PASA GADANG.</div>
            ) : (
              <div className="mt-5 bg-black text-white rounded-2xl p-5">
                <div className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase">SIMULASI KPR SYARIAH CEPAT</div>
                <div className="mt-2 text-[13px] font-bold">
                  <div>DP: Rp {Number(p.dp||0).toLocaleString('id-ID')}</div>
                  <div>Cicilan Auto: Rp {cicilanAuto.toLocaleString('id-ID')} /bulan x {p.tenor_bulan||120} bulan</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-[#FFFBF0] border rounded-2xl p-4"><div className="text-[10px] opacity-60">LT</div><div className="font-black">{p.luas_tanah} m²</div></div>
              <div className="bg-[#FFFBF0] border rounded-2xl p-4"><div className="text-[10px] opacity-60">LB</div><div className="font-black">{p.luas_bangunan} m²</div></div>
              <div className="bg-[#FFFBF0] border rounded-2xl p-4"><div className="text-[10px] opacity-60">KT</div><div className="font-black">{p.kamar_tidur} Kamar</div></div>
              <div className="bg-[#FFFBF0] border rounded-2xl p-4"><div className="text-[10px] opacity-60">KM</div><div className="font-black">{p.kamar_mandi} Kamar</div></div>
            </div>

            {mapData.fasilitasBersih && (
              <div className="mt-5 p-5 bg-zinc-50 border rounded-2xl">
                <div className="text-[11px] font-black uppercase text-black/40">Fasilitas Lengkap</div>
                <div className="flex flex-wrap gap-2 mt-3">{mapData.list.map((f,i)=><span key={i} className="bg-white border px-3 py-1.5 rounded-full text-[12px] font-bold">{f}</span>)}</div>
              </div>
            )}

            <div className="mt-5 text-[14px] whitespace-pre-line leading-relaxed">{p.deskripsi}</div>

            <div className="mt-6 rounded-[16px] overflow-hidden border-2 border-[#D4AF37]/30">
              <div className="bg-black text-[#D4AF37] p-2.5 font-black text-[10px] flex justify-between"><span>LOKASI EXACT - FOTO MAP REAL</span><span className="bg-[#D4AF37] text-black px-2 rounded-full">PIN AA01</span></div>
              {mapData.mapImg? (
                <a href={realMapLink} target="_blank" className="block relative group">
                  <img src={mapData.mapImg} alt="Foto Map Real" className="w-full h-[260px] object-cover" />
                  <div className="absolute bottom-2 left-2 bg-white text-black px-3 py-1 rounded-full font-black text-[11px] shadow">📍 Klik buka map real</div>
                </a>
              ) : (
                <div className="h-[200px] flex items-center justify-center bg-zinc-100 text-[12px] font-bold">Belum ada foto map</div>
              )}
              <a href={realMapLink} target="_blank" className="block bg-white border-t-2 border-black text-center py-3.5 font-black text-[13px] text-black">📍 BUKA DI GOOGLE MAPS REAL</a>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <a href={realMapLink} target="_blank" className="bg-white border-2 border-black rounded-full py-3.5 text-center font-black text-[13px] text-black">📍 MAP</a>
              <button onClick={handleShare} className="bg-black text-[#D4AF37] rounded-full py-3.5 text-center font-black text-[13px] border border-[#D4AF37]">🔗 SHARE</button>
            </div>

            {!isTerjual? (
              <a href={`https://wa.me/${wa62}?text=${waMsg}`} target="_blank" className="mt-4 w-full bg-[#25D366] text-white text-center py-5 rounded-full font-black text-[16px] block">WHATSAPP SEKARANG</a>
            ) : (
              <Link href="/properties" className="mt-4 w-full bg-black text-white text-center py-5 rounded-full font-black text-[16px] block">LIHAT PROPERTI LAIN →</Link>
            )}
          </div>
        </div>
      </div>

      {zoom &&!isTerjual && (
        <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center p-4">
          <button onClick={()=>setZoom(false)} className="absolute top-6 right-6 bg-white text-black w-12 h-12 rounded-full font-black text-xl">✕</button>
          <div className="relative w-[92vw] h-[70vh]"><Image src={fotos[active]} alt="zoom" fill className="object-contain rounded-[20px] border-[3px] border-[#D4AF37]"/></div>
        </div>
      )}
    </main>
  )
    }
