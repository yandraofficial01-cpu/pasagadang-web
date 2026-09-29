'use client'
import {useEffect,useState} from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

export default function Page(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({
    nama:'', kategori:'', brand:'',
    foto_1:'', foto_2:'', foto_3:'',
    spesifikasi:'', ukuran:'',
    harga:'', satuan:'sak', stok_minimum:10,
    wa_number:'628979879518', deskripsi:'',
    badge:'', harga_promo:'', is_active:true
  })
  const [editId,setEditId]=useState(null)
  const [loading,setLoading]=useState(false)
  const [up,setUp]=useState('')

  const tok=()=>document.cookie.match(/admin_token=([^;]+)/)?.[1]||''

  const load=async()=>{
    try{
      const r=await fetch(`${API}/materials`,{
        headers:{Authorization:`Bearer ${tok()}`},
        cache:'no-store'
      })
      const j=await r.json()
      const arr = Array.isArray(j)? j : j.data || []
      setData(arr)
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{load()},[])

  const upload=async(field,file)=>{
    if(!file) return
    if(!CLOUD_NAME ||!PRESET) return alert('Cloudinary ENV belum di set di Vercel!')
    setUp(field)
    try{
      const fd=new FormData()
      fd.append('file',file)
      fd.append('upload_preset',PRESET)
      fd.append('folder','pasa-gadang/material')
      const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:'POST',body:fd})
      const d=await res.json()
      if(d.secure_url) setForm(f=>({...f,[field]:d.secure_url}))
      else alert('Gagal upload: '+JSON.stringify(d))
    }catch{ alert('Error upload') }
    setUp('')
  }

  const resetForm=()=>{
    setForm({nama:'',kategori:'',brand:'',foto_1:'',foto_2:'',foto_3:'',spesifikasi:'',ukuran:'',harga:'',satuan:'sak',stok_minimum:10,wa_number:'628979879518',deskripsi:'',badge:'',harga_promo:'',is_active:true})
    setEditId(null)
  }

  const submit=async(e)=>{
    e.preventDefault()
    if(!form.nama ||!form.kategori ||!form.harga) return alert('Nama, Kategori, Harga wajib!')
    if(!form.foto_1) return alert('Foto 1 wajib!')
    setLoading(true)
    try{
      const slug = form.nama.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
      const payload={
       ...form,
        slug,
        harga:parseInt(form.harga)||0,
        harga_promo:form.harga_promo?parseInt(form.harga_promo):null,
        stok_minimum:parseInt(form.stok_minimum)||10,
        is_active:!!form.is_active
      }
      const res=await fetch(editId?`${API}/materials/${editId}`:`${API}/materials`,{
        method:editId?'PUT':'POST',
        headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      })
      if(!res.ok) throw new Error(await res.text())
      resetForm(); await load()
    }catch(err){ alert('Gagal simpan: '+err.message) }
    setLoading(false)
  }

  const edit=(item)=>{
    setForm({
      nama:item.nama||'',kategori:item.kategori||'',brand:item.brand||'',foto_1:item.foto_1||'',foto_2:item.foto_2||'',foto_3:item.foto_3||'',spesifikasi:item.spesifikasi||'',ukuran:item.ukuran||'',harga:item.harga?.toString()||'',satuan:item.satuan||'sak',stok_minimum:item.stok_minimum||10,wa_number:item.wa_number||'',deskripsi:item.deskripsi||'',badge:item.badge||'',harga_promo:item.harga_promo?.toString()||'',is_active:item.is_active??true
    })
    setEditId(item.id)
    window.scrollTo({top:0,behavior:'smooth'})
  }

  const inp="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]"
  const label="text-[10px] font-black tracking-widest text-white/40 mb-1 ml-1"

  const FieldUpload=({field, lab, req})=>(
    <div className="bg-black/40 border border-white/5 p-2.5 rounded-xl space-y-2">
      <p className="text-[10px] font-black tracking-widest text-zinc-400">{lab} {req&&<span className="text-red-400">*</span>}</p>
      <input type="file" accept="image/*" onChange={e=>upload(field,e.target.files[0])} className="w-full text-[11px] text-zinc-400 file:mr-2 file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-full file:px-3 file:py-1 file:font-black file:text-[10px]"/>
      {up===field && <p className="text-[10px] text-[#D4AF37] animate-pulse">UPLOADING...</p>}
      {form[field] && <img src={form[field]} className="w-full h-32 object-contain bg-white rounded-lg border border-white/10"/>}
      <input value={form[field]||''} onChange={e=>setForm({...form,[field]:e.target.value})} placeholder={`${lab} URL`} className={inp}/>
    </div>
  )

  return(
  <AdminLayout title={`MATERIAL (${data.length})`}>
    <div className="grid lg:grid-cols-[400px_1fr] gap-6 mt-4">
      <form onSubmit={submit} className="bg-[#16161E] border border-[#D4AF37]/20 p-5 rounded-[24px] space-y-3 h-fit sticky top-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="text-[11px] font-black tracking-[0.3em] text-[#D4AF37]">{editId?'EDIT MATERIAL':'INPUT BARU'}</div>
          <label className="flex items-center gap-2 text-[10px] font-black text-white"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/> AKTIF</label>
        </div>

        <div><div className={label}>NAMA MATERIAL *</div><input value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} placeholder="Semen Padang 50kg" className={inp} required/></div>

        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>KATEGORI *</div><input value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value.toLowerCase()})} placeholder="semen" className={inp} required/></div>
          <div><div className={label}>BRAND</div><input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} placeholder="Semen Padang" className={inp}/></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div><div className={label}>HARGA *</div><input type="number" value={form.harga} onChange={e=>setForm({...form,harga:e.target.value})} className={inp} required/></div>
          <div><div className={label}>HARGA PROMO</div><input type="number" value={form.harga_promo} onChange={e=>setForm({...form,harga_promo:e.target.value})} className={inp}/></div>
          <div><div className={label}>SATUAN</div><select value={form.satuan} onChange={e=>setForm({...form,satuan:e.target.value})} className={inp}><option>sak</option><option>pcs</option><option>dus</option><option>meter</option><option>kg</option><option>roll</option><option>buah</option></select></div>
        </div>

        <div className="bg-black/30 p-3 rounded-xl space-y-3">
          <p className="text-[10px] tracking-widest text-[#D4AF37] font-black">FOTO - AUTO CLOUDINARY</p>
          <FieldUpload field="foto_1" lab="FOTO 1 UTAMA" req />
          <FieldUpload field="foto_2" lab="FOTO 2" />
          <FieldUpload field="foto_3" lab="FOTO 3" />
        </div>

        <div><div className={label}>SPESIFIKASI</div><input value={form.spesifikasi} onChange={e=>setForm({...form,spesifikasi:e.target.value})} className={inp}/></div>
        <div><div className={label}>DESKRIPSI</div><textarea value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} className={`${inp} h-20`}/></div>

        <div className="flex gap-2">
          <button disabled={loading} className="flex-1 bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs">{loading?'MENYIMPAN...':editId?'UPDATE':'SIMPAN MATERIAL'}</button>
          {editId && <button type="button" onClick={resetForm} className="bg-white/10 text-white px-5 py-3 rounded-xl font-black text-xs">BATAL</button>}
        </div>
      </form>

      {/* LIST KAYAK PROPERTI */}
      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-3">
        <div className="text-[11px] font-black tracking-widest text-white/40 mb-3">DAFTAR MATERIAL ({data.length}) - {API}</div>
        {data.map(i=>(
          <div key={i.id} className="bg-black/60 border border-white/5 p-3 rounded-2xl flex gap-3 items-center">
            <img src={i.foto_1||'https://via.placeholder.com/60'} className="w-[64px] h-[64px] rounded-xl object-cover bg-white shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-black text-white truncate">{i.nama}</p>
              <p className="text-[11px] text-zinc-400">{i.kategori} | {i.brand} | Rp{Number(i.harga||0).toLocaleString()}/{i.satuan}</p>
              <p className="text-[11px]">{i.is_active? '✅ Aktif' : '❌ Nonaktif'} | {i.slug}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={()=>edit(i)} className="bg-white/10 px-4 py-1.5 rounded-full text-[11px] font-black text-white">EDIT</button>
              <button onClick={async()=>{if(!confirm('Hapus '+i.nama+'?'))return; await fetch(`${API}/materials/${i.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-[11px] font-black">HAPUS</button>
            </div>
          </div>
        ))}
        {data.length===0 && <p className="text-center py-10 text-white/30 font-black text-xs">Belum ada data di {API}/materials - cek ENV NEXT_PUBLIC_API_URL</p>}
      </div>
    </div>
  </AdminLayout>)
    }
