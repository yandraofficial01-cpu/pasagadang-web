'use client'
import {useEffect,useState} from 'react'
import AdminLayout from '../components/AdminLayout'

export const dynamic = 'force-dynamic'
const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

export default function PengunjungPage(){
  const [inq,setInq]=useState([])
  const [props,setProps]=useState([])
  const [filter,setFilter]=useState('semua')
  const [loading,setLoading]=useState(true)
  const tok=()=>document.cookie.match(/admin_token=([^;]+)/)?.[1]||''

  const load=async()=>{
    setLoading(true)
    try {
      // NOTE: harus pakai trailing slash / di FastAPI
      const r1=await fetch(`${API}/inquiries/`,{headers:{Authorization:`Bearer ${tok()}`}, cache:'no-store'})
      const j1=await r1.json().catch(()=>[])
      setInq(Array.isArray(j1)?j1:j1.data||j1.items||[])

      const r2=await fetch(`${API}/properties/`,{headers:{Authorization:`Bearer ${tok()}`}, cache:'no-store'})
      const j2=await r2.json().catch(()=>[])
      setProps(Array.isArray(j2)?j2:j2.data||[])
    } catch(e){ console.error(e) }
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  const filtered = filter==='semua'? inq : inq.filter(i=>i.status===filter)

  const updateStatus=async(id,status)=>{
    const res=await fetch(`${API}/inquiries/${id}`,{
      method:'PATCH',
      headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
      body:JSON.stringify({status})
    })
    if(!res.ok) alert('Gagal update: '+await res.text())
    else load()
  }

  const hapus=async(id)=>{
    if(!confirm('Hapus inquiry ini?')) return
    const res=await fetch(`${API}/inquiries/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}})
    if(!res.ok) alert('Gagal hapus: '+await res.text())
    load()
  }

  const totalViews = props.reduce((a,b)=>a+(b.views||0),0)
  const today = inq.filter(i=> new Date(i.created_at).toDateString()===new Date().toDateString()).length

  return(
  <AdminLayout title={`PENGUNJUNG (${inq.length})`}>
    <div className="flex gap-2 mb-4">
      <a href="/admin" className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full font-black text-[11px]">← DASHBOARD</a>
      <button onClick={load} className="bg-[#D4AF37] text-black px-4 py-2 rounded-full font-black text-[11px]">REFRESH ↻</button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div className="bg-[#16161E] border border-[#D4AF37]/20 p-4 rounded-2xl"><p className="text-[10px] font-black tracking-widest text-white/40">TOTAL INQUIRY</p><p className="text-2xl font-black text-white">{loading?'...':inq.length}</p></div>
      <div className="bg-[#16161E] border border-white/10 p-4 rounded-2xl"><p className="text-[10px] font-black tracking-widest text-white/40">HARI INI</p><p className="text-2xl font-black text-white">{loading?'...':today}</p></div>
      <div className="bg-[#16161E] border border-white/10 p-4 rounded-2xl"><p className="text-[10px] font-black tracking-widest text-white/40">TOTAL VIEWS</p><p className="text-2xl font-black text-white">{totalViews}</p></div>
      <div className="bg-[#16161E] border border-white/10 p-4 rounded-2xl"><p className="text-[10px] font-black tracking-widest text-white/40">NEW</p><p className="text-2xl font-black text-[#D4AF37]">{inq.filter(i=>i.status==='new').length}</p></div>
    </div>

    <div className="flex gap-2 mb-4">
      {['semua','new','contacted','closed'].map(s=>(
        <button key={s} onClick={()=>setFilter(s)} className={`px-4 py-2 rounded-full font-black text-[11px] border ${filter===s?'bg-[#D4AF37] text-black':'bg-white/5 text-white/60 border-white/10'}`}>{s.toUpperCase()}</button>
      ))}
    </div>

    <div className="bg-[#16161E] border border-white/10 rounded-[24px] p-5">
      <p className="text-[11px] font-black tracking-widest text-white/40 mb-3">DAFTAR PENGUNJUNG YANG NANYA</p>
      <div className="space-y-2 max-h-[70vh] overflow-y-auto">
        {filtered.map(i=>(
          <div key={i.id} className="bg-black/60 border border-white/5 p-4 rounded-2xl flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center font-black text-[#D4AF37]">{i.nama?.[0]?.toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white">{i.nama} <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10">{i.status}</span></p>
              <p className="text-[11px] text-[#D4AF37]">WA: {i.whatsapp} • {i.property_slug}</p>
              <p className="text-[11px] text-zinc-400">{i.pesan}</p>
              <p className="text-[10px] text-white/30">{new Date(i.created_at).toLocaleString('id-ID')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <a href={`https://wa.me/${(i.whatsapp||'').replace(/[^0-9]/g,'')}`} target="_blank" className="bg-green-500 text-black px-3 py-1.5 rounded-full text-[10px] font-black text-center">WA</a>
              <button onClick={()=>updateStatus(i.id,'contacted')} className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px]">CONTACTED</button>
              <button onClick={()=>hapus(i.id)} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px]">HAPUS</button>
            </div>
          </div>
        ))}
        {!loading && filtered.length===0 && <p className="text-center py-12 text-white/30 text-xs">Belum ada inquiry. Cek apakah BE sudah ada router /inquiries/</p>}
      </div>
    </div>
  </AdminLayout>)
  }
