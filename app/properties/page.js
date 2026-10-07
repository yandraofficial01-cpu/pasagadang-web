'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

export default function PropertiesPage(){
  const [data,setData]=useState([])
  const [isLoading,setIsLoading]=useState(true) // <- FIX 1: loading beneran
  const [zoomFotos,setZoomFotos]=useState([])
  const [zoomIdx,setZoomIdx]=useState(0)
  const [theme,setTheme]=useState('light')
  const [open,setOpen]=useState(false)
  const [search,setSearch]=useState('')
  const [filterStatus,setFilterStatus]=useState('Semua')
  const API=process.env.NEXT_PUBLIC_API_URL
  const COLORS = { gold: '#D4AF37', red: '#B22222', cream: '#FFFBF0', dark: '#0B0B0F' }
  const isDark = theme==='dark'
  const STATUS_LIST = ['Semua','Ready','On Progress','Indent','Terjual']

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    setIsLoading(true)
    fetch(`${API}/properties?is_published=true`)
     .then(r=>r.json())
     .then(j=>setData(j.data||j||[]))
     .catch(()=>{})
     .finally(()=>setIsLoading(false)) // <- FIX 2: matiin loading abis fetch
  },[API])

  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }

  const getFotos=(p)=>[p.thumbnail,p.foto_1,p.foto_2,p.foto_3,p.foto_4,p.foto_5,p.foto_6,p.foto_7,p.foto_8].filter(Boolean)

  const getMapData = (p)=>{
    if(!p?.fasilitas) return { mapUrl: null, mapImg: null, fasilitasBersih: '', list: [] }
    const m = p.fasilitas.match(/\[MAP:(.*?)\]/)
    const mImg = p.fasilitas.match(/\[MAP_IMG:(.*?)\]/)
    const mapUrl = m? m[1].trim() : null
    const mapImg = mImg? mImg[1].trim() : null
    const bersih = p.fasilitas.replace(/\[MAP:.*?\]/g,'').replace(/\[MAP_IMG:.*?\]/g,'').trim()
    const list = bersih.split(',').map(s=>s.trim()).filter(Boolean)
    const fasilitasBersih = list.join(', ')
    return { mapUrl, mapImg, fasilitasBersih, list }
  }

  const filteredData = useMemo(()=>{
    return data.filter(p=>{
      const matchSearch = `${p.judul} ${p.alamat} ${p.kecamatan} ${p.tipe_properti}`.toLowerCase().includes(search.toLowerCase().trim())
      const status = (p.status_properti || p.status || 'Ready').toLowerCase()
      const matchStatus = filterStatus==='Semua' || status.includes(filterStatus.toLowerCase())
      return matchSearch && matchStatus
    })
  },[data, search, filterStatus])

  const waLink=(p)=>{
    const raw=String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
    const wa62=raw.startsWith('0')?'62'+raw.slice(1):raw
    const text = encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${p.judul} di ${p.kecamatan} - LT ${p.luas_tanah}m² LB ${p.luas_bangunan}m² Rp ${Number(p.harga_cash||0).toLocaleString('id-ID')}\nLink: https://pasagadang-web.vercel.app/properties/${p.slug}`)
    return `https://wa.me/${wa62}?text=${text}`
  }

  // LOADING COMPONENT - PERSIS SCREENSHOT LU
  if(isLoading){
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center ${isDark?'bg-[#0B0B0F]':'bg-[#FFFBF0]'}`}>
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-2 border-[#F5E6C8] rounded-full"></div>
          <div className="absolute inset-0 border-2 border-t-[#D4AF37] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className={`text-[12px] tracking-[0.4em] font-black ${isDark?'text-white':'text-[#333]'}`}>PASA GADANG</p>
      </main>
    )
  }

  return (
    <main className={`${isDark?'bg-[#0B0B0F] text-white':'bg-[#FFFBF0] text-black'} min-h-screen transition-colors pb-24`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-6 py-3 flex justify-between items-center ${isDark?'bg-[#0B0B0F]/90 border-white/10':'bg-[#FFFBF0]/90 border-black/5'}`}>
        <Link href="/" className="flex flex-col leading-none">
          <div className="flex font-black text-[24px] tracking-tight"><span style={{color:COLORS.red}}>PA</span><span className="bg-gradient-to-b from-[#FFEB7F] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">SAGA</span><span style={{color:COLORS.red}}>DANG</span><span className="text-[10px] ml-1 mt-1 tracking-widest" style={{color:COLORS.red}}>.COM</span></div>
          <div className="relative w-[165px] h-[8px] mt-[2px]"><svg viewBox="0 0 165 10" className="w-full h-full"><path d="M0 6 Q22 0 44 4 T88 4 T132 3 T165 1 Q132 7 88 7 T44 7 T0 6" fill="#D4AF37" opacity="0.9"/><path d="M18 9 Q40 6 62 7.5 T106 7.5 T148 6 Q106 10 62 10.5 T18 9" fill="#D4AF37" opacity="0.8"/></svg></div>
        </Link>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark?'bg-white border-white':'bg-white border-black/10'}`}>{isDark?'☀️':'🌙'}</button>
          <button onClick={()=>setOpen(!open)} className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-1.5 ${isDark?'bg-white border-white':'bg-white border-black/10'}`}><span className={`w-5 h-[2px] bg-black transition-all ${open?'rotate-45 translate-y-[6px]':''}`}></span><span className={`w-5 h-[2px] bg-black transition-all ${open?'opacity-0':''}`}></span><span className={`w-5 h-[2px] bg-black transition-all ${open?'-rotate-45 -translate-y-[6px]':''}`}></span></button>
        </div>
      </nav>

      {open && (
        <div className={`px-6 py-4 space-y-0 shadow-xl border-b ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>01 • PROPERTI <span className="opacity-40">→</span></Link>
          <Link href="/estetika" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>02 • ESTETIKA <span className="opacity-40">→</span></Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>03 • MATERIAL <span className="opacity-40">→</span></Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>04 • BLOG <span className="opacity-40">→</span></Link>
          <Link href="/" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-widest flex items-center justify-center mt-4">← KEMBALI KE BERANDA</Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-black tracking-tighter mt-2">PROPERTI<span style={{color:COLORS.gold}}> Pasa Gadang </span></h1>
        <p className={`${isDark?'text-white/50':'text-black/50'} text-[13px] mt-1`}>{filteredData.length} dari {data.length} unit ready di Padang</p>

        <div className={`mt-5 flex items-center gap-3 px-5 py-3.5 rounded-full border ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/10 shadow-sm'}`}>
          <span className="text-[18px] opacity-40">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari lokasi, Manggis, Kuranji, Balai Baru..." className="flex-1 bg-transparent outline-none text-[14px] font-medium placeholder:opacity-40"/>
          {search && <button onClick={()=>setSearch('')} className="w-6 h-6 bg-black/10 rounded-full flex items-center justify-center text-[12px]">✕</button>}
        </div>

        <div className="flex gap-2 overflow-x-auto mt-4 pb-2 scrollbar-hide">
          {STATUS_LIST.map(s=>{
            const active = filterStatus===s
            return(<button key={s} onClick={()=>setFilterStatus(s)} className={`px-5 py-2.5 rounded-full text-[12px] font-black tracking-widest whitespace-nowrap border transition ${active?'bg-[#D4AF37] text-black border-[#D4AF37]':'bg-transparent border-black/10 opacity-70 hover:opacity-100'} ${isDark &&!active?'bg-white/10 border-white/10 text-white':''}`}>{s.toUpperCase()}</button>)
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredData.map(p=>{
            const fotos=getFotos(p)
            const mapData = getMapData(p)
            const badgeRaw = (p.badge || '').toString()
            const isTerjual = badgeRaw.toLowerCase().includes('terjual') || badgeRaw.toLowerCase().includes('sold') || (p.status_properti||'').toLowerCase().includes('terjual')
            const realMapLink = mapData.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.alamat||'')}`

            return (
              <div key={p.id} className={`rounded-[28px] overflow-hidden border-[2px] flex flex-col transition hover:scale-[1.02] ${isDark?'bg-[#121214] border-[#D4AF37]':'bg-white border-[#D4AF37]'} shadow-[0_10px_40px_rgba(212,175,55,0.18)]`}>
                <div className="h-[260px] relative cursor-pointer" onClick={()=>{if(!isTerjual){setZoomFotos(fotos); setZoomIdx(0)}}}>
                  <img src={fotos[0]} className="w-full h-full object-cover"/>

                  {/* BADGE KECIL UNGU KALO BUKAN TERJUAL */}
                  {badgeRaw &&!isTerjual && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="text-white text-[11px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase border border-white shadow-lg bg-gradient-to-r from-purple-600 to-violet-600">🔥 {badgeRaw.toUpperCase()}</div>
                    </div>
                  )}

                  {/* BADGE TERJUAL BULAT GEDE - PERSIS SCREENSHOT */}
                  {isTerjual && (
                    <div className="absolute inset-0 z-20">
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#D4AF37] blur-[25px] opacity-60 rounded-full scale-125"></div>
                          <div className="relative w-[175px] h-[175px] rounded-full bg-[#CC0000] border-[6px] border-[#D4AF37] flex flex-col items-center justify-center rotate-[-15deg] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-[8px] rounded-full border border-dashed border-white/60"></div>
                            <div className="text-[#FFEB7F] text-[11px] font-black tracking-[0.2em]">★ TERJUAL ★</div>
                            <div className="text-white text-[28px] font-black tracking-tight leading-none mt-1">TERJUAL</div>
                            <div className="w-[70%] h-[2.5px] bg-[#D4AF37] my-1.5"></div>
                            <div className="text-[#FFEB7F] text-[9px] font-black tracking-[0.35em]">PASA GADANG</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className={`font-black text-[18px] leading-tight ${isDark?'text-white':'text-black'}`}>{p.judul}</h3>
                  <p className={`text-[13px] font-medium mt-1 ${isDark?'text-white/60':'text-black/70'}`}>{p.alamat}</p>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Luas Tanah</div><div className="text-[15px] font-black mt-1">{p.luas_tanah} m²</div></div>
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Luas Bangunan</div><div className="text-[15px] font-black mt-1">{p.luas_bangunan} m²</div></div>
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Kamar Tidur</div><div className="text-[15px] font-black mt-1">{p.kamar_tidur} Kamar</div></div>
                    <div className={`p-3 rounded-2xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}><div className="text-[10px] font-bold tracking-widest opacity-50 uppercase">Kamar Mandi</div><div className="text-[15px] font-black mt-1">{p.kamar_mandi} Kamar</div></div>
                  </div>

                  {mapData.fasilitasBersih? (
                    <div className="mt-3 p-3 rounded-2xl bg-black text-white">
                      <div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Fasilitas</div>
                      <div className="text-[13px] font-bold mt-1 line-clamp-2">{mapData.fasilitasBersih}</div>
                    </div>
                  ) : null}

                  {mapData.mapImg && (
                    <div className="mt-3 rounded-[16px] overflow-hidden border-2 border-[#D4AF37]/30">
                      <a href={realMapLink} target="_blank" className="block relative group">
                        <img src={mapData.mapImg} alt="Map Real" className="w-full h-[150px] object-cover"/>
                        <div className="absolute bottom-2 left-2 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full shadow">📍 Klik buka map real</div>
                      </a>
                    </div>
                  )}

                  <div className="mt-5">
                    <div className="text-[11px] font-black tracking-widest opacity-50 uppercase">Harga Cash</div>
                    <div className="text-[26px] font-black tracking-tight" style={{color:COLORS.gold}}>Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[14px] shadow-lg">Whatsapp</a>
                    <Link href={`/properties/${p.slug}`} className={`${isDark?'bg-white text-black':'bg-black text-white'} text-center py-4 rounded-full font-black text-[14px]`}>DETAIL →</Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredData.length===0 &&!isLoading && (
          <div className="text-center py-20 opacity-50">
            <p className="text-[40px]">🏠</p>
            <p className="font-black mt-3">Gak ada properti {filterStatus} yang cocok "{search}"</p>
            <button onClick={()=>{setSearch(''); setFilterStatus('Semua')}} className="mt-3 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-[12px] font-black">RESET FILTER</button>
          </div>
        )}
      </div>

      <a href="https://wa.me/628979879518?text=Halo%20Pasa%20Gadang%20saya%20mau%20tanya%20properti" target="_blank" className="fixed bottom-6 right-6 z-[99] w-[62px] h-[62px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.6)] border-[3px] border-white">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19.05 4.91A9.93 9.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.14 1.6 5.94L0 24l6.35-1.66A11.9 11.9 0 0 0 12 23.88h.01c6.53 0 11.86-5.33 11.86-11.88 0-3.17-1.24-6.16-3.49-8.4Zm-7.05 14.4a9.3 9.3 0 0 1-4.75-1.3l-.34-.2-3.77.99 1-3.67-.22-.37A9.36 9.36 0 0 1 2.6 12c0-5.14 4.2-9.32 9.38-9.32 2.5 0 4.85.97 6.62 2.74A9.3 9.3 0 0 1 21.33 12c0 5.14-4.2 9.3-9.33 9.3Z"/></svg>
      </a>

      {zoomFotos.length>0 && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center p-4">
          <button onClick={()=>setZoomFotos([])} className="absolute top-5 right-5 bg-white text-black w-10 h-10 rounded-full font-black">X</button>
          <div className="absolute top-5 left-5 bg-[#D4AF37] text-black px-4 py-1 rounded-full text-[13px] font-black">{zoomIdx+1} / {zoomFotos.length}</div>
          <img src={zoomFotos[zoomIdx]} className="max-h-[70vh] rounded-2xl border-2 border-[#D4AF37] object-contain"/>
          <div className="flex gap-4 mt-5">
            <button onClick={()=>setZoomIdx(i=>i>0?i-1:zoomFotos.length-1)} className="w-14 h-14 bg-white/20 text-white rounded-full text-2xl">‹</button>
            <button onClick={()=>setZoomIdx(i=>i<zoomFotos.length-1?i+1:0)} className="w-14 h-14 bg-white text-black rounded-full text-2xl">›</button>
          </div>
        </div>
      )}
    </main>
  )
    }
