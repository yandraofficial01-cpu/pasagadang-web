'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL

export default function PropertiPage(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({title:'',price:'',location:'',description:'',image:''})
  const [editId,setEditId]=useState(null)

  const getToken = () => document.cookie.split('admin_token=')[1]?.split(';')[0]

  const fetchData = async ()=>{
    const token=getToken()
    const res=await fetch(`${API}/properties`,{headers:{Authorization:`Bearer ${token}`}})
    const j=await res.json();
    setData(Array.isArray(j)?j:j.data||[])
  }
  useEffect(()=>{fetchData()},[])

  const submit = async (e)=>{
    e.preventDefault()
    const token=getToken()
    const url=editId?`${API}/properties/${editId}`:`${API}/properties`
    const method=editId?'PUT':'POST'
    await fetch(url,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(form)})
    fetchData(); setForm({title:'',price:'',location:'',description:'',image:''}); setEditId(null)
  }

  return (
    <AdminLayout title="KELOLA PROPERTI">
      <div className="grid lg:grid-cols-[360px_1fr] gap-6 mt-4">
        <form onSubmit={submit} className="bg-[#16161E] border border-white/10 p-6 rounded-[24px] h-fit space-y-3">
          <p className="text-[11px] font-black tracking-widest text-[#D4AF37]">{editId?'EDIT PROPERTI':'TAMBAH PROPERTI'}</p>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Nama Properti / Judul" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
          <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Harga (Rp)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" />
          <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Lokasi" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" />
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Deskripsi Lengkap" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-24" />
          <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Link Gambar Utama" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" />
          <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-300 text-black py-3 rounded-xl font-black text-xs tracking-widest">{editId?'UPDATE':'SIMPAN'}</button>
          {editId && <button type="button" onClick={()=>{setEditId(null);setForm({title:'',price:'',location:'',description:'',image:''})}} className="w-full bg-white/10 py-3 rounded-xl font-black text-xs">BATAL</button>}
        </form>

        <div className="bg-[#16161E] border border-white/10 p-6 rounded-[24px]">
          <p className="font-black text-xs">DATA PROPERTI ({data.length})</p>
          <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {data.length===0 && <p className="text-center text-sm text-zinc-500 py-10">Belum ada properti, coba tambah</p>}
            {data.map(item=>(
              <div key={item.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex justify-between gap-3">
                <div className="flex-1"><p className="font-bold text-sm">{item.title}</p><p className="text-[11px] text-zinc-500 line-clamp-1">{item.location} - Rp{item.price}</p></div>
                <div className="flex gap-2">
                  <button onClick={()=>{setForm(item);setEditId(item.id)}} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold">EDIT</button>
                  <button onClick={async()=>{if(!confirm('hapus properti ini?'))return; const t=getToken(); await fetch(`${API}/properties/${item.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}}); fetchData()}} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-bold">HAPUS</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
                     }
