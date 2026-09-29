'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const COLORS = { gold: '#D4AF37', red: '#B22222', cream: '#FFFBF0', dark: '#0B0B0F' }

// LOGO V2 SAMA PERSIS HOME
function LogoPasagadang(){
  return (
    <div className="flex flex-col leading-none">
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
    </div>
  )
}

export default function EstetikaPage(){
  const [estetikas, setEstetikas] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('semua')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [calc, setCalc] = useState({})
  const [theme, setTheme] = useState('light')
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

  useEffect(()=>{
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
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

  const isDark = theme==='dark'
  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }

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
    cart.forEach(c=>{ text+=`- ${c.nama} x${c.qty} ${c.satuan} = Rp ${Number(c.harga*c.qty).toLocaleString('id-ID')}\n` })
    text+=`\nTotal: Rp ${Number(totalCart).toLocaleString('id-ID')}\nMinta ongkir ke...`
    const wa62=getWA62('08979879518')
    return `https://wa.me/${wa62}?text=${encodeURIComponent(text)}`
  }

  const categories = ['semua','roster','batu alam','granit','keramik','bata ekspos','ornamen']
  let filtered = estetikas.filter(m=>{
    const matchCat = cat==='semua' || m.kategori?.toLowerCase()===cat.toLowerCase()
    const matchSearch = search==='' || m.nama.toLowerCase().includes(search.toLowerCase()) || (m.deskripsi||'').toLowerCase().includes(search.toLowerCase()) || (m.spesifikasi||'').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n||0)
  if(loading) return <div className={`min-h-screen flex items-center justify-center ${isDark?'bg-[#0B0B0F]':'bg-[#FFFBF0]'}`}><p className="font-black animate-pulse">LOADING ESTETIKA...</p></div>

  return <main className={`${isDark? 'bg-[#0B0B0F] text-white' : 'bg-[#FFFBF0] text-black'} min-h-screen transition-colors duration-300`}>
      {/* NAVBAR - PERSIS HOME */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/"><LogoPasagadang /></Link>
        <div className="flex gap-2 items-center">
          <a href={waCart()} target="_blank" className={`px-4 py-2.5 rounded-full font-black text-[11px] border ${isDark?'bg-white text-black border-white':'bg-black text-white border-black'}`}>🛒 {cart.length} • Rp {formatRupiah(totalCart)}</a>
          <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>{isDark?'☀️':'🌙'}</button>
          <Link href="/" className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>
            <span className="w-5 h-[2px] bg-black"></span><span className="w-5 h-[2px] bg-black"></span><span className="w-5 h-[2px] bg-black"></span>
          </Link>
        </div>
      </nav>

    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="flex justify-between items-start mt-2">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">ESTETIKA<span style={{color:COLORS.gold}}> GADANG</span></h1>
          <p className={`text-[13px] font-bold mt-2 ${isDark?'text-zinc-400':'text-black/60'}`}>{estetikas.length} desain • Roster, Batu Alam, Granit Ready</p>
        </div>
      </div>

      <div className="mt-6 relative">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari roster bubble, batu alam, granit..." className={`w-full p-5 rounded-full font-bold text-[14px] outline-none border-[2px] ${isDark?'bg-[#121214] border-white/10 text-white placeholder:text-white/40':'bg-white border-[#D4AF37] text-black placeholder:text-black/40'}`}/>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-6 py-3 rounded-full text-xs font-black uppercase whitespace-nowrap border-[2px] ${cat===c?'bg-black text-white border-black': isDark?'bg-[#121214] text-white border-white/20':'bg-white text-black border-[#D4AF37]'}`}>{c}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map(m=>{
          const hasPromo = m.harga_promo && m.harga_promo < m.harga
          const qty = calc[m.id]||10
          const hargaAktif = hasPromo? m.harga_promo : m.harga
          const total = hargaAktif * qty
          return(
          <div key={m.id} className={`rounded-[28px] overflow-hidden border-[2.5px] flex flex-col ${isDark?'bg-[#121214]':'bg-white'}`} style={{borderColor:COLORS.gold}}>
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
              <Link href={`/estetika/${m.slug||m.id}`}><h3 className="font-black text-[18px] leading-tight">{m.nama}</h3></Link>

              {/* DESKRIPSI DARI ADMIN - WAJIB MUNCUL */}
              {m.deskripsi && (
                <div className={`mt-3 border p-3 rounded-xl ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/20'}`}>
                  <p className="text-[10px] font-black tracking-widest text-[#B8960C]">DESKRIPSI</p>
                  <p className="text-[13px] font-medium mt-1 leading-relaxed">{m.deskripsi}</p>
                </div>
              )}

              {/* SPESIFIKASI DARI ADMIN - WAJIB MUNCUL */}
              <div className="mt-3 p-3 rounded-2xl bg-black text-white">
                <div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">SPESIFIKASI</div>
                <div className="text-[13px] font-bold mt-1">{m.spesifikasi || 'Belum ada spesifikasi'}</div>
                <div className="flex gap-2 mt-2">
                  {m.ukuran && <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">Ukuran: {m.ukuran}</span>}
                  {m.kategori && <span className="text-[10px] bg-[#D4AF37] text-black px-2 py-1 rounded-full font-black">{m.kategori.toUpperCase()}</span>}
                </div>
              </div>

              {(m.foto_bahan_2 || m.foto_bahan_3 || m.foto_jadi_2 || m.foto_jadi_3) && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {[m.foto_bahan_2,m.foto_bahan_3,m.foto_jadi_2,m.foto_jadi_3].filter(Boolean).map((foto,i)=>(
                    <img key={i} src={foto} className="w-12 h-12 rounded-lg object-cover border"/>
                  ))}
                </div>
              )}

              <div className="mt-5">
                {hasPromo && <p className="text-[12px] line-through font-bold opacity-40">Rp {formatRupiah(m.harga)}</p>}
                <p className="text-[26px] font-black" style={{color:COLORS.gold}}>Rp {formatRupiah(hargaAktif)}</p>
                <p className="text-[11px] font-black tracking-widest opacity-50">PER {m.satuan?.toUpperCase()}</p>
              </div>

              <div className={`mt-4 rounded-full p-1.5 flex items-center justify-between ${isDark?'bg-white/5 border border-white/10':'bg-[#FFFBF0] border border-[#D4AF37]/30'}`}>
                <button onClick={()=>setCalc(s=>({...s,[m.id]:Math.max(1,(s[m.id]||10)-1)}))} className="w-10 h-10 bg-white border rounded-full font-black text-black">−</button>
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
