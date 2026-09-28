'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MaterialsPage(){
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('semua')
  const [brand, setBrand] = useState('semua')
  const [search, setSearch] = useState('')
  const API = process.env.NEXT_PUBLIC_API_URL

  const [calc, setCalc] = useState({})

  useEffect(()=>{
    async function getData(){
      try{
        const res = await fetch(`${API}/materials`)
        const data = await res.json()
        const arr = Array.isArray(data)? data : data.data || []
        setMaterials(arr.filter(m=>m.is_active!==false))
      }catch{}
      finally{ setLoading(false) }
    }
    getData()
  },[])

  const getWA62=(num)=>{
    let raw=String(num||'08979879518').replace(/[^0-9]/g,'')
    if(raw.startsWith('0')) return '62'+raw.slice(1)
    if(raw.startsWith('8')) return '62'+raw
    return raw
  }

  const waLink=(m,qty,total)=>{
    const wa62=getWA62(m.wa_number)
    const harga=m.harga_promo && m.harga_promo < m.harga? m.harga_promo : m.harga
    return `https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%20saya%20mau%20pesan%20${encodeURIComponent(m.nama)}%0AJumlah:%20${qty}%20${m.satuan}%0ATotal:%20Rp%20${Number(total).toLocaleString('id-ID')}%0A${typeof window!=='undefined'?window.location.href:''}`
  }

  const handleShare=async(m)=>{
    const url = `${window.location.origin}/material/${m.slug||m.id}`
    const text = `${m.nama} - Rp ${Number(m.harga).toLocaleString('id-ID')}/${m.satuan} - ${m.brand}`
    if(navigator.share){
      try{ await navigator.share({title:m.nama, text, url}) }catch{}
    }else{
      await navigator.clipboard.writeText(url)
      alert('Link disalin: '+url)
    }
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

  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]"><p className="font-black animate-pulse text-black">LOADING MATERIAL...</p></div>

  return <main className="min-h-screen bg-[#FFFBF0]">
      {/* MENU BAR ATAS - BERANDA DISINI AJA */}
      <nav className="sticky top-0 z-50 bg-white border-b-[2px] border-[#D4AF37] px-4 md:px-10 py-4 flex justify-between items-center">
        <Link href="/" className="font-black text-[22px] tracking-tighter text-black">PASA<span className="text-[#D4AF37]"> GADANG</span></Link>
        <div className="flex gap-2">
          <Link href="/" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-[#FFFBF0] border border-[#D4AF37]/30 text-black">BERANDA</Link>
          <Link href="/properties" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-[#FFFBF0] border border-[#D4AF37]/30 text-black">PROPERTI</Link>
          <Link href="/material" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-black text-white">MATERIAL</Link>
        </div>
      </nav>

    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black">MATERIAL<span className="text-[#D4AF37]"> GADANG</span></h1>
          <p className="text-[13px] font-bold text-black/60 mt-2">{materials.length} SKU aktif • Harga live update</p>
        </div>
        <div className="bg-black text-white rounded-[16px] px-5 py-3">
          <p className="text-[10px] font-black opacity-60">TOTAL</p>
          <p className="text-xl font-black">{materials.length}</p>
        </div>
      </div>

      <div className="mt-6 relative">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari semen, besi, bata, brand..." className="w-full p-5 rounded-full font-bold text-[14px] outline-none border-[2px] border-[#D4AF37] bg-white text-black placeholder:text-black/40"/>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black">🔍</span>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-6 py-3 rounded-full text-xs font-black uppercase whitespace-nowrap border-[2px] ${cat===c?'bg-black text-white border-black':'bg-white text-black border-[#D4AF37]'}`}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={()=>setBrand('semua')} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-[2px] ${brand==='semua'?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-white text-black border-[#D4AF37]/40'}`}>SEMUA BRAND</button>
        {brands.map(b=>(
          <button key={b} onClick={()=>setBrand(b)} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-[2px] whitespace-nowrap ${brand===b?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-white text-black border-[#D4AF37]/40'}`}>{b.toUpperCase()}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map(m=>{
          const hasPromo = m.harga_promo && m.harga_promo < m.harga
          const qty = calc[m.id]||m.stok_minimum||10
          const hargaAktif = hasPromo? m.harga_promo : m.harga
          const total = hargaAktif * qty
          return(
          <div key={m.id} className="bg-white rounded-[28px] overflow-hidden border-[2px] border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.18)] flex flex-col">
            <div className="h-[260px] relative bg-white flex items-center justify-center p-6">
              <img src={m.foto_1} alt={m.nama} className="w-full h-full object-contain"/>
              {m.badge && <span className={`absolute top-4 left-4 text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest ${m.badge.toLowerCase()==='promo'?'bg-red-500 text-white':'bg-[#D4AF37] text-black'}`}>{m.badge.toUpperCase()}</span>}
              <div className="absolute bottom-4 left-4 bg-black text-white text-[11px] font-bold px-4 py-2 rounded-full">{m.kategori?.toUpperCase()} • {m.brand?.toUpperCase()}</div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-black text-[18px] text-black leading-tight">{m.nama}</h3>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl"><div className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Satuan</div><div className="text-[15px] font-black text-black mt-1">{m.satuan}</div></div>
                <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl"><div className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Ukuran</div><div className="text-[15px] font-black text-black mt-1">{m.ukuran||'-'}</div></div>
              </div>
              <div className="mt-3 p-3 rounded-2xl bg-black text-white"><div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Spesifikasi</div><div className="text-[13px] font-bold mt-1 line-clamp-2">{m.spesifikasi || m.deskripsi || 'Siap antar, paling tidak setelah kirim bukti booking minimal 20%'}</div></div>
              <div className="mt-5">
                {hasPromo && <p className="text-[12px] line-through font-bold text-black/40">Rp {formatRupiah(m.harga)}</p>}
                <p className="text-[26px] font-black text-[#B8960C] tracking-tight">Rp {formatRupiah(hargaAktif)}</p>
                <p className="text-[11px] font-black tracking-widest text-black/50">PER {m.satuan?.toUpperCase()}</p>
              </div>
              <div className="mt-4 bg-[#FFFBF0] border border-[#D4AF37]/30 rounded-full p-1.5 flex items-center justify-between">
                <button onClick={()=>setCalc(s=>({...s,[m.id]:Math.max(1,(s[m.id]||m.stok_minimum||10)-1)}))} className="w-10 h-10 bg-white border rounded-full font-black text-black">−</button>
                <span className="font-black text-[13px] text-black">{qty} {m.satuan} = Rp {formatRupiah(total)}</span>
                <button onClick={()=>setCalc(s=>({...s,[m.id]:(s[m.id]||m.stok_minimum||10)+1}))} className="w-10 h-10 bg-black text-white rounded-full font-black">+</button>
              </div>

              {/* WHATSAPP + BAGIKAN DI SAMPING */}
              <div className="grid grid-cols-[1.6fr_1fr] gap-3 mt-6">
                <a href={waLink(m,qty,total)} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[14px] shadow-[0_8px_20px_rgba(37,211,102,0.3)]">Whatsapp</a>
                <button onClick={()=>handleShare(m)} className="bg-white border-[2px] border-black text-black text-center py-4 rounded-full font-black text-[14px]">↗ Bagikan</button>
              </div>
            </div>
          </div>
        )})}
      </div>
      {filtered.length===0 && <p className="text-center py-20 font-black text-black/40">Material tidak ditemukan</p>}
    </div>
  </main>
    }
