'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function EstetikaDetail(){
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [zoomList, setZoomList] = useState([])
  const [zoomIdx, setZoomIdx] = useState(0)
  const API = process.env.NEXT_PUBLIC_API_URL
  const COLORS = { gold: '#D4AF37', red: '#B22222' }

  useEffect(()=>{
    if(!API ||!slug) return
    fetch(`${API}/estetikas/${slug}`).then(r=>r.json()).then(j=>setItem(j.data||j)).catch(()=>{})
  },[API, slug])

  const openZoom = (imgs, idx=0)=>{
    setZoomList(imgs.filter(Boolean))
    setZoomIdx(idx)
  }
  const closeZoom = ()=> setZoomList([])

  if(!item) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]">Loading {slug}...</div>

  const imgs = [item.foto_bahan_1, item.foto_bahan_2, item.foto_jadi_1, item.foto_jadi_2, item.foto_jadi_3].filter(Boolean)
  const waLink = `https://wa.me/628979879518?text=${encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${item.nama} - ${item.ukuran} Rp ${Number(item.harga).toLocaleString('id-ID')}\nhttps://pasagadang-web.vercel.app/estetika/${item.slug}`)}`

  return (
    <main className="min-h-screen bg-[#FFFBF0] text-black">
      {/* NAVBAR V2 - PA Merah SAGA Emas */}
      <nav className="sticky top-0 z-50 bg-[#FFFBF0]/90 backdrop-blur-xl border-b border-black/5 px-6 py-3 flex justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <div className="flex font-black text-[22px]">
            <span style={{color:COLORS.red}}>PA</span>
            <span className="bg-gradient-to-b from-[#FFEB7F] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">SAGA</span>
            <span style={{color:COLORS.red}}>DANG</span>
            <span className="text-[10px] ml-1 mt-1" style={{color:COLORS.red}}>.COM</span>
          </div>
          <div className="w-[155px] h-[6px] bg-gradient-to-r from-[#8B6914] via-[#FFD700] to-[#8B6914] rounded-full mt-1"></div>
        </Link>
        <Link href="/estetika" className="text-[12px] font-black border px-4 py-2 rounded-full">BACK</Link>
      </nav>

      <div className="max-w-[500px] mx-auto p-6">
        {/* FOTO GRID - BAHAN vs TERPASANG */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative h-[220px] bg-[#FAF7F0] rounded-[18px] overflow-hidden cursor-zoom-in" onClick={()=>openZoom(imgs,0)}>
            <img src={item.foto_bahan_1} className="w-full h-full object-cover"/>
            <span className="absolute bottom-2 left-2 bg-black text-white text-[9px] px-2 py-1 rounded-full font-black">BAHAN</span>
          </div>
          <div className="relative h-[220px] bg-black rounded-[18px] overflow-hidden cursor-zoom-in" onClick={()=>openZoom(imgs,2)}>
            <img src={item.foto_jadi_1||item.foto_bahan_1} className="w-full h-full object-cover"/>
            <span className="absolute bottom-2 left-2 bg-[#D4AF37] text-black text-[9px] px-2 py-1 rounded-full font-black">TERPASANG</span>
          </div>
        </div>

        <h1 className="font-black text-[20px] mt-5">{item.nama}</h1>
        <p className="text-[12px] opacity-60 uppercase mt-1">{item.kategori} • {item.ukuran}</p>
        <p className="font-black text-[22px] mt-3" style={{color:COLORS.gold}}>Rp {Number(item.harga).toLocaleString('id-ID')} / {item.satuan}</p>
        <p className="text-[13px] mt-4 opacity-80 leading-relaxed">{item.deskripsi||'Roster premium kualitas export...'}</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <a href={waLink} target="_blank" className="bg-[#25D366] text-white font-black py-4 rounded-full text-center text-[13px]">💬 WA ADMIN</a>
          <button onClick={()=>{ if(navigator.share) navigator.share({title:item.nama, url:window.location.href}); else { navigator.clipboard.writeText(window.location.href); alert('Link disalin!')}}} className="bg-black text-white font-black py-4 rounded-full text-[13px]">↗ BAGIKAN</button>
        </div>
      </div>

      {/* ZOOM MODAL */}
      {zoomList.length>0 && (
        <div onClick={closeZoom} className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <img src={zoomList[zoomIdx]} className="max-w-full max-h-[80vh] rounded-2xl border-2 border-[#D4AF37]"/>
          <button onClick={closeZoom} className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full font-black">X</button>
        </div>
      )}
    </main>
  )
}
