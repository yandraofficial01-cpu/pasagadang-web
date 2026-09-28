'use client'
import { useEffect, useState } from 'react'

export default function MaterialsPage(){
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('semua')
  const [brand, setBrand] = useState('semua')
  const [search, setSearch] = useState('')
  const [dark, setDark] = useState(false)
  const [calc, setCalc] = useState({id:null, qty:1})

  useEffect(()=>{
    async function getData(){
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`)
        const data = await res.json()
        const arr = Array.isArray(data)? data : data.data || []
        setMaterials(arr.filter(m=>m.is_active!==false))
      }catch{}
      finally{ setLoading(false) }
    }
    getData()
  },[])

  // === FIX WA 08 -> 62 SAMA KAYAK PROPERTI ===
  const getWA62=(num)=>{
    let raw=String(num||'08979879518').replace(/[^0-9]/g,'')
    if(raw.startsWith('0')) return '62'+raw.slice(1)
    if(raw.startsWith('8')) return '62'+raw
    return raw
  }

  const categories = ['semua','semen','besi','bata','pasir','kayu','keramik','cat']
  const brands = [...new Set(materials.map(m=>m.brand).filter(Boolean))]

  let filtered = materials.filter(m=>{
    const matchCat = cat==='semua' || m.kategori?.toLowerCase()===cat.toLowerCase()
    const matchBrand = brand==='semua' || m.brand===brand
    const matchSearch = search==='' || m.nama.toLowerCase().includes(search.toLowerCase()) || m.brand?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchBrand && matchSearch
  })

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n||0)
  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]"><p className="font-black animate-pulse">LOADING...</p></div>

  return <main className={`min-h-screen transition-colors duration-300 ${dark?'bg-[#0A0A0A] text-white':'bg-[#FAF7F2] text-black'} p-4 md:p-10`}>
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className={`text-[11px] font-black tracking-[0.3em] ${dark?'text-[#D4AF37]':'text-[#C5A059]'}`}>TOKO MATERIAL PASA GADANG</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">MATERIAL<span className="text-[#C5A059]">.</span></h1>
          <p className={`text-sm mt-3 max-w-md font-bold ${dark?'text-zinc-400':'text-zinc-600'}`}>Harga live update. Klik WA hijau untuk pesan langsung.</p>
        </div>
        <div className="flex gap-2 h-fit">
          <div className={`rounded-[20px] p-5 ${dark?'bg-zinc-900 border border-zinc-800':'bg-black text-white'}`}>
            <p className="text-[10px] font-black opacity-60">TOTAL PRODUK AKTIF</p><p className="text-3xl font-black">{materials.length} SKU</p>
          </div>
          <button onClick={()=>setDark(!dark)} className={`w-14 h-[68px] rounded-[20px] font-black text-xl border ${dark?'bg-white text-black':'bg-black text-white'}`}>{dark?'☀️':'🌙'}</button>
        </div>
      </div>

      <div className="mt-8 relative">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari semen, besi, bata, brand..." className={`w-full p-5 rounded-full font-bold text-sm outline-none border-2 focus:border-[#C5A059] ${dark?'bg-zinc-900 border-zinc-800 placeholder:text-zinc-600':'bg-white border-black/10 placeholder:text-zinc-400'}`}/>
        <span className="absolute right-6 top-1/2 -translate-y-1/2">🔍</span>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-6 py-3 rounded-full text-xs font-black uppercase whitespace-nowrap border-2 transition ${cat===c?'bg-black text-white border-black': dark?'bg-zinc-900 border-zinc-800 text-zinc-400':'bg-white border-black/10'}`}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={()=>setBrand('semua')} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-2 transition ${brand==='semua'?'bg-[#C5A059] text-black border-[#C5A059]':'bg-transparent'}`}>SEMUA BRAND</button>
        {brands.map(b=>(
          <button key={b} onClick={()=>setBrand(b)} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-2 whitespace-nowrap transition ${brand===b?'bg-[#C5A059] text-black border-[#C5A059]':''}`}>{b.toUpperCase()}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
        {filtered.map(m=>{
          const hasPromo = m.harga_promo && m.harga_promo < m.harga
          const qty = calc.id===m.id? calc.qty : (m.stok_minimum||1)
          const total = (hasPromo?m.harga_promo:m.harga) * qty
          const wa62 = getWA62(m.wa_number)
          return(
          <div key={m.id} className={`group rounded-[24px] p-3 border-2 transition-all duration-300 ${dark?'bg-zinc-900 border-zinc-800 hover:border-zinc-700':'bg-white border-black/5 hover:shadow-xl'}`}>
            <div className={`aspect-[1/1] rounded-[16px] overflow-hidden relative border flex items-center justify-center p-4 ${dark?'bg-white border-white/10':'bg-white border-black/5'}`}>
              <img src={m.foto_1} alt={m.nama} className="w-full h-full object-contain group-hover:scale-105 transition duration-700"/>
              {m.badge && <span className={`absolute top-3 left-3 text-[10px] font-black px-3 py-1 rounded-full ${m.badge.toLowerCase()==='promo'?'bg-red-500 text-white':'bg-black text-white'}`}>{m.badge.toUpperCase()}</span>}
            </div>
            <div className="p-3">
              <h3 className={`font-black text-[15px] leading-tight line-clamp-2 min-h-[40px] ${dark?'text-white':'text-black'}`}>{m.nama}</h3>
              <p className={`text-[12px] mt-1 font-black ${dark?'text-zinc-400':'text-zinc-700'}`}>{m.ukuran?m.ukuran+' • ':''}Stok min: {m.stok_minimum} {m.satuan} • {m.brand}</p>
              <p className={`text-[12px] mt-2 line-clamp-2 min-h-[36px] font-bold ${dark?'text-zinc-500':'text-zinc-600'}`}>{m.spesifikasi || m.deskripsi}</p>
              <div className="mt-4">
                {hasPromo? <><p className="text-[12px] line-through font-bold text-zinc-400">Rp {formatRupiah(m.harga)}</p><p className="text-xl font-black text-red-500">Rp {formatRupiah(m.harga_promo)}</p></>: <p className={`text-xl font-black ${dark?'text-white':'text-black'}`}>Rp {formatRupiah(m.harga)}</p>}
              </div>
              <div className={`mt-4 rounded-full p-1 flex items-center justify-between border ${dark?'bg-black border-zinc-800':'bg-[#F3F0EB] border-black/5'}`}>
                <button onClick={()=>setCalc({id:m.id, qty:Math.max(1,qty-1)})} className="w-8 h-8 bg-white text-black rounded-full font-black border">-</button>
                <span className="text-[12px] font-black">{qty} {m.satuan} = Rp {formatRupiah(total)}</span>
                <button onClick={()=>setCalc({id:m.id, qty:qty+1})} className="w-8 h-8 bg-black text-white rounded-full font-black">+</button>
              </div>
              <a href={`https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%2C%20saya%20mau%20pesan%0A*${encodeURIComponent(m.nama)}*%0AJumlah:%20${qty}%20${m.satuan}%0ATotal:%20Rp%20${formatRupiah(total)}`} target="_blank"
                 className="mt-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-black py-3 rounded-full font-black text-xs flex items-center justify-center gap-2 transition">
                 💬 WHATSAPP PESAN SEKARANG
              </a>
            </div>
          </div>
        )})}
      </div>
    </div>
  </main>
  }
