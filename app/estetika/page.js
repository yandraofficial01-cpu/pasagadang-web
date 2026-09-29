'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// LOGO PERSIS HOMEPAGE
function LogoPasagadang(){
  return (
    <div className="relative leading-none select-none">
      <div className="font-black text-[26px] md:text-[30px] tracking-tighter flex items-baseline">
        <span className="text-[#B91C1C]">PA</span>
        <span className="text-[#D4AF37]">SAGA</span>
        <span className="text-[#B91C1C]">DANG</span>
        <span className="text-[#B91C1C] text-[12px] ml-1 font-black">.COM</span>
      </div>
      {/* sapuan kuas emas */}
      <div className="absolute -bottom-1 left-0 w-[155px] h-[8px] bg-[#D4AF37] rounded-full blur-[0.3px] opacity-90 rotate-[-2deg]"
           style={{clipPath: 'polygon(0 60%, 15% 30%, 40% 50%, 70% 20%, 100% 40%, 100% 80%, 70% 100%, 30% 80%, 0 90%)'}}></div>
    </div>
  )
}

export default function EstetikaPage(){
  const [estetikas, setEstetikas] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('semua')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
  const [calc, setCalc] = useState({})

  useEffect(()=>{
    async function getData(){
      try{
        const res = await fetch(`${API}/estetikas`)
        const data = await res.json()
        const arr = Array.isArray(data)? data : data.data || []
        setEstetikas(arr.filter(m=>m.is_active!==false))
        const saved = localStorage.getItem('pg_cart')
        if(saved) setCart(JSON.parse(saved))
      }catch{}
      finally{ setLoading(false) }
    }
    getData()
  },[])

  useEffect(()=>{ localStorage.setItem('pg_cart', JSON.stringify(cart)) },[cart])

  const addToCart = (m)=>{
    const qty = calc[m.id]||10
    const harga = m.harga_promo && m.harga_promo < m.harga? m.harga_promo : m.harga
    setCart(prev=>{
      const exist = prev.find(x=>x.id===m.id)
      if(exist) return prev.map(x=>x.id===m.id?{...x, qty: x.qty+qty}:x)
      return [...prev, {id:m.id, nama:m.nama, harga, qty, foto:m.foto_bahan_1, satuan:m.satuan}]
    })
    alert(`${m.nama} x${qty} masuk keranjang!`)
  }

  const totalCart = cart.reduce((a,b)=>a+b.harga*b.qty,0)

  const getWA62=(num)=>{
    let raw=String(num||'08979879518').replace(/[^0-9]/g,'')
    if(raw.startsWith('0')) return '62'+raw.slice(1)
    if(raw.startsWith('8')) return '62'+raw
    return raw
  }

  const waLink=(m,qty,total)=>{
    const wa62=getWA62(m.wa_number)
    const url = typeof window!=='undefined'? `${window.location.origin}/estetika/${m.slug||m.id}` : ''
    return `https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%20saya%20mau%20pesan%20${encodeURIComponent(m.nama)}%0AJumlah:%20${qty}%20${m.satuan}%0ATotal:%20Rp%20${Number(total).toLocaleString('id-ID')}%0ALink:%20${encodeURIComponent(url)}`
  }

  const waCart = ()=>{
    if(cart.length===0) return '#'
    let text = `Halo Pasa Gadang, mau order:\n`
    cart.forEach(c=>{
      text+=`- ${c.nama} x${c.qty} ${c.satuan} = Rp ${Number(c.harga*c.qty).toLocaleString('id-ID')}\n`
    })
    text+=`\nTotal: Rp ${Number(totalCart).toLocaleString('id-ID')}\nMinta ongkir ke...`
    const wa62=getWA62('08979879518')
    return `https://wa.me/${wa62}?text=${encodeURIComponent(text)}`
  }

  const categories = ['semua','roster','batu alam','granit','keramik','bata ekspos','ornamen']
  let filtered = estetikas.filter(m=>{
    const matchCat = cat==='semua' || m.kategori?.toLowerCase()===cat.toLowerCase()
    const matchSearch = search==='' || m.nama.toLowerCase().includes(search.toLowerCase()) || (m.deskripsi||'').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n||0)
  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]"><p className="font-black animate-pulse text-black">LOADING ESTETIKA...</p></div>

  return <main className="min-h-screen bg-[#FFFBF0]">
      {/* NAVBAR SAMA PERSIS KAYAK HOMEPAGE */}
      <nav className="sticky top-0 z-50 bg-[#FFFBF0] px-4 md:px-10 py-4 flex justify-between items-center border-b border-black/5">
        <Link href="/"><LogoPasagadang /></Link>
        <div className="flex gap-2 items-center">
          <a href={waCart()} target="_blank" className="px-4 py-2.5 rounded-full font-black text-[11px] bg-black text-white border">🛒 {cart.length} • Rp {formatRupiah(totalCart)}</a>
          <div className="w-10 h-10 bg-white rounded-full border flex items-center justify-center text-[16px]">🌙</div>
          <div className="w-10 h-10 bg-white rounded-full border flex flex-col items-center justify-center gap-[4px]">
            <div className="w-5 h-[2px] bg-black"></div>
            <div className="w-5 h-[2px] bg-black"></div>
            <div className="w-5 h-[2px] bg-black"></div>
          </div>
        </div>
      </nav>

    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mt-2">
        <p className="text-[13px] text-black/60 font-medium">Klik diagram di bawah - konsumen bisa pilih jalur pencarian langsung!</p>
      </div>

      <div className="flex justify-between items-start mt-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black">ESTETIKA<span className="text-[#D4AF37]"> GADANG</span></h1>
          <p className="text-[13px] font-bold text-black/60 mt-2">{estetikas.length} desain • Roster, Batu Alam, Granit Ready</p>
        </div>
      </div>

      <div className="mt-6 relative">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari roster bubble, batu alam, granit..." className="w-full p-5 rounded-full font-bold text-[14px] outline-none border-[2px] border-[#D4AF37] bg-white text-black placeholder:text-black/40"/>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
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
          <div key={m.id} className="bg-white rounded-[28px] overflow-hidden border-[2px] border-[#D4AF37] flex flex-col">
            <Link href={`/estetika/${m.slug||m.id}`} className="h-[260px] relative grid grid-cols-2 cursor-pointer">
              <div className="relative bg-[#FAF7F0] flex items-center justify-center p-3">
                <img src={m.foto_bahan_1} alt={m.nama} className="w-full h-full object-contain"/>
                <span className="absolute bottom-2 left-2 bg-black text-white text-[8px] font-black px-2.5 py-1 rounded-full">BAHAN</span>
              </div>
              <div className="relative bg-black flex items-center justify-center p-1">
                <img src={m.foto_jadi_1} alt={m.nama} className="w-full h-full object-cover"/>
                <span className="absolute bottom-2 left-2 bg-[#D4AF37] text-black text-[8px] font-black px-2.5 py-1 rounded-full">TERPASANG</span>
              </div>
              {m.badge && <span className="absolute top-4 left-4 text-[11px] font-black px-4 py-1.5 rounded-full bg-[#D4AF37] text-black">{m.badge.toUpperCase()}</span>}
            </Link>

            <div className="p-6 flex flex-col flex-1">
              <Link href={`/estetika/${m.slug||m.id}`}><h3 className="font-black text-[18px] text-black leading-tight">{m.nama}</h3></Link>

              {m.deskripsi && (
                <div className="mt-3 bg-[#FFFBF0] border border-[#D4AF37]/20 p-3 rounded-xl">
                  <p className="text-[10px] font-black tracking-widest text-[#B8960C]">DESKRIPSI</p>
                  <p className="text-[13px] font-medium text-black/80 mt-1 leading-relaxed">{m.deskripsi}</p>
                </div>
              )}

              <div className="mt-3 p-3 rounded-2xl bg-black text-white">
                <div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Spesifikasi</div>
                <div className="text-[13px] font-bold mt-1">{m.spesifikasi || '-'}</div>
                {m.ukuran && <div className="text-[11px] opacity-60 mt-1">Ukuran: {m.ukuran}</div>}
              </div>

              {(m.foto_bahan_2 || m.foto_bahan_3 || m.foto_jadi_2 || m.foto_jadi_3) && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {[m.foto_bahan_2,m.foto_bahan_3,m.foto_jadi_2,m.foto_jadi_3].filter(Boolean).map((foto,i)=>(
                    <img key={i} src={foto} className="w-12 h-12 rounded-lg object-cover border"/>
                  ))}
                </div>
              )}

              <div className="mt-5">
                {hasPromo && <p className="text-[12px] line-through font-bold text-black/40">Rp {formatRupiah(m.harga)}</p>}
                <p className="text-[26px] font-black text-[#B8960C]">Rp {formatRupiah(hargaAktif)}</p>
                <p className="text-[11px] font-black tracking-widest text-black/50">PER {m.satuan?.toUpperCase()}</p>
              </div>

              <div className="mt-4 bg-[#FFFBF0] border border-[#D4AF37]/30 rounded-full p-1.5 flex items-center justify-between">
                <button onClick={()=>setCalc(s=>({...s,[m.id]:Math.max(1,(s[m.id]||10)-1)}))} className="w-10 h-10 bg-white border rounded-full font-black">−</button>
                <span className="font-black text-[13px]">{qty} {m.satuan} = Rp {formatRupiah(total)}</span>
                <button onClick={()=>setCalc(s=>({...s,[m.id]:(s[m.id]||10)+1}))} className="w-10 h-10 bg-black text-white rounded-full font-black">+</button>
              </div>

              <div className="grid grid-cols-[1fr_1fr] gap-2 mt-4">
                <button onClick={()=>addToCart(m)} className="bg-black text-white py-3 rounded-full font-black text-[13px]">+ Keranjang</button>
                <a href={waLink(m,qty,total)} target="_blank" className="bg-[#25D366] text-white text-center py-3 rounded-full font-black text-[13px]">Whatsapp</a>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  </main>
}
