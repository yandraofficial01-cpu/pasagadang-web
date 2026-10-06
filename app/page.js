'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function TypewriterText({ isDark }){
  const fullText = `Pasa Gadang jual 3 hal:
PROPERTI impianmu,
BAHAN ESTETIKA biar rumah lebih indah,
dan MATERIAL yang tinggal pesan online langsung kirim.`
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)
  useEffect(()=>{
    if(index < fullText.length){
      const t = setTimeout(()=>{
        setDisplayed(prev => prev + fullText[index])
        setIndex(index+1)
      }, 30)
      return ()=> clearTimeout(t)
    }
  },[index, fullText])
  return (
    <div className="text-center">
      <h2 className="font-black text-[22px] md:text-[26px] tracking-tighter leading-none">
        LENGKAP. <span style={{color:'#D4AF37'}}>ESTETIK.</span> BISA ONLINE.
      </h2>
      <p className={`mt-4 font-bold text-[14px] leading-relaxed whitespace-pre-wrap min-h-[72px] ${isDark?'text-zinc-300':'text-black/70'}`}>
        {displayed}<span className="animate-pulse">|</span>
      </p>
      <p className="mt-4 font-black text-[11px] tracking-[0.3em] animate-bounce">
        PILIH JALURMU DI BAWAH ↓
      </p>
    </div>
  )
}

export default function Home(){
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [properties, setProperties] = useState([])
  const [materials, setMaterials] = useState([])
  const [estetikas, setEstetikas] = useState([])
  const [blogs, setBlogs] = useState([])
  const [zoomList, setZoomList] = useState([])
  const [zoomIdx, setZoomIdx] = useState(0)
  const API = process.env.NEXT_PUBLIC_API_URL
  const COLORS = { gold: '#D4AF37', red: '#B22222', cream: '#FFFBF0', dark: '#0B0B0F' }

  useEffect(()=>{
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    if(!API) return
    fetch(`${API}/properties/?is_published=true&limit=20`).then(r=>r.json()).then(j=>setProperties(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/materials/?is_active=true&limit=6`).then(r=>r.json()).then(j=>setMaterials(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/estetikas/?is_active=true&limit=6`).then(r=>r.json()).then(j=>setEstetikas(j.data||j.items||j||[])).catch(()=>{})
    fetch(`${API}/blogs/?is_published=true&limit=6`).then(r=>r.json()).then(j=>setBlogs(j.data||j.items||j||[])).catch(()=>{})
  },[API])

  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('theme',n)
  }
  const isDark = theme==='dark'

  const sortedProperties = [...properties].sort((a,b)=>{
    const aBadge = (a.badge||'').toLowerCase()
    const aStatus = (a.status_properti||'').toLowerCase()
    const aSold = aBadge.includes('terjual') || aStatus.includes('terjual')
    const bBadge = (b.badge||'').toLowerCase()
    const bStatus = (b.status_properti||'').toLowerCase()
    const bSold = bBadge.includes('terjual') || bStatus.includes('terjual')
    if(aSold &&!bSold) return 1
    if(!aSold && bSold) return -1
    return 0
  })

  const waLink = (p)=>{
    const raw = String(p.wa_number||'08979879518').replace(/[^0-9]/g,'')
    const wa62 = raw.startsWith('0')? '62'+raw.slice(1) : raw
    const text = encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${p.judul} - ${p.kecamatan||''} - LT ${p.luas_tanah}m² LB ${p.luas_bangunan}m² - Rp ${Number(p.harga_cash||0).toLocaleString('id-ID')}\nLink: https://pasagadang.com/properties/${p.slug}`)
    return `https://wa.me/${wa62}?text=${text}`
  }
  const waEstetika = (e)=>{
    const raw = '08979879518'.replace(/[^0-9]/g,'')
    const wa62 = raw.startsWith('0')? '62'+raw.slice(1) : raw
    const text = encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${e.nama} - ${e.kategori} ${e.ukuran} - Rp ${Number(e.harga||0).toLocaleString('id-ID')} / ${e.satuan}\nLink: https://pasagadang-web.vercel.app/estetika/${e.slug||e.id}`)
    return `https://wa.me/${wa62}?text=${text}`
  }
  const waMaterial = (m)=>{
    const raw = '08979879518'.replace(/[^0-9]/g,'')
    const wa62 = raw.startsWith('0')? '62'+raw.slice(1) : raw
    const text = encodeURIComponent(`Halo Pasa Gadang, saya mau tanya ${m.nama} - ${m.brand} - Rp ${Number(m.harga||0).toLocaleString('id-ID')}\nLink: https://pasagadang-web.vercel.app/materials/${m.slug||m.id}`)
    return `https://wa.me/${wa62}?text=${text}`
  }
  const shareLink = (url, title)=>{
    if(navigator.share){ navigator.share({title, url}).catch(()=>{}) }
    else { navigator.clipboard.writeText(url); alert('Link disalin! '+url) }
  }

  const openZoom = (imgs, idx=0)=>{
    const clean = imgs.filter(Boolean)
    if(clean.length===0) return
    setZoomList(clean)
    setZoomIdx(idx)
  }
  const closeZoom = ()=>{ setZoomList([]); setZoomIdx(0) }
  const nextZoom = (e)=>{ e?.stopPropagation(); setZoomIdx(i=> (i+1)%zoomList.length ) }
  const prevZoom = (e)=>{ e?.stopPropagation(); setZoomIdx(i=> (i-1+zoomList.length)%zoomList.length ) }

  return (
    <main className={`${isDark? 'bg-[#0B0B0F] text-white' : 'bg-[#FFFBF0] text-black'} min-h-screen transition-colors duration-300`}>
      <style>{`
        @keyframes float{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.08)}}
        @keyframes dash{0%{stroke-dashoffset:24}100%{stroke-dashoffset:0}}
        @keyframes smokeUp{0%{transform:translateY(20px) translateX(0) scale(0.8) rotate(0deg);opacity:0}20%{opacity:0.8}100%{transform:translateY(-120px) translateX(15px) scale(2.2) rotate(25deg);opacity:0}}
        @keyframes smokeUp2{0%{transform:translateY(15px) translateX(0) scale(0.6);opacity:0}30%{opacity:0.7}100%{transform:translateY(-110px) translateX(-18px) scale(2) rotate(-20deg);opacity:0}}
        @keyframes goldPulse{0%,100%{box-shadow:0 0 0 3px #D4AF37,0 0 20px rgba(212,175,55,0.7),0 0 50px rgba(212,175,55,0.5),0 0 80px rgba(255,0,0,0.4);transform:scale(1) rotate(-18deg)}50%{box-shadow:0 0 0 4px #FFEB7F,0 0 40px rgba(212,175,55,1),0 0 80px rgba(212,175,55,0.8),0 0 120px rgba(255,50,50,0.6);transform:scale(1.08) rotate(-18deg)}}
        @keyframes shineSweep{0%{transform:translateX(-150%) skewX(-20deg)}100%{transform:translateX(200%) skewX(-20deg)}}
        @keyframes floatEpic{0%,100%{transform:translateY(0) rotate(-18deg)}50%{transform:translateY(-6px) rotate(-18deg)}}
       .scroll-hide::-webkit-scrollbar{display:none}.scroll-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

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

      {open && (
        <div className={`px-6 py-4 space-y-0 shadow-xl border-b ${isDark?'bg-[#121214] border-white/10':'bg-white border-black/5'}`}>
          <Link href="/properties" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>01 • PROPERTI</Link>
          <Link href="/estetika" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>02 • ESTETIKA</Link>
          <Link href="/materials" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>03 • MATERIAL</Link>
          <Link href="/blogs" onClick={()=>setOpen(false)} className={`flex justify-between items-center py-4 font-black text-[14px] border-b ${isDark?'border-white/10':'border-black/5'}`}>04 • BLOG</Link>
          <Link href="/admin/login" onClick={()=>setOpen(false)} className="w-full bg-black text-white py-4 rounded-full font-black text-[12px] tracking-widest flex items-center justify-center mt-4">LOGIN ADMIN</Link>
        </div>
      )}

      <div className="max-w-[400px] mx-auto px-6 pt-6">
        <TypewriterText isDark={isDark} />
        <div className="relative w-full h-[580px] mt-6">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 580">
            <line x1="170" y1="290" x2="170" y2="85" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite'}}/>
            <line x1="170" y1="290" x2="170" y2="495" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.3s'}}/>
            <line x1="170" y1="290" x2="45" y2="290" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.5s'}}/>
            <line x1="170" y1="290" x2="295" y2="290" stroke={isDark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"} strokeWidth="2" strokeDasharray="6 6" style={{animation:'dash 1s linear infinite 0.7s'}}/>
          </svg>
          <div className="absolute top-1/2 left-1/2 w-[82px] h-[82px] rounded-full flex flex-col items-center justify-center text-white font-black z-10" style={{background:COLORS.red, transform:'translate(-50%,-50%)', animation:'float 3s ease-in-out infinite', boxShadow: isDark? '0 0 0 8px #0B0B0F, 0 8px 30px rgba(178,34,34,0.5)' : '0 0 0 8px #FFFBF0, 0 8px 24px rgba(178,34,34,0.4)'}}>
            <div className="text-[8px] tracking-widest opacity-80">PA</div><div className="text-[13px] text-[#FFD700]">SAGA</div><div className="text-[8px]">DANG</div><div className="text-[6px] tracking-[0.3em] opacity-80">.COM</div>
          </div>
          <Link href="/properties" className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[200px] z-20">
            <div className={`p-3.5 rounded-[20px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${isDark?'bg-white text-black border-white':'bg-white text-black border-black/5'}`}>
              <div><div className="text-[10px] font-black opacity-50">01 • {sortedProperties.length} UNIT</div><div className="font-black text-[14px] mt-0.5">PROPERTI</div></div><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px]">→</div>
            </div>
          </Link>
          <Link href="/blogs" className="absolute top-1/2 left-0 -translate-y-1/2 w-[140px] z-30">
            <div className={`p-3.5 rounded-[18px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] ${isDark?'bg-[#1A1A1F] text-white border border-white/10':'bg-black text-white'}`}>
              <div><div className="text-[10px] font-bold opacity-60">04 • TIPS</div><div className="font-black text-[14px] mt-0.5">BLOG</div></div><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-[12px]">→</div>
            </div>
          </Link>
          <Link href="/estetika" className="absolute top-1/2 right-0 -translate-y-1/2 w-[140px] z-30">
            <div className={`p-3.5 rounded-[18px] flex justify-between items-center border shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${isDark?'bg-white text-black border-white':'bg-white text-black border-black/5'}`}>
              <div><div className="text-[10px] font-bold opacity-50">02 • ROSTER</div><div className="font-black text-[13px] mt-0.5">ESTETIKA</div></div><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px]">→</div>
            </div>
          </Link>
          <Link href="/materials" className="absolute bottom-[12px] left-1/2 -translate-x-1/2 w-[200px] z-20">
            <div className="p-3.5 rounded-[20px] flex justify-between items-center shadow-[0_8px_24px_rgba(0,0,0,0.2)]" style={{background:COLORS.gold}}>
              <div><div className="text-[10px] font-black opacity-70">03 • SEMEN, BESI</div><div className="font-black text-[14px] mt-0.5 text-black">MATERIAL</div></div><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px]">→</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-[400px] mx-auto px-6 pb-10 space-y-8 mt-2">
        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[16px]">PROPERTI <span style={{color:COLORS.gold}}>PROMO</span></h2><Link href="/properties" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-4 overflow-x-auto scroll-hide mt-4 pb-2">
            {properties.length===0? [1,2,3].map(i=><div key={i} className={`min-w-[260px] h-[380px] border rounded-[22px] animate-pulse ${isDark?'bg-white/5 border-white/10':'bg-white border-black/5'}`}></div>) :
            sortedProperties.map(p=>{
              const imgs = [p.thumbnail, p.foto_1, p.foto_2, p.foto_3, p.foto_4].filter(Boolean)
              const badgeRaw = (p.badge || '').toString()
              const isTerjual = badgeRaw.toLowerCase().includes('terjual') || (p.status_properti||'').toLowerCase().includes('terjual')
              return(
              <div key={p.id} className={`min-w-[270px] max-w-[270px] rounded-[24px] overflow-hidden flex flex-col relative ${isDark?'bg-[#121214]':'bg-white'}`} style={{border:'2.5px solid #D4AF37', boxShadow:'0 0 0 1px rgba(212,175,55,0.3), 0 10px 40px rgba(212,175,55,0.18)'}}>
                <div className="h-[210px] bg-zinc-800 relative overflow-hidden cursor-zoom-in group" onClick={()=>openZoom(imgs,0)}>
                  <img src={imgs[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.judul}/>
                  {badgeRaw &&!isTerjual && (
                    <div className="absolute top-3 left-3 z-20">
                      <div className="text-white text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase border border-white shadow-lg bg-gradient-to-r from-purple-600 to-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.8)]">
                        🔥 {badgeRaw.toUpperCase()}
                      </div>
                    </div>
                  )}

                  {/* STEMPEL EPIC BULAT ASAP MERAH-EMAS */}
                  {isTerjual && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-black/20">
                      <div className="absolute w-[180px] h-[180px] pointer-events-none">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70px] h-[70px] rounded-full bg-gradient-to-t from-[#FF0000] via-[#D4AF37] to-transparent blur-[12px] opacity-70" style={{animation:'smokeUp 2.2s ease-out infinite'}}></div>
                        <div className="absolute bottom-0 left-[45%] w-[50px] h-[80px] rounded-full bg-gradient-to-t from-[#B91C1C] via-[#FF7A00] to-[#FFEB7F] blur-[14px] opacity-60" style={{animation:'smokeUp2 2.8s ease-out infinite 0.4s'}}></div>
                        <div className="absolute bottom-0 right-[40%] w-[60px] h-[90px] rounded-full bg-gradient-to-t from-[#FF0000] via-[#D4AF37] to-transparent blur-[16px] opacity-50" style={{animation:'smokeUp 2.5s ease-out infinite 0.8s'}}></div>
                      </div>
                      <div className="absolute w-[160px] h-[160px] rounded-full bg-gradient-to-br from-[#FFEB7F] via-[#D4AF37] to-[#FF0000] blur-[18px] opacity-60 animate-pulse"></div>
                      <div className="relative w-[125px] h-[125px]" style={{animation:'floatEpic 2.5s ease-in-out infinite'}}>
                        <div className="absolute inset-0 rounded-full" style={{animation:'goldPulse 1.8s ease-in-out infinite'}}></div>
                        <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#FF3B3B,#B91C1C)] border-[3px] border-white flex flex-col items-center justify-center overflow-hidden" style={{boxShadow:'0 0 0 3px #D4AF37, inset 0 3px 10px rgba(255,255,255,0.4)', animation:'goldPulse 1.8s ease-in-out infinite'}}>
                          <div className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-60" style={{animation:'shineSweep 2.2s ease-in-out infinite'}}></div>
                          <div className="absolute inset-[6px] rounded-full border border-dashed border-white/70"></div>
                          <span className="text-[7px] font-black tracking-[0.35em] text-[#FFEB7F]">★ TERJUAL ★</span>
                          <span className="text-[20px] font-black text-white leading-none mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">TERJUAL</span>
                          <div className="w-[55%] h-[2px] bg-[#FFEB7F] mt-1 shadow-[0_0_8px_#FFEB7F]"></div>
                          <span className="text-[6px] font-bold tracking-[0.25em] text-white/90 mt-1">PASA GADANG</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="font-bold text-[14px] leading-tight line-clamp-2 min-h-[36px]">{p.judul}</div>
                  <div className="font-black text-[17px] mt-2" style={{color:COLORS.gold}}>Rp {Number(p.harga_cash||0).toLocaleString('id-ID')}</div>
                  <div className={`grid grid-cols-2 gap-2 mt-3 text-[10px] p-2.5 rounded-xl border ${isDark?'bg-white/5 border-white/10':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}>
                    <div className="bg-white/50 rounded-lg p-2 text-center"><div className="opacity-60 text-[9px] font-bold uppercase tracking-widest">Luas Tanah</div><div className="font-black text-[12px] mt-0.5">{p.luas_tanah||0}m²</div></div>
                    <div className="bg-white/50 rounded-lg p-2 text-center"><div className="opacity-60 text-[9px] font-bold uppercase tracking-widest">Luas Bangunan</div><div className="font-black text-[12px] mt-0.5">{p.luas_bangunan||0}m²</div></div>
                    <div className="bg-white/50 rounded-lg p-2 text-center"><div className="opacity-60 text-[9px] font-bold uppercase tracking-widest">Kamar Tidur</div><div className="font-black text-[12px] mt-0.5">{p.kamar_tidur||0} Kamar</div></div>
                    <div className="bg-white/50 rounded-lg p-2 text-center"><div className="opacity-60 text-[9px] font-bold uppercase tracking-widest">Kamar Mandi</div><div className="font-black text-[12px] mt-0.5">{p.kamar_mandi||0} Kamar</div></div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={waLink(p)} target="_blank" className="bg-[#25D366] text-white text-[11px] font-black py-2.5 rounded-full flex items-center justify-center gap-1.5">💬 WA</a>
                    <Link href={`/properties/${p.slug||p.id}`} className={`text-[11px] font-black py-2.5 rounded-full flex items-center justify-center border ${isDark?'bg-white text-black':'bg-black text-white'}`}>DETAIL</Link>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[14px]">ESTETIKA <span style={{color:COLORS.gold}}>ROSTER • GRANIT</span></h2><Link href="/estetika" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-4 overflow-x-auto scroll-hide mt-3 pb-2">
            {estetikas.map(e=>{
              const imgs = [e.foto_bahan_1, e.foto_bahan_2, e.foto_jadi_1, e.foto_jadi_2, e.foto_jadi_3].filter(Boolean)
              return(
              <div key={e.id} className={`min-w-[270px] max-w-[270px] rounded-[24px] overflow-hidden flex flex-col shrink-0 ${isDark?'bg-[#121214]':'bg-white'}`} style={{border:'2.5px solid #D4AF37', boxShadow:'0 0 0 1px rgba(212,175,55,0.3), 0 10px 40px rgba(212,175,55,0.18)'}}>
                <div className="h-[210px] grid grid-cols-2 cursor-zoom-in" onClick={()=>openZoom(imgs,0)}>
                  <div className="relative bg-[#FAF7F0]"><img src={e.foto_bahan_1} className="w-full h-full object-cover"/><span className="absolute bottom-2 left-2 bg-black text-white text-[8px] font-black px-2 py-1 rounded-full">BAHAN</span></div>
                  <div className="relative bg-black"><img src={e.foto_jadi_1||e.foto_bahan_1} className="w-full h-full object-cover"/><span className="absolute bottom-2 left-2 bg-[#D4AF37] text-black text-[8px] font-black px-2 py-1 rounded-full">TERPASANG</span><span className="absolute top-2 right-2 bg-black/60 text-white text-[8px] px-2 py-1 rounded-full">🔍 {imgs.length}</span></div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/estetika/${e.slug||e.id}`}><div className="font-bold text-[13px] leading-tight line-clamp-2 min-h-[32px]">{e.nama}</div></Link>
                  <div className="text-[10px] font-bold opacity-60 mt-1 uppercase">{e.kategori} • {e.ukuran}</div>
                  <div className="font-black text-[16px] mt-2" style={{color:COLORS.gold}}>Rp {Number(e.harga||0).toLocaleString('id-ID')} / {e.satuan}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={waEstetika(e)} target="_blank" className="bg-[#25D366] text-white text-[11px] font-black py-2.5 rounded-full flex items-center justify-center gap-1.5">💬 WA</a>
                    <button onClick={()=>shareLink(`https://pasagadang-web.vercel.app/estetika/${e.slug||e.id}`, e.nama)} className={`text-[11px] font-black py-2.5 rounded-full flex items-center justify-center border ${isDark?'bg-white text-black':'bg-black text-white'}`}>↗ BAGIKAN</button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center"><h2 className="font-black text-[14px]">MATERIAL <span style={{color:COLORS.gold}}>BANGUNAN</span></h2><Link href="/materials" className="text-[11px] font-bold">LIHAT SEMUA →</Link></div>
          <div className="flex gap-4 overflow-x-auto scroll-hide mt-3 pb-2">
            {materials.map(m=>{
              const imgs = [m.foto_1, m.foto_2, m.foto_3].filter(Boolean)
              return(
              <div key={m.id} className={`min-w-[270px] max-w-[270px] rounded-[24px] overflow-hidden flex flex-col shrink-0 ${isDark?'bg-[#121214]':'bg-white'}`} style={{border:'2.5px solid #D4AF37'}}>
                <div className="h-[210px] bg-white relative flex items-center justify-center p-4 cursor-zoom-in" onClick={()=>openZoom(imgs,0)}>
                  <img src={imgs[0]} className="w-full h-full object-contain"/>
                  <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-full">{m.kategori?.toUpperCase()} • {m.brand?.toUpperCase()}</div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-[9px] px-2 py-1 rounded-full">🔍 {imgs.length}</div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/materials/${m.slug||m.id}`}><div className="font-bold text-[13px] leading-tight line-clamp-2 min-h-[32px]">{m.nama}</div></Link>
                  <div className="text-[10px] font-bold opacity-60 mt-1">{m.brand}</div>
                  <div className="font-black text-[15px] mt-2" style={{color:COLORS.gold}}>Rp {Number(m.harga||0).toLocaleString('id-ID')}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={waMaterial(m)} target="_blank" className="bg-[#25D366] text-white text-[11px] font-black py-2.5 rounded-full flex items-center justify-center gap-1.5">💬 WA</a>
                    <button onClick={()=>shareLink(`https://pasagadang-web.vercel.app/materials/${m.slug||m.id}`, m.nama)} className={`text-[11px] font-black py-2.5 rounded-full flex items-center justify-center border ${isDark?'bg-white text-black':'bg-black text-white'}`}>↗ BAGIKAN</button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>

      <footer className={`${isDark?'bg-[#121214] border-white/10':'bg-black border-black/10'} border-t`}>
        <div className="max-w-[400px] mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <div className="flex font-black text-[22px] tracking-tight justify-center">
              <span style={{color:'#B22222'}}>PA</span>
              <span className="bg-gradient-to-b from-[#FFEB7F] via-[#D4AF37] to-[#8B6914] bg-clip-text text-transparent">SAGA</span>
              <span style={{color:'#B22222'}}>DANG</span>
            </div>
            <p className="text-[11px] font-bold tracking-[0.2em] mt-2 text-zinc-400">Jual Properti / Rumah di Padang, Sumatera Barat</p>
            <p className="text-[11px] mt-3 text-zinc-500 leading-relaxed">Mulai 300JT-an. Bahan estetik untuk properti cantikmu ada di sini. Spesialis Rumah Gadang Modern & Roster Minimalis #1 di Padang.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-[11px]">
            <div>
              <h4 className="font-black mb-3 text-[#D4AF37]">CARI DI PADANG</h4>
              <ul className="space-y-2 text-zinc-400 font-bold">
                <li><Link href="/properties?kecamatan=koto tangah" className="hover:text-white">Rumah di Koto Tangah</Link></li>
                <li><Link href="/properties?kecamatan=kuranji" className="hover:text-white">Rumah di Kuranji</Link></li>
                <li><Link href="/properties?kecamatan=lubuk begalung" className="hover:text-white">Rumah di Lubuk Begalung</Link></li>
                <li><Link href="/properties?kecamatan=pauh" className="hover:text-white">Rumah di Pauh</Link></li>
                <li><Link href="/properties?kecamatan=nanggalo" className="hover:text-white">Rumah di Nanggalo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-3 text-[#D4AF37]">MATERIAL</h4>
              <ul className="space-y-2 text-zinc-400 font-bold">
                <li><Link href="/estetika" className="hover:text-white">Roster Minimalis</Link></li>
                <li><Link href="/estetika" className="hover:text-white">Batu Alam & Granit</Link></li>
                <li><Link href="/materials" className="hover:text-white">Semen & Besi</Link></li>
                <li><Link href="/blogs" className="hover:text-white">Blog Properti Padang</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] text-zinc-500">📍 Padang, Sumatera Barat | WA 0897-9879-518</p>
            <p className="text-[9px] text-zinc-600 mt-2 tracking-widest">© 2026 PasaGadang.com - Jual Properti Rumah di Padang Sumatera Barat</p>
          </div>
        </div>
      </footer>

      {zoomList.length>0 && (
        <div onClick={closeZoom} className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <button onClick={closeZoom} className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full font-black z-10">X</button>
          <button onClick={prevZoom} className="absolute left-3 md:left-8 bg-white/20 hover:bg-white text-white hover:text-black w-10 h-10 rounded-full font-black text-[20px] backdrop-blur z-10">‹</button>
          <div className="relative max-w-full max-h-[85vh] flex flex-col items-center" onClick={e=>e.stopPropagation()}>
            <img src={zoomList[zoomIdx]} className="max-w-full max-h-[75vh] rounded-2xl object-contain border-2 border-[#D4AF37]"/>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-white text-[12px] font-bold tracking-widest">{zoomIdx+1} / {zoomList.length}</span>
              <div className="flex gap-1.5 ml-2">
                {zoomList.map((_,i)=><div key={i} className={`w-1.5 h-1.5 rounded-full ${i===zoomIdx?'bg-[#D4AF37] w-6':'bg-white/40'}`}></div>)}
              </div>
            </div>
          </div>
          <button onClick={nextZoom} className="absolute right-3 md:right-8 bg-white/20 hover:bg-white text-white hover:text-black w-10 h-10 rounded-full font-black text-[20px] backdrop-blur z-10">›</button>
        </div>
      )}
    </main>
  )
  }
