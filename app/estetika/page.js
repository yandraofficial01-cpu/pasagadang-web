'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EstetikaPage(){
  const [estetikas, setEstetikas] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('semua')
  const [search, setSearch] = useState('')
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
  const [calc, setCalc] = useState({})

  useEffect(()=>{
    async function getData(){
      try{
        const res = await fetch(`${API}/estetikas`)
        const data = await res.json()
        const arr = Array.isArray(data)? data : data.data || []
        setEstetikas(arr.filter(m=>m.is_active!==false))
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
    const url = typeof window!=='undefined'? `${window.location.origin}/estetika/${m.slug||m.id}` : ''
    return `https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%20saya%20mau%20pesan%20${encodeURIComponent(m.nama)}%0AJumlah:%20${qty}%20${m.satuan}%0ATotal:%20Rp%20${Number(total).toLocaleString('id-ID')}%0ALink:%20${encodeURIComponent(url)}`
  }

  const handleShare=async(m)=>{
    const url = `${window.location.origin}/estetika/${m.slug||m.id}`
    const text = `${m.nama} - Rp ${Number(m.harga).toLocaleString('id-ID')}/${m.satuan} - ${m.kategori}`
    if(navigator.share){
      try{ await navigator.share({title:m.nama, text, url}) }catch{}
    }else{
      await navigator.clipboard.writeText(`${text} ${url}`)
      alert('Link disalin: '+url)
    }
  }

  const categories = ['semua','roster','batu alam','granit','keramik','bata ekspos','ornamen']
  let filtered = estetikas.filter(m=>{
    const matchCat = cat==='semua' || m.kategori?.toLowerCase()===cat.toLowerCase()
    const matchSearch = search==='' || m.nama.toLowerCase().includes(search.toLowerCase()) || m.kategori?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n||0)
  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]"><p className="font-black animate-pulse text-black">LOADING ESTETIKA...</p></div>

  return <main className="min-h-screen bg-[#FFFBF0]">
      <nav className="sticky top-0 z-50 bg-white border-b-[2px] border-[#D4AF37] px-4 md:px-10 py-4 flex justify-between items-center">
        <Link href="/" className="font-black text-[22px] tracking-tighter text-black">PASA<span className="text-[#D4AF37]"> GADANG</span></Link>
        <div className="flex gap-2">
          <Link href="/" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-[#FFFBF0] border border-[#D4AF37]/30 text-black">BERANDA</Link>
          <Link href="/properties" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-[#FFFBF0] border border-[#D4AF37]/30 text-black">PROPERTI</Link>
          <Link href="/materials" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-[#FFFBF0] border border-[#D4AF37]/30 text-black">MATERIAL</Link>
          <Link href="/estetika" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-black text-white">ESTETIKA</Link>
        </div>
      </nav>

    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black">ESTETIKA<span className="text-[#D4AF37]"> GADANG</span></h1>
          <p className="text-[13px] font-bold text-black/60 mt-2">{estetikas.length} desain • Roster, Batu Alam, Granit Ready</p>
        </div>
        <div className="bg-black text-white rounded-[16px] px-5 py-3">
          <p className="text-[10px] font-black opacity-60">TOTAL</p>
          <p className="text-xl font-black">{estetikas.length}</p>
        </div>
      </div>

      <div className="mt-6 relative">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari roster bubble, batu alam, granit..." className="w-full p-5 rounded-full font-bold text-[14px] outline-none border-[2px] border-[#D4AF37] bg-white text-black placeholder:text-black/40"/>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black">🔍</span>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-6 py-3 rounded-full text-xs font-black uppercase whitespace-nowrap border-[2px] ${cat===c?'bg-black text-white border-black':'bg-white text-black border-[#D4AF37]'}`}>{c}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map(m=>{
          const hasPromo = m.harga_promo && m.harga_promo < m.harga
          const qty = calc[m.id]||10
          const hargaAktif = hasPromo? m.harga_promo : m.harga
          const total = hargaAktif * qty
          return(
          <div key={m.id} className="bg-white rounded-[28px] overflow-hidden border-[2px] border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.18)] flex flex-col">
            {/* BEDA UTAMA: SPLIT BAHAN vs JADI */}
            <Link href={`/estetika/${m.slug||m.id}`} className="h-[260px] relative grid grid-cols-2 cursor-pointer">
              <div className="relative bg-[#FAF7F0] flex items-center justify-center p-3">
                <img src={m.foto_bahan_1} alt={m.nama} className="w-full h-full object-contain"/>
                <span className="absolute bottom-2 left-2 bg-black text-white text-[8px] font-black px-2.5 py-1 rounded-full">BAHAN</span>
              </div>
              <div className="relative bg-black flex items-center justify-center p-1">
                <img src={m.foto_jadi_1} alt={m.nama} className="w-full h-full object-cover"/>
                <span className="absolute bottom-2 left-2 bg-[#D4AF37] text-black text-[8px] font-black px-2.5 py-1 rounded-full">TERPASANG</span>
              </div>
              {m.badge && <span className={`absolute top-4 left-4 text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest ${m.badge.toLowerCase()==='promo'?'bg-red-500 text-white':'bg-[#D4AF37] text-black'}`}>{m.badge.toUpperCase()}</span>}
            </Link>

            <div className="p-6 flex flex-col flex-1">
              <Link href={`/estetika/${m.slug||m.id}`}><h3 className="font-black text-[18px] text-black leading-tight hover:text-[#B8960C]">{m.nama}</h3></Link>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl"><div className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Kategori</div><div className="text-[13px] font-black text-black mt-1">{m.kategori}</div></div>
                <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl"><div className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Ukuran</div><div className="text-[13px] font-black text-black mt-1">{m.ukuran||'-'}</div></div>
              </div>

              <div className="mt-3 p-3 rounded-2xl bg-black text-white"><div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Spesifikasi</div><div className="text-[13px] font-bold mt-1 line-clamp-2">{m.spesifikasi || m.deskripsi || 'Cocok untuk pagar, partisi cafe, HPL.'}</div></div>

              <div className="mt-5">
                {hasPromo && <p className="text-[12px] line-through font-bold text-black/40">Rp {formatRupiah(m.harga)}</p>}
                <p className="text-[26px] font-black text-[#B8960C] tracking-tight">Rp {formatRupiah(hargaAktif)}</p>
                <p className="text-[11px] font-black tracking-widest text-black/50">PER {m.satuan?.toUpperCase()}</p>
              </div>

              <div className="mt-4 bg-[#FFFBF0] border border-[#D4AF37]/30 rounded-full p-1.5 flex items-center justify-between">
                <button onClick={()=>setCalc(s=>({...s,[m.id]:Math.max(1,(s[m.id]||10)-1)}))} className="w-10 h-10 bg-white border rounded-full font-black text-black">−</button>
                <span className="font-black text-[13px] text-black">{qty} {m.satuan} = Rp {formatRupiah(total)}</span>
                <button onClick={()=>setCalc(s=>({...s,[m.id]:(s[m.id]||10)+1}))} className="w-10 h-10 bg-black text-white rounded-full font-black">+</button>
              </div>

              <div className="grid grid-cols-[1.6fr_1fr] gap-3 mt-6">
                <a href={waLink(m,qty,total)} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[14px] shadow-[0_8px_20px_rgba(37,211,102,0.3)]">Whatsapp</a>
                <button onClick={()=>handleShare(m)} className="bg-white border-[2px] border-black text-black text-center py-4 rounded-full font-black text-[14px]">↗ Bagikan</button>
              </div>
            </div>
          </div>
        )})}
      </div>
      {filtered.length===0 && <p className="text-center py-20 font-black text-black/40">Estetika tidak ditemukan - input dulu di /admin/estetika bro!</p>}
    </div>
  </main>
    }
