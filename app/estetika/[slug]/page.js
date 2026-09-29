'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function EstetikaDetail(){
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [qty, setQty] = useState(10)
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
  const COLORS = { gold: '#D4AF37', red: '#B22222' }
  const [zoom, setZoom] = useState(null)

  useEffect(()=>{
    if(!slug) return
    const load = async ()=>{
      try{
        const res = await fetch(`${API}/estetikas`)
        const j = await res.json()
        const list = Array.isArray(j)? j : j.data||[]
        const found = list.find(x => String(x.slug)===String(slug) || String(x.id)===String(slug))
        if(found) setItem(found)
      }catch(e){ console.log(e) }
    }
    load()
  },[slug, API])

  if(!item) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0] font-black animate-pulse">LOADING {slug}...</div>

  const hasPromo = item.harga_promo && Number(item.harga_promo) < Number(item.harga)
  const hargaAktif = hasPromo? item.harga_promo : item.harga
  const total = Number(hargaAktif||0) * qty
  const formatRupiah = (n)=> new Intl.NumberFormat('id-ID').format(n||0)

  const wa62 = (()=>{ let r=String(item.wa_number||'08979879518').replace(/[^0-9]/g,''); return r.startsWith('0')? '62'+r.slice(1):r })()
  const waLink = `https://wa.me/${wa62}?text=${encodeURIComponent(`Halo Pasa Gadang saya mau pesan ${item.nama}\nJumlah: ${qty} ${item.satuan}\nTotal: Rp ${formatRupiah(total)}\nLink: ${typeof window!=='undefined'? window.location.href:''}`)}`

  const photos = [item.foto_bahan_1, item.foto_bahan_2, item.foto_jadi_1, item.foto_jadi_2, item.foto_jadi_3].filter(Boolean)

  return (
    <main className="min-h-screen bg-[#FFFBF0]">
      {/* NAVBAR V2 FINAL */}
      <nav className="sticky top-0 z-50 bg-white border-b-[2px] border-[#D4AF37] px-4 md:px-10 py-3 flex justify-between items-center">
        <Link href="/" className="flex flex-col leading-none">
          <div className="flex font-black text-[22px] tracking-tighter">
            <span style={{color:COLORS.red}}>PA</span>
            <span className="bg-gradient-to-b from-[#FFEB7F] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">SAGA</span>
            <span style={{color:COLORS.red}}>DANG</span>
            <span className="text-[10px] ml-1 mt-1" style={{color:COLORS.red}}>.COM</span>
          </div>
          <div className="w-[150px] h-[5px] bg-gradient-to-r from-[#8B6914] via-[#FFD700] to-[#8B6914] rounded-full mt-1"></div>
        </Link>
        <Link href="/estetika" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-black text-white">BACK</Link>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-10 grid md:grid-cols-2 gap-8">
        {/* KIRI - FOTO */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-[300px] bg-[#FAF7F0] rounded-[22px] overflow-hidden border-[2px] border-[#D4AF37] relative cursor-zoom-in" onClick={()=>setZoom(item.foto_bahan_1)}>
              {item.foto_bahan_1? <img src={item.foto_bahan_1} className="w-full h-full object-contain p-3"/> : <div className="h-full flex items-center justify-center text-[11px]">No foto bahan</div>}
              <span className="absolute bottom-3 left-3 bg-black text-white text-[9px] font-black px-3 py-1 rounded-full">BAHAN</span>
            </div>
            <div className="h-[300px] bg-black rounded-[22px] overflow-hidden border-[2px] border-black relative cursor-zoom-in" onClick={()=>setZoom(item.foto_jadi_1)}>
              {item.foto_jadi_1? <img src={item.foto_jadi_1} className="w-full h-full object-cover"/> : <div className="h-full flex items-center justify-center text-white text-[11px]">No foto jadi</div>}
              <span className="absolute bottom-3 left-3 bg-[#D4AF37] text-black text-[9px] font-black px-3 py-1 rounded-full">TERPASANG</span>
            </div>
          </div>
          {photos.length>2 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {photos.map((p,i)=><img key={i} src={p} onClick={()=>setZoom(p)} className="w-[70px] h-[70px] rounded-xl object-cover border-2 border-[#D4AF37] cursor-pointer"/>)}
            </div>
          )}
        </div>

        {/* KANAN - DETAIL */}
        <div>
          <h1 className="text-3xl font-black tracking-tighter leading-tight">{item.nama}</h1>
          <p className="text-[12px] font-bold opacity-60 mt-2 uppercase">{item.kategori} • {item.ukuran} • {item.satuan}</p>

          <div className="mt-6">
            {hasPromo && <p className="line-through text-[13px] font-bold opacity-40">Rp {formatRupiah(item.harga)}</p>}
            <p className="text-[32px] font-black text-[#B8960C] tracking-tighter">Rp {formatRupiah(hargaAktif)}</p>
            <p className="text-[11px] font-black tracking-widest opacity-50">PER {item.satuan?.toUpperCase()}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white border-[2px] border-[#D4AF37] p-4 rounded-2xl"><div className="text-[10px] font-bold opacity-50">KATEGORI</div><div className="font-black text-[14px] mt-1">{item.kategori}</div></div>
            <div className="bg-white border-[2px] border-[#D4AF37] p-4 rounded-2xl"><div className="text-[10px] font-bold opacity-50">UKURAN</div><div className="font-black text-[14px] mt-1">{item.ukuran||'-'}</div></div>
          </div>

          <div className="mt-4 bg-black text-white p-4 rounded-2xl">
            <div className="text-[10px] font-bold tracking-widest opacity-60">SPESIFIKASI</div>
            <div className="text-[13px] font-bold mt-2 leading-relaxed whitespace-pre-line">{item.spesifikasi||item.deskripsi||'Cocok untuk pagar, partisi cafe, fasad minimalis.'}</div>
          </div>

          <div className="mt-6 bg-white border-[2px] border-[#D4AF37] rounded-full p-1.5 flex items-center justify-between">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-11 h-11 bg-[#FFFBF0] border rounded-full font-black">−</button>
            <span className="font-black text-[14px]">{qty} {item.satuan} = Rp {formatRupiah(total)}</span>
            <button onClick={()=>setQty(q=>q+1)} className="w-11 h-11 bg-black text-white rounded-full font-black">+</button>
          </div>

          <div className="grid grid-cols-[1.6fr_1fr] gap-3 mt-6">
            <a href={waLink} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[15px]">Whatsapp Pesan</a>
            <button onClick={async()=>{ const url=window.location.href; if(navigator.share){ await navigator.share({title:item.nama, url}) } else { await navigator.clipboard.writeText(url); alert('Link disalin!')}}} className="bg-white border-[2px] border-black text-black py-4 rounded-full font-black text-[14px]">↗ Bagikan</button>
          </div>
        </div>
      </div>

      {zoom && <div onClick={()=>setZoom(null)} className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-6"><img src={zoom} className="max-w-full max-h-[85vh] rounded-2xl border-2 border-[#D4AF37]"/><button className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full font-black">X</button></div>}
    </main>
  )
    }
