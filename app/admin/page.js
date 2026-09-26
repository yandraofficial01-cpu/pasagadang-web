'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL
const TABS = ['rumah','blog','material','estetika','pengunjung']

export default function Admin(){
  const [tab, setTab] = useState('rumah')
  const [data, setData] = useState([])
  const [form, setForm] = useState({})
  const [editId, setEditId] = useState(null)
  const router = useRouter()

  const getToken = () => document.cookie.split('admin_token=')[1]?.split(';')[0]

  const fetchData = async () => {
    const token = getToken()
    if(!token) return router.push('/login')
    // sesuaikan endpoint API lu, kalo beda tinggal ganti disini
    const endpoint = tab === 'pengunjung'? '/contacts' : `/${tab}`
    try{
      const res = await fetch(`${API}${endpoint}`, { headers: { Authorization: `Bearer ${token}` }})
      const j = await res.json()
      setData(Array.isArray(j)? j : j.data || [])
    }catch(e){ console.log(e) }
  }

  useEffect(()=>{ fetchData(); setForm({}); setEditId(null) },[tab])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = getToken()
    const endpoint = tab === 'pengunjung'? '/contacts' : `/${tab}`
    const url = editId? `${API}${endpoint}/${editId}` : `${API}${endpoint}`
    const method = editId? 'PUT' : 'POST'

    const fd = new FormData()
    Object.keys(form).forEach(k=> fd.append(k, form[k]))

    await fetch(url,{ method, headers:{ Authorization: `Bearer ${token}` }, body: tab==='blog' || tab==='rumah'? JSON.stringify(form) : fd })
    // fallback JSON untuk yang simple
    if(tab==='blog' || tab==='rumah'){
       await fetch(url,{ method, headers:{ Authorization: `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify(form) })
    }
    fetchData(); setForm({}); setEditId(null)
  }

  const handleDelete = async (id) => {
    if(!confirm('Hapus data ini?')) return
    const token = getToken()
    const endpoint = tab === 'pengunjung'? '/contacts' : `/${tab}`
    await fetch(`${API}${endpoint}/${id}`,{ method:'DELETE', headers:{ Authorization: `Bearer ${token}` }})
    fetchData()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-[20px] border border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black">P</div>
            <p className="font-black">PASA GADANG CMS</p>
          </div>
          <button onClick={()=>{document.cookie='admin_token=; path=/; max-age=0'; router.push('/login')}} className="bg-black text-white px-4 py-2 rounded-full text-xs font-black">LOGOUT</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-6 py-3 rounded-full text-[11px] font-black tracking-widest whitespace-nowrap transition ${tab===t? 'bg-black text-white' : 'bg-white border border-black/10'}`}>{t.toUpperCase()}</button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-6 mt-6">
          {/* Form Input */}
          <div className="bg-white p-6 rounded-[24px] border border-black/5 h-fit">
            <h3 className="font-black text-[13px] tracking-widest">{editId? 'EDIT' : 'TAMBAH'} {tab.toUpperCase()}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {tab==='rumah' && <>
                <input placeholder="Nama Rumah / Judul" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" required />
                <input placeholder="Harga (Rp)" value={form.price||''} onChange={e=>setForm({...form,price:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" />
                <input placeholder="Lokasi" value={form.location||''} onChange={e=>setForm({...form,location:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" />
                <textarea placeholder="Deskripsi" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm h-24" />
                <input placeholder="Link Gambar" value={form.image||''} onChange={e=>setForm({...form,image:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" />
              </>}
              {tab==='blog' && <>
                <input placeholder="Judul Blog" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" required />
                <input placeholder="Kategori" value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" />
                <textarea placeholder="Konten" value={form.content||''} onChange={e=>setForm({...form,content:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm h-40" />
              </>}
              {tab==='material' && <>
                <input placeholder="Nama Material" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" required />
                <input placeholder="Jenis / Tipe" value={form.type||''} onChange={e=>setForm({...form,type:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" />
                <input placeholder="Harga / Satuan" value={form.price||''} onChange={e=>setForm({...form,price:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" />
              </>}
              {tab==='estetika' && <>
                <input placeholder="Judul Estetika" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" required />
                <textarea placeholder="Deskripsi Estetika" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm h-32" />
                <input placeholder="Image URL" value={form.image||''} onChange={e=>setForm({...form,image:e.target.value})} className="w-full bg-[#FAF7F2] p-3 rounded-xl text-sm" />
              </>}
              {tab==='pengunjung' && <p className="text-xs text-zinc-500">Data pengunjung hanya bisa dihapus, tidak bisa ditambah dari sini (dari form landing page).</p>}

              {tab!=='pengunjung' && <button className="w-full bg-black text-white py-3 rounded-xl font-black text-xs tracking-widest">{editId? 'UPDATE' : 'SIMPAN'}</button>}
              {editId && <button type="button" onClick={()=>{setEditId(null); setForm({})}} className="w-full bg-white border py-3 rounded-xl font-black text-xs">BATAL</button>}
            </form>
          </div>

          {/* List Data */}
          <div className="bg-white p-6 rounded-[24px] border border-black/5">
            <h3 className="font-black text-[13px] tracking-widest">DATA {tab.toUpperCase()} ({data.length})</h3>
            <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto">
              {data.length===0 && <p className="text-center text-sm text-zinc-400 py-10">Belum ada data</p>}
              {data.map((item,i)=>(
                <div key={item.id || i} className="bg-[#FAF7F2] p-4 rounded-2xl flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.title || item.name || item.nama || item.email || 'No Title'}</p>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">{item.description || item.content || item.message || item.location || item.type || ''}</p>
                    {tab==='pengunjung' && <p className="text-[11px] mt-1">📞 {item.phone || item.no_hp} | {item.email}</p>}
                  </div>
                  <div className="flex gap-2">
                    {tab!=='pengunjung' && <button onClick={()=>{setForm(item); setEditId(item.id)}} className="bg-white border px-3 py-1.5 rounded-full text-[10px] font-bold">EDIT</button>}
                    <button onClick={()=>handleDelete(item.id)} className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold">HAPUS</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
          }
