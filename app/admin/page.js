'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL
// TAB = nama folder, tapi endpoint beda
const TABS = [
  { label: 'PROPERTI', key: 'properti', endpoint: '/properties' },
  { label: 'MATERIAL', key: 'material', endpoint: '/materials' },
  { label: 'ESTETIKA', key: 'estetika', endpoint: '/estetikas' },
  { label: 'BLOG', key: 'blog', endpoint: '/blogs' },
  { label: 'PENGUNJUNG', key: 'pengunjung', endpoint: '/inquiries' },
]

export default function Admin(){
  const [tab, setTab] = useState(TABS[0])
  const [data, setData] = useState([])
  const [form, setForm] = useState({})
  const [editId, setEditId] = useState(null)
  const router = useRouter()
  const getToken = () => document.cookie.split('admin_token=')[1]?.split(';')[0]

  const fetchData = async () => {
    const token = getToken()
    if(!token) return router.push('/login')
    try{
      const res = await fetch(`${API}${tab.endpoint}`, { headers: { Authorization: `Bearer ${token}` }})
      const j = await res.json()
      setData(Array.isArray(j)? j : j.data || [])
    }catch(e){ console.log(e) }
  }

  useEffect(()=>{ fetchData(); setForm({}); setEditId(null) },[tab])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = getToken()
    const url = editId? `${API}${tab.endpoint}/${editId}` : `${API}${tab.endpoint}`
    await fetch(url,{
      method: editId? 'PUT' : 'POST',
      headers:{ Authorization: `Bearer ${token}`, 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    })
    fetchData(); setForm({}); setEditId(null)
  }

  const handleDelete = async (id) => {
    if(!confirm('Hapus data ini?')) return
    const token = getToken()
    await fetch(`${API}${tab.endpoint}/${id}`,{ method:'DELETE', headers:{ Authorization: `Bearer ${token}` }})
    fetchData()
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#E5E5E5] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center bg-[#16161E] p-4 rounded-2xl border border-white/10">
          <p className="font-black tracking-widest text-sm">PASA GADANG <span className="text-[#D4AF37]">CMS</span></p>
          <button onClick={()=>{document.cookie='admin_token=; path=/; max-age=0'; router.push('/login')}} className="bg-white text-black px-4 py-2 rounded-full text-xs font-black">LOGOUT</button>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t)} className={`px-6 py-3 rounded-full text-[11px] font-black tracking-widest ${tab.key===t.key? 'bg-[#D4AF37] text-black' : 'bg-[#16161E] border border-white/10 text-zinc-400'}`}>{t.label}</button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6 mt-6">
          <div className="bg-[#16161E] p-6 rounded-[24px] border border-white/10 h-fit max-h-[85vh] overflow-y-auto">
            <h3 className="font-black text-[12px] tracking-widest text-[#D4AF37]">{editId? 'EDIT' : 'TAMBAH'} {tab.label}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {/* PROPERTI - SESUAI MODEL Property */}
              {tab.key==='properti' && <>
                <input placeholder="Judul" value={form.judul||''} onChange={e=>setForm({...form,judul:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <div className="grid grid-cols-2 gap-2">
                  <select value={form.tipe_properti||'Rumah'} onChange={e=>setForm({...form,tipe_properti:e.target.value})} className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm"><option>Rumah</option><option>Rumah Gadang</option><option>Tanah</option><option>Ruko</option></select>
                  <select value={form.tipe_transaksi||'jual'} onChange={e=>setForm({...form,tipe_transaksi:e.target.value})} className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm"><option value="jual">Jual</option><option value="sewa">Sewa</option><option value="kredit">Kredit</option></select>
                </div>
                <input type="number" placeholder="Harga Cash" value={form.harga_cash||''} onChange={e=>setForm({...form,harga_cash:parseInt(e.target.value)||0})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <div className="grid grid-cols-4 gap-2">
                  <input type="number" placeholder="LT" value={form.luas_tanah||''} onChange={e=>setForm({...form,luas_tanah:parseInt(e.target.value)||0})} className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
                  <input type="number" placeholder="LB" value={form.luas_bangunan||''} onChange={e=>setForm({...form,luas_bangunan:parseInt(e.target.value)||0})} className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
                  <input type="number" placeholder="KT" value={form.kamar_tidur||''} onChange={e=>setForm({...form,kamar_tidur:parseInt(e.target.value)||0})} className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
                  <input type="number" placeholder="KM" value={form.kamar_mandi||''} onChange={e=>setForm({...form,kamar_mandi:parseInt(e.target.value)||0})} className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
                </div>
                <input placeholder="Alamat" value={form.alamat||''} onChange={e=>setForm({...form,alamat:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <input placeholder="Kecamatan" value={form.kecamatan||''} onChange={e=>setForm({...form,kecamatan:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <input placeholder="Thumbnail URL" value={form.thumbnail||''} onChange={e=>setForm({...form,thumbnail:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <textarea placeholder="Deskripsi" value={form.deskripsi||''} onChange={e=>setForm({...form,deskripsi:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-24"/>
                <input placeholder="WA Number" value={form.wa_number||''} onChange={e=>setForm({...form,wa_number:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_published||false} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publish</label>
              </>}

              {/* MATERIAL - SESUAI MODEL Material */}
              {tab.key==='material' && <>
                <input placeholder="Nama Material" value={form.nama||''} onChange={e=>setForm({...form,nama:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <input placeholder="Kategori" value={form.kategori||''} onChange={e=>setForm({...form,kategori:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <input placeholder="Brand" value={form.brand||''} onChange={e=>setForm({...form,brand:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <div className="grid grid-cols-2 gap-2"><input type="number" placeholder="Harga" value={form.harga||''} onChange={e=>setForm({...form,harga:parseInt(e.target.value)||0})} className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/><input placeholder="Satuan" value={form.satuan||'pcs'} onChange={e=>setForm({...form,satuan:e.target.value})} className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/></div>
                <input placeholder="Foto 1 URL" value={form.foto_1||''} onChange={e=>setForm({...form,foto_1:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <textarea placeholder="Deskripsi" value={form.deskripsi||''} onChange={e=>setForm({...form,deskripsi:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-24"/>
              </>}

              {/* ESTETIKA - SESUAI MODEL Estetika */}
              {tab.key==='estetika' && <>
                <input placeholder="Nama Estetika" value={form.nama||''} onChange={e=>setForm({...form,nama:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <input placeholder="Kategori" value={form.kategori||''} onChange={e=>setForm({...form,kategori:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <input type="number" placeholder="Harga" value={form.harga||''} onChange={e=>setForm({...form,harga:parseInt(e.target.value)||0})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <input placeholder="Foto Bahan 1 URL" value={form.foto_bahan_1||''} onChange={e=>setForm({...form,foto_bahan_1:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <input placeholder="Foto Jadi 1 URL" value={form.foto_jadi_1||''} onChange={e=>setForm({...form,foto_jadi_1:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <textarea placeholder="Deskripsi" value={form.deskripsi||''} onChange={e=>setForm({...form,deskripsi:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-24"/>
              </>}

              {/* BLOG - SESUAI MODEL Blog */}
              {tab.key==='blog' && <>
                <input placeholder="Judul Blog" value={form.judul||''} onChange={e=>setForm({...form,judul:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <input placeholder="Kategori" value={form.kategori||''} onChange={e=>setForm({...form,kategori:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required />
                <input placeholder="Thumbnail URL" value={form.thumbnail||''} onChange={e=>setForm({...form,thumbnail:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <input placeholder="Excerpt" value={form.excerpt||''} onChange={e=>setForm({...form,excerpt:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
                <textarea placeholder="Konten" value={form.konten||''} onChange={e=>setForm({...form,konten:e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-40" required />
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_published||false} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publish</label>
              </>}

              {tab.key!=='pengunjung'? <button className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs tracking-widest">{editId? 'UPDATE' : 'SIMPAN'}</button> : <p className="text-xs text-zinc-500">Hanya bisa hapus, data dari {tab.endpoint}</p>}
            </form>
          </div>

          <div className="bg-[#16161E] p-6 rounded-[24px] border border-white/10">
            <h3 className="font-black text-[12px] tracking-widest">DATA {tab.label} ({data.length}) - {tab.endpoint}</h3>
            <div className="mt-4 space-y-3 max-h-[75vh] overflow-y-auto">
              {data.map((item,i)=>(
                <div key={item.id || i} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.judul || item.nama || item.name || 'No Title'}</p>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{item.kecamatan || item.kategori || item.alamat || item.deskripsi || item.pesan || ''}</p>
                    {tab.key==='properti' && <p className="text-[11px] text-[#D4AF37] mt-1">Rp{item.harga_cash} | {item.tipe_properti}</p>}
                    {tab.key==='pengunjung' && <p className="text-[11px] text-[#D4AF37] mt-1">📞 {item.whatsapp} | {item.status} | {item.property_slug}</p>}
                  </div>
                  <div className="flex gap-2 h-fit">
                    {tab.key!=='pengunjung' && <button onClick={()=>{setForm(item); setEditId(item.id)}} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold">EDIT</button>}
                    <button onClick={()=>handleDelete(item.id)} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-bold">HAPUS</button>
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
