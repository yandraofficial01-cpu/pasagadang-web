'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

export default function MaterialsPage(){
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('semua')
  const [brand, setBrand] = useState('semua')
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState('light')
  const [open, setOpen] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL
  const [calc, setCalc] = useState({})
  const COLORS = { gold: '#D4AF37', red: '#B22222', cream: '#FFFBF0', dark: '#0B0B0F' }
  const isDark = theme==='dark'

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    async function getData(){
      try{
        const res = await fetch(`${API}/materials`)
        const data = await res.json()
        const arr = Array.isArray(data)? data : data.data || []
        setMaterials(arr.filter(m=>m.is_active!==false))
      }catch{} finally{ setLoading(false) }
    }
    getData()
  },[API])

  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }

  const getWA62=(num)=>{
    let raw=String(num||'08979879518').replace(/[^0-9]/g,'')
    if(raw.startsWith('0')) return '62'+raw.slice(1)
    if(raw.startsWith('8')) return '62'+raw
    return raw
  }

  const waLink=(m,qty,total)=>{
    const wa62=getWA62(m.wa_number)
    const harga=m.harga_promo && m.harga_promo < m.harga? m.harga_promo : m.harga
    const url = typeof window!=='undefined'? `${window.location.origin}/materials/${m.slug||m.id}` : ''
    return `https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%20saya%20mau%20pesan%20${encodeURIComponent(m.nama)}%0AJumlah:%20${qty}%20${m.satuan}%0ATotal:%20Rp%20${Number(total).toLocaleString('id-ID')}%0ALink:%20${encodeURIComponent(url)}`
  }

  const handleShare=async(m)=>{
    const url = `${window.location.origin}/materials/${m.slug||m.id}`
    const text = `${m.nama} - Rp ${Number(m.harga).toLocaleString('id-ID')}/${m.satuan} - ${m.brand}`
    if(navigator.share){
      try{ await navigator.share({title:m.nama, text, url}) }catch{}
    }else{
      await navigator.clipboard.writeText(`${text} ${url}`)
      alert('Link disalin: '+url)
    }
  }

  const categories = ['semua','semen','besi','bata','pasir','kayu','keramik','cat']
  const brands = useMemo(()=> [...new Set(materials.map(m=>m.brand).filter(Boolean))], [materials])

  let filtered = materials.filter(m=>{
    const matchCat = cat==='semua' || m.kategori?.toLowerCase()===cat.toLowerCase()
    const matchBrand = brand==='semua' || m.brand===brand
    const matchSearch = search==='' || m.nama.toLowerCase().includes(search.toLowerCase()) || m.brand?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchBrand && matchSearch
  })

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID').format(n||0)
  if(loading) return <div className={`min-h-screen flex items-center justify-center ${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'}`}><p className="font-black animate-pulse">LOADING MATERIAL...</p></div>

  return <main className={`${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'} min-h-screen transition-colors pb-24`}>
      {/* NAVBAR - SAMA PERSIS HOMEPAGE + PROPERTI */}
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
          <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'opacity-0':''}`}></span>
            <span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span>
          </button>
        </div>
      </nav>

      {/* MENU - SAMA KAYAK HOMEPAGE */}
      {open && (
        <div className={`px-6 py-4 space-y-0 shadow-xl border-b ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>01 • PROPERTI <span className="opacity-40">→</span></Link>
          <Link href="/estetika" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>02 • ESTETIKA <span className="opacity-40">→</span></Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>03 • MATERIAL <span className="opacity-40">→</span></Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>04 • BLOG <span className="opacity-40">→</span></Link>
          <Link href="/" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-widest flex items-center justify-center mt-4">← KEMBALI KE BERANDA</Link>
        </div>
      )}

    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">MATERIAL<span style={{color:COLORS.gold}}> Pasa Gadang </span></h1>
          <p className={`text-[13px] font-bold mt-2 ${isDark?'text-white/50':'text-black/60'}`}>{filtered.length} dari {materials.length} SKU aktif • Harga live update</p>
        </div>
        <div className={`${isDark?'bg-white text-black':'bg-black text-white'} rounded-[16px] px-5 py-3`}>
          <p className="text-[10px] font-black opacity-60">TOTAL</p>
          <p className="text-xl font-black">{materials.length}</p>
        </div>
      </div>

      <div className="mt-6 relative">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari semen, besi, bata, brand..." className={`w-full p-5 rounded-full font-bold text-[14px] outline-none border-[2px] ${isDark?'bg-[#121214] border-white/10 text-white placeholder:text-white/40':'bg-white border-[#D4AF37] text-black placeholder:text-black/40'}`}/>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black">🔍</span>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-6 py-3 rounded-full text-xs font-black uppercase whitespace-nowrap border-[2px] transition ${cat===c? 'bg-black text-white border-black' : isDark?'bg-white/10 text-white border-white/10':'bg-white text-black border-[#D4AF37]'}`}>{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={()=>setBrand('semua')} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-[2px] ${brand==='semua'?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-transparent border-[#D4AF37]/40'}`}>SEMUA BRAND</button>
        {brands.map(b=>(
          <button key={b} onClick={()=>setBrand(b)} className={`px-5 py-2.5 rounded-full text-[11px] font-black border-[2px] whitespace-nowrap ${brand===b?'bg-[#D4AF37] text-black border-[#D4AF37]': isDark?'bg-white/10 text-white border-white/10':'bg-white text-black border-[#D4AF37]/40'}`}>{b.toUpperCase()}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map(m=>{
          const hasPromo = m.harga_promo && m.harga_promo < m.harga
          const qty = calc[m.id]||m.stok_minimum||10
          const hargaAktif = hasPromo? m.harga_promo : m.harga
          const total = hargaAktif * qty
          return(
          <div key={m.id} className={`rounded-[28px] overflow-hidden border-[2px] flex flex-col transition hover:scale-[1.02] ${isDark?'bg-[#121214] border-[#D4AF37]':'bg-white border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.18)]'}`}>
            <Link href={`/materials/${m.slug||m.id}`} className="h-[260px] relative bg-white flex items-center justify-center p-6 cursor-pointer">
              <img src={m.foto_1} alt={m.nama} className="w-full h-full object-contain"/>
              {m.badge && <span className={`absolute top-4 left-4 text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest ${m.badge.toLowerCase()==='promo'?'bg-red-500 text-white':'bg-[#D4AF37] text-black'}`}>{m.badge.toUpperCase()}</span>}
              <div className="absolute bottom-4 left-4 bg-black text-white text-[11px] font-bold px-4 py-2 rounded-full">{m.kategori?.toUpperCase()} • {m.brand?.toUpperCase()}</div>
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <Link href={`/materials/${m.slug||m.id}`}><h3 className={`font-black text-[18px] leading-tight hover:text-[#B8960C] ${isDark?'text-white':'text-black'}`}>{m.nama}</h3></Link>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className={`${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'} border p-3 rounded-2xl`}><div className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Satuan</div><div className="text-[15px] font-black mt-1">{m.satuan}</div></div>
                <div className={`${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'} border p-3 rounded-2xl`}><div className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Ukuran</div><div className="text-[15px] font-black mt-1">{m.ukuran||'-'}</div></div>
              </div>
              <div className="mt-3 p-3 rounded-2xl bg-black text-white"><div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Spesifikasi</div><div className="text-[13px] font-bold mt-1 line-clamp-2">{m.spesifikasi || m.deskripsi || 'Siap antar, paling tidak setelah kirim bukti booking minimal 20%'}</div></div>
              <div className="mt-5">
                {hasPromo && <p className="text-[12px] line-through font-bold opacity-40">Rp {formatRupiah(m.harga)}</p>}
                <p className="text-[26px] font-black tracking-tight" style={{color:COLORS.gold}}>Rp {formatRupiah(hargaAktif)}</p>
                <p className="text-[11px] font-black tracking-widest opacity-50">PER {m.satuan?.toUpperCase()}</p>
              </div>
              <div className={`mt-4 border rounded-full p-1.5 flex items-center justify-between ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}>
                <button onClick={()=>setCalc(s=>({...s,[m.id]:Math.max(1,(s[m.id]||m.stok_minimum||10)-1)}))} className="w-10 h-10 bg-white border rounded-full font-black text-black">−</button>
                <span className="font-black text-[13px]">{qty} {m.satuan} = Rp {formatRupiah(total)}</span>
                <button onClick={()=>setCalc(s=>({...s,[m.id]:(s[m.id]||m.stok_minimum||10)+1}))} className="w-10 h-10 bg-black text-white rounded-full font-black">+</button>
              </div>
              <div className="grid grid-cols-[1.6fr_1fr] gap-3 mt-6">
                <a href={waLink(m,qty,total)} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[14px] shadow-[0_8px_20px_rgba(37,211,102,0.3)]">Whatsapp</a>
                <button onClick={()=>handleShare(m)} className={`${isDark?'bg-white text-black':'bg-white border-[2px] border-black text-black'} text-center py-4 rounded-full font-black text-[14px]`}>↗ Bagikan</button>
              </div>
            </div>
          </div>
        )})}
      </div>
      {filtered.length===0 && <p className="text-center py-20 font-black opacity-40">Material tidak ditemukan</p>}
    </div>

    {/* WA MELAYANG 08979879518 */}
    <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang%20saya%20mau%20tanya%20material" target="_blank" className="fixed bottom-6 right-6 z-[99] w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] border-[3px] border-white hover:scale-110 transition">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19.05 4.91A9.93 9.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.14 1.6 5.94L0 24l6.35-1.66A11.9 11.9 0 0 0 12 23.88h.01c6.53 0 11.86-5.33 11.86-11.88 0-3.17-1.24-6.16-3.49-8.4Z"/></svg>
    </a>
  </main>
}
