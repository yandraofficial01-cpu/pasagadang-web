'use client'
import {useEffect,useState} from 'react'
import AdminLayout from '../components/AdminLayout'
const API=process.env.NEXT_PUBLIC_API_URL
export default function Page(){
  const [data,setData]=useState([])
  const tok=()=>document.cookie.split('admin_token=')[1]?.split(';')[0]
  const load=async()=>{const r=await fetch(`${API}/inquiries`,{headers:{Authorization:`Bearer ${tok()}`}});const j=await r.json();setData(Array.isArray(j)?j:j.data||[])}
  useEffect(()=>{load()},[])
  return(<AdminLayout title={`PENGUNJUNG / INQUIRIES (${data.length})`}><div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] mt-4 space-y-3">{data.map(i=><div key={i.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex justify-between"><div><p className="text-sm font-bold">{i.nama} - {i.whatsapp}</p><p className="text-[11px] text-[#D4AF37]">Properti: {i.property_slug||'-'} | {i.status} | {i.sumber}</p><p className="text-xs mt-2 text-zinc-300">{i.pesan}</p><p className="text-[10px] text-zinc-500">{new Date(i.created_at).toLocaleString()}</p></div><button onClick={async()=>{if(!confirm('hapus?'))return;await fetch(`${API}/inquiries/${i.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] h-fit">HAPUS</button></div>)}</div></AdminLayout>)
}
