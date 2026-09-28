'use client'
import { useEffect, useState } from 'react'

export default function MaterialsPage(){
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('semua')
  const [brand, setBrand] = useState('semua')

  useEffect(()=>{
    async function getData(){
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`)
        const data = await res.json()
        const arr = Array.isArray(data)? data : data.data || []
        // SESUAI MODEL: hanya yang is_active
        setMaterials(arr.filter(m=>m.is_active!==false))
      }catch(e){ console.log(e) }
      finally{ setLoading(false) }
    }
    getData()
  },[])

  const categories = ['semua','semen','besi','bata','pasir','kayu','keramik','cat']
  const brands = [...new Set(materials.map(m=>m.brand).filter(Boolean))]

  let filtered = materials
  if(cat!=='semua') filtered = filtered.filter(m=>m.kategori?.toLowerCase()===cat.toLowerCase())
  if(brand!=='semua') filtered = filtered.filter(m=>m.brand===brand)

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n||0)

  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]"><p className="font-black animate-pulse">LOADING MATERIAL...</p></div>

  return <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-10">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <p className="text-[11px] font-black tracking-[0.3em] text-[#C5A059]">TOKO MATERIAL PASA GADANG</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">MATERIAL<span className="text-[#C5A059]">.</span></h1>
          <p className="text-sm text-gray-500 mt-3 max-w-md">Semua satuan ready: sak, batang, buah, m³, truk, lembar, kg, liter. Harga update live. Sesuai model: foto_1, foto_2, foto_3, spesifikasi, ukuran, stok_minimum.</p>
        </div>
        <div className="mt-6 md:mt-0 bg-black text-white rounded-[20px] p-5 h-fit">
          <p className="text-[10px] font-black text-white/50">TOTAL PRODUK AKTIF</p><p className="text-3xl font-black">{materials.length} SKU</p>
        </div>
      </div>

      <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-6 py-3 rounded-full text-xs font-black uppercase whitespace-nowrap border transition ${cat===c?'bg-black text-white border-black':'bg-white hover:border-black'}`}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={()=>setBrand('semua')} className={`px-5 py-2 rounded-full text-[11px] font-black border transition ${brand==='semua'?'bg-[#C5A059] text-black border-[#C5A059]':'bg-white'}`}>SEMUA BRAND</button>
        {brands.map(b=>(
          <button key={b} onClick={()=>setBrand(b)} className={`px-5 py-2 rounded-full text-[11px] font-black border whitespace-nowrap transition ${brand===b?'bg-[#C5A059] text-black border-[#C5A059]':'bg-white'}`}>{b.toUpperCase()}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
        {filtered.map(m=>{
          const hasPromo = (m.badge?.toLowerCase()==='promo' || m.harga_promo) && m.harga_promo
          return(
          <div key={m.id} className="group bg-white rounded-[24px] p-3 border border-black/5 hover:shadow-xl hover:border-black/10 transition-all duration-300">
            {/* === FIX TINGGI FOTO DISINI BRO === */}
            <div className="aspect-[1/1] bg-white rounded-[16px] overflow-hidden relative border border-black/5 flex items-center justify-center p-4">
              <img src={m.foto_1 || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500'} alt={m.nama} className="w-full h-full object-contain group-hover:scale-105 transition duration-700"/>
              {m.badge && <span className={`absolute top-3 left-3 text-[10px] font-black px-3 py-1 rounded-full shadow-sm ${m.badge.toLowerCase()==='promo'?'bg-red-500 text-white': m.badge.toLowerCase()==='best seller'||m.badge.toLowerCase()==='best'?'bg-[#C5A059] text-black':'bg-black text-white'}`}>{m.badge.toUpperCase()}</span>}
              <span className="absolute bottom-3 left-3 bg-black text-white px-3 py-1 rounded-full text-[10px] font-black">{m.brand || m.kategori?.toUpperCase()}</span>
            </div>
            <div className="p-3">
              <h3 className="font-black text-[14px] leading-tight line-clamp-2 min-h-[36px]">{m.nama}</h3>
              <p className="text-[11px] text-gray-500 mt-1 font-bold">{m.ukuran?m.ukuran+' • ':''}Stok min: {m.stok_minimum} {m.satuan}</p>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 min-h-[32px]">{m.spesifikasi || m.deskripsi || 'Siap antar, paling tidak setelah kirim bukti booking minimal 20%'}</p>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  {hasPromo? <>
                    <p className="text-[11px] line-through text-gray-400">Rp {formatRupiah(m.harga)}</p>
                    <p className="text-lg font-black text-red-500">Rp {formatRupiah(m.harga_promo)}<span className="text-[10px] font-normal text-gray-500">/{m.satuan}</span></p>
                  </>: <p className="text-lg font-black">Rp {formatRupiah(m.harga)}<span className="text-[10px] font-normal text-gray-500">/{m.satuan}</span></p>}
                </div>
                <a href={`https://wa.me/${m.wa_number?.replace(/[^0-9]/g,'')||'6281234567890'}?text=Halo%20min,%20mau%20pesan%20${encodeURIComponent(m.nama)}%20${m.harga?'Rp'+m.harga:''}`} target="_blank" className="bg-black text-white w-9 h-9 flex items-center justify-center rounded-full font-black group-hover:bg-[#C5A059] group-hover:text-black transition">→</a>
              </div>
              {hasPromo && m.promo_sampai && <p className="text-[9px] font-black text-red-500 mt-2 bg-red-50 px-2 py-1 rounded-full w-fit">PROMO SAMPAI {new Date(m.promo_sampai).toLocaleDateString('id-ID')}</p>}
            </div>
          </div>
        )})}
      </div>
      {filtered.length===0 && <p className="text-center py-20 font-black text-gray-400">Material tidak ditemukan di kategori {cat}</p>}
    </div>
  </main>
}
