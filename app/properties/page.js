'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PropertiesPage(){
  const [data,setData]=useState([])
  const [zoomFotos,setZoomFotos]=useState([])
  const [zoomIdx,setZoomIdx]=useState(0)
  const [theme,setTheme]=useState('light')
  const API=process.env.NEXT_PUBLIC_API_URL
  const COLORS = { gold: '#D4AF37', red: '#B22222', cream: '#FFFBF0', dark: '#0B0B0F' }
  const isDark = theme==='dark'

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    fetch(`${API}/properties?is_published=true`)
   .then(r=>r.json()).then(j=>setData(j.data||j||[]))
  },[API])

  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }

  const getFotos=(p)=>[p.thumbnail,p.foto_1,p.foto_2,p.foto_3,p.foto_4,p.foto_5,p.foto_6,p.foto_7,p.foto_8].filter(Boolean)

  const waLink=(p)=>{
    const raw=String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
    const wa62=raw.startsWith('0')?'62'+raw.slice(1):raw
    const text = encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${p.judul} di ${p.kecamatan} - LT ${p.luas_tanah}m² LB ${p.luas_bangunan}m² Rp ${Number(p.harga_cash||0).toLocaleString('id-ID')}\nLink: https://pasagadang-web.vercel.app/properties/${p.slug}`)
    return `https://wa.me/${wa62}?text=${text}`
  }

  return (
    <main className={`${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'} min-h-screen transition-colors pb-24`}>
      {/* NAVBAR - SAMA PERSIS HOMEPAGE */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/" className="flex flex-col leading-none">
          <div className="flex font-black text-[24px] tracking-tight">
            <span style={{color:COLORS.red}}>PA</span>
            <span className="bg-gradient-to-b from-[#FFEB7F] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">SAGA</span>
            <span style={{color:COLORS.red}}>DANG</span>
            <span className="text-[10px] ml-1 mt-1 tracking-widest" style={{color:COLORS.red}}>.COM</span>
          </div>
          <div className="relative w-[165px] h-[8px] mt-[2px]">
            <svg viewBox="0 0 165 10" className="w-full h-full">
              <path d="M0 6 Q22 0 44 4 T88 4 T132 3 T165 1 Q132 7 88 7 T44 7 T0 6" fill="#D4AF37" opacity="0.9"/>
              <path d="M18 9 Q40 6 62 7.5 T106 7.5 T148 6 Q106 10 62 10.5 T18 9" fill="#D4AF37" opacity="0.8"/>
            </svg>
          </div>
        </Link>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>{isDark?'☀️':'🌙'}</button>
          <Link href="/" className={`w-10 h-10 rounded-full border flex items-center justify-center font-black ${isDark?'bg-white text-black':'bg-black text-white'}`}>⌂</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-black tracking-tighter mt-2">PROPERTI<span style={{color:COLORS.gold}}> GADANG</span></h1>
        <p className={`${isDark?'text-white/50':'text-black/50'} text-[13px] mt-1`}>{data.length} unit ready di Padang</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {data.map(p=>{
            const fotos=getFotos(p)
            return (
              <div key={p.id} className={`rounded-[28px] overflow-hidden border-[2px] flex flex-col transition hover:scale-[1.02] ${isDark?'bg-[#121214] border-[#D4AF37] shadow-[0_0_0_1px_rgba(212,175,55,0.3),0_10px_40px_rgba(212,175,55,0.18)]':'bg-white border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.18)]'}`}>
                <div className="h-[260px] relative cursor-pointer" onClick={()=>{setZoomFotos(fotos); setZoomIdx(0)}}>
                  <img src={fotos[0]} className="w-full h-full object-cover"/>
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest">{p.tipe_transaksi?.toUpperCase()||'JUAL'}</div>
                  <div className="absolute top-4 right-4 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{fotos.length} FOTO • ZOOM</div>
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-white text-[12px] font-bold px-4 py-2 rounded-full border border-white/10">{p.kecamatan} • {p.sertifikat} • {p.tipe_properti}</div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className={`font-black text-[18px] leading-tight ${isDark?'text-white':'text-black'}`}>{p.judul}</h3>
                  <p className={`text-[13px] font-medium mt-1 ${isDark?'text-white/60':'text-black/70'}`}>{p.alamat}</p>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Luas Tanah</div><div className="text-[15px] font-black mt-1">{p.luas_tanah} m²</div></div>
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Luas Bangunan</div><div className="text-[15px] font-black mt-1">{p.luas_bangunan} m²</div></div>
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Kamar Tidur</div><div className="text-[15px] font-black mt-1">{p.kamar_tidur} Kamar</div></div>
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Kamar Mandi</div><div className="text-[15px] font-black mt-1">{p.kamar_mandi} Kamar</div></div>
                  </div>

                  <div className="mt-3 p-3 rounded-2xl bg-black text-white">
                    <div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Fasilitas</div>
                    <div className="text-[13px] font-bold mt-1 line-clamp-2">{p.fasilitas||'- Free carport, free taman'}</div>
                  </div>

                  <div className="mt-5">
                    <div className="text-[11px] font-black tracking-widest opacity-50 uppercase">Harga Cash</div>
                    <div className="text-[26px] font-black tracking-tight" style={{color:COLORS.gold}}>Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[14px] shadow-lg hover:scale-105 transition">Whatsapp</a>
                    <Link href={`/properties/${p.slug}`} className={`${isDark?'bg-white text-black':'bg-black text-white'} text-center py-4 rounded-full font-black text-[14px] hover:scale-105 transition`}>DETAIL →</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* WA MELAYANG 08979879518 */}
      <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang%20saya%20mau%20tanya%20properti" target="_blank" className="fixed bottom-6 right-6 z-[99] w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] border-[3px] border-white hover:scale-110 transition">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19.05 4.91A9.93 9.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.14 1.6 5.94L0 24l6.35-1.66A11.9 11.9 0 0 0 12 23.88h.01c6.53 0 11.86-5.33 11.86-11.88 0-3.17-1.24-6.16-3.49-8.4Zm-7.05 14.4a9.3 9.3 0 0 1-4.75-1.3l-.34-.2-3.77.99 1-3.67-.22-.37A9.36 9.36 0 0 1 2.6 12c0-5.14 4.2-9.32 9.38-9.32 2.5 0 4.85.97 6.62 2.74A9.3 9.3 0 0 1 21.33 12c0 5.14-4.2 9.3-9.33 9.3Zm5.29-6.97c-.29-.15-1.7-.84-1.96-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.13-.17.2-.35.22-.64.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.35.44-.52.14-.17.19-.29.29-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.18-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.07-.8.37-.27.29-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34Z"/></svg>
      </a>

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
