'use client'
import { useEffect, useState } from 'react'

export default function GudangPage(){
  const [gudangs, setGudangs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('semua')

  useEffect(()=>{
    async function fetchGudang(){
      try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gudangs`)
        const data = await res.json()
        // BE lu balikin {data: []} atau [] langsung, handle dua-duanya
        setGudangs(Array.isArray(data)? data : data.data || [])
      }catch(e){
        console.log('Gagal fetch gudang', e)
      }finally{ setLoading(false) }
    }
    fetchGudang()
  },[])

  const filtered = filter==='semua'? gudangs : gudangs.filter(g=>g.tipe===filter)

  if(loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]"><p className="font-black animate-pulse">LOADING GUDANG...</p></div>

  return <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-10">
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="text-[11px] font-black tracking-[0.3em] text-[#C5A059]">JARINGAN GUDANG PASA GADANG</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-2">GUDANG<span className="text-[#C5A059]">.</span></h1>
          <p className="text-gray-500 mt-3 max-w-lg text-sm">Mitra & Pusat distribusi material & roster granit alam. Stok live, PIC jelas, bisa cek langsung.</p>
        </div>
        <div className="flex gap-2 h-fit">
          {[
            {id:'semua', label:'Semua'},
            {id:'pusat', label:'Pusat'},
            {id:'mitra', label:'Mitra'},
            {id:'cabang', label:'Cabang'},
          ].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} className={`px-5 py-2.5 rounded-full text-xs font-black border transition ${filter===f.id?'bg-black text-white border-black':'bg-white'}`}>{f.label.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        <div className="bg-black text-white p-6 rounded-[20px]"><p className="text-[10px] font-black text-white/50">TOTAL GUDANG</p><p className="text-3xl font-black mt-2">{gudangs.length}</p></div>
        <div className="bg-white border p-6 rounded-[20px]"><p className="text-[10px] font-black text-gray-400">GUDANG PUSAT</p><p className="text-3xl font-black mt-2">{gudangs.filter(g=>g.tipe==='pusat').length}</p></div>
        <div className="bg-white border p-6 rounded-[20px]"><p className="text-[10px] font-black text-gray-400">MITRA AKTIF</p><p className="text-3xl font-black mt-2">{gudangs.filter(g=>g.tipe==='mitra').length}</p></div>
        <div className="bg-[#C5A059] p-6 rounded-[20px]"><p className="text-[10px] font-black text-black/60">KECAMATAN</p><p className="text-3xl font-black mt-2">{[...new Set(gudangs.map(g=>g.kecamatan))].length}</p></div>
      </div>

      {/* LIST GUDANG */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {filtered.map((g)=>(
          <div key={g.id} className="group bg-white rounded-[28px] p-6 border hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${g.tipe==='pusat'?'bg-black text-white': g.tipe==='mitra'?'bg-[#C5A059] text-black':'bg-gray-100'}`}>{g.tipe?.toUpperCase()}</span>
              <span className={`w-2 h-2 rounded-full ${g.is_active?'bg-green-500':'bg-red-500'}`}></span>
            </div>
            <h3 className="font-black text-xl leading-tight mt-4 group-hover:tracking-tight transition-all">{g.name}</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{g.alamat || 'Alamat belum diisi'}</p>

            <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-gray-400">
              <span className="bg-gray-50 px-2 py-1 rounded-full">📍 {g.kecamatan || 'Padang'}</span>
              {g.share_stock_level && <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">LIVE STOCK</span>}
            </div>

            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-gray-400">PIC</p>
                <p className="font-bold text-sm">{g.pic_name || '-'}</p>
              </div>
              <a href={`https://wa.me/${g.wa_pic?.replace(/[^0-9]/g,'')}`} target="_blank" className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-black group-hover:bg-[#C5A059] group-hover:text-black transition">CHAT WA</a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length===0 && <div className="text-center py-20"><p className="font-black text-gray-400">Belum ada gudang untuk tipe {filter}</p></div>}
    </div>
  </main>
    }
