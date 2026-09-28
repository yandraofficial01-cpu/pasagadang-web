'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MaterialsPage(){
  const [data,setData]=useState([])
  const [cat,setCat]=useState('semua')
  const [brand,setBrand]=useState('semua')
  const [search,setSearch]=useState('')
  const [calc,setCalc]=useState({})
  const API=process.env.NEXT_PUBLIC_API_URL

  useEffect(()=>{
    fetch(`${API}/materials`).then(r=>r.json()).then(j=>{
      const arr=j.data||j||[]
      setData(arr.filter(m=>m.is_active!==false))
    })
  },[])

  // FIX WA SAMA KAYAK PROPERTI - AUTO 08 -> 62
  const getWA62=(num)=>{
    let raw=String(num||'08979879518').replace(/[^0-9]/g,'')
    if(raw.startsWith('0')) return '62'+raw.slice(1)
    if(raw.startsWith('8')) return '62'+raw
    return raw
  }
  const waLink=(m,qty)=>{
    const wa62=getWA62(m.wa_number)
    const q=qty||m.stok_minimum||10
    const harga=m.harga_promo && m.harga_promo < m.harga? m.harga_promo : m.harga
    return `https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%20saya%20mau%20pesan%20${encodeURIComponent(m.nama)}%20${q}%20${m.satuan}%20Total%20Rp%20${Number(harga*q).toLocaleString('id-ID')}`
  }

  const categories=['semua','semen','besi','bata','pasir','kayu','keramik','cat']
  const brands=[...new Set(data.map(m=>m.brand).filter(Boolean))]
  const filtered=data.filter(m=>{
    const mc=cat==='semua'||m.kategori?.toLowerCase()===cat.toLowerCase()
    const mb=brand==='semua'||m.brand===brand
    const ms=!search||m.nama.toLowerCase().includes(search.toLowerCase())||m.brand?.toLowerCase().includes(search.toLowerCase())
    return mc&&mb&&ms
  })

  return (
    <main className="min-h-screen bg-[#FFFBF0]">
      {/* MENU KE HALAMAN UTAMA */}
      <nav className="sticky top-0 z-50 bg-white border-b-[2px] border-[#D4AF37] px-4 md:px-10 py-4 flex justify-between items-center">
        <Link href="/" className="font-black text-[22px] tracking-tighter text-black">PASA<span className="text-[#D4AF37]"> GADANG</span></Link>
        <div className="flex gap-2">
          <Link href="/" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-[#FFFBF0] border border-[#D4AF37]/30 text-black">BERANDA</Link>
          <Link href="/properties" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-[#FFFBF0] border border-[#D4AF37]/30 text-black">PROPERTI</Link>
          <Link href="/material" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-black text-white">MATERIAL</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black">MATERIAL<span className="text-[#D4AF37]"> GADANG</span></h1>
        <p className="text-[13px] font-bold text-black/60 mt-2">{data.length} SKU aktif • Harga live update</p>

        <div className="mt-6">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari semen, besi, bata, brand..." className="w-full p-5 rounded-full font-bold text-[14px] outline-none border-[2px] border-[#D4AF37] bg-white text-black placeholder:text-black/40"/>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`px-6 py-3 rounded-full text-xs font-black uppercase whitespace-nowrap border-[2px] tracking-widest ${cat===c?'bg-black text-white border-black':'bg-white text-black border-[#D4AF37]'}`}>{c}</button>
          ))}
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={()=>setBrand('semua')} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-[2px] ${brand==='semua'?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-white text-black border-[#D4AF37]/40'}`}>SEMUA BRAND</button>
          {brands.map(b=>(
            <button key={b} onClick={()=>setBrand(b)} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-[2px] whitespace-nowrap ${brand===b?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-white text-black border-[#D4AF37]/40'}`}>{b.toUpperCase()}</button>
          ))}
        </div>

        {/* GRID - TULISAN HITAM PEKAT SAMA KAYAK PROPERTI */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map(m=>{
            const hasPromo=m.harga_promo && m.harga_promo < m.harga
            const qty=calc[m.id]||m.stok_minimum||10
            const hargaAktif=hasPromo?m.harga_promo:m.harga
            return(
              <div key={m.id} className="bg-white rounded-[28px] overflow-hidden border-[2px] border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.18)] flex flex-col">
                <div className="h-[260px] relative bg-white flex items-center justify-center p-6">
                  <img src={m.foto_1} alt={m.nama} className="w-full h-full object-contain"/>
                  {m.badge && <div className={`absolute top-4 left-4 text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest ${m.badge.toLowerCase()==='promo'?'bg-red-500 text-white':'bg-[#D4AF37] text-black'}`}>{m.badge.toUpperCase()}</div>}
                  <div className="absolute top-4 right-4 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full">STOK MIN {m.stok_minimum}</div>
                  <div className="absolute bottom-4 left-4 bg-black text-white text-[12px] font-bold px-4 py-2 rounded-full">{m.kategori?.toUpperCase()} • {m.brand?.toUpperCase()}</div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-black text-[18px] text-black leading-tight">{m.nama}</h3>
                  <p className="text-[13px] font-medium text-black/70 mt-1">{m.alamat||`${m.ukuran||''} ${m.satuan}`.trim()}</p>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl">
                      <div className="text-[10px] font-bold tracking-widest text-black/50 uppercase">Satuan</div>
                      <div className="text-[15px] font-black text-black mt-1">{m.satuan}</div>
                    </div>
                    <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl">
                      <div className="text-[10px] font-bold tracking-widest text-black/50 uppercase">Ukuran</div>
                      <div className="text-[15px] font-black text-black mt-1">{m.ukuran||'-'}</div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-2xl bg-black text-white">
                    <div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Spesifikasi</div>
                    <div className="text-[13px] font-bold mt-1 line-clamp-2">{m.spesifikasi||m.deskripsi||'Siap antar, paling tidak setelah kirim bukti booking minimal 20%'}</div>
                  </div>

                  <div className="mt-5">
                    <div className="text-[11px] font-black tracking-widest text-black/50 uppercase">Harga</div>
                    {hasPromo && <div className="text-[12px] font-bold line-through text-black/40">Rp {Number(m.harga).toLocaleString('id-ID')}</div>}
                    <div className="text-[26px] font-black text-[#B8960C] tracking-tight">Rp {Number(hargaAktif).toLocaleString('id-ID')}</div>
                  </div>

                  <div className="mt-4 bg-[#FFFBF0] border border-[#D4AF37]/30 rounded-full p-1.5 flex items-center justify-between">
                    <button onClick={()=>setCalc(s=>({...s,[m.id]:Math.max(1,(s[m.id]||m.stok_minimum||10)-1)}))} className="w-10 h-10 bg-white border rounded-full font-black text-black">−</button>
                    <span className="font-black text-[13px] text-black">{qty} {m.satuan} = Rp {Number(hargaAktif*qty).toLocaleString('id-ID')}</span>
                    <button onClick={()=>setCalc(s=>({...s,[m.id]:(s[m.id]||m.stok_minimum||10)+1}))} className="w-10 h-10 bg-black text-white rounded-full font-black">+</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <a href={waLink(m,qty)} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[14px] shadow-lg">Whatsapp</a>
                    <Link href="/" className="bg-black text-white text-center py-4 rounded-full font-black text-[14px]">BERANDA →</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
  }
