'use client'
import {useEffect,useState} from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

export default function Page(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({
    nama:'', kategori:'roster', ukuran:'', harga:'', satuan:'pcs',
    spesifikasi:'', deskripsi:'', badge:'', wa_number:'628979879518',
    foto_bahan_1:'', foto_bahan_2:'', foto_bahan_3:'',
    foto_jadi_1:'', foto_jadi_2:'', foto_jadi_3:'',
    harga_promo:'', is_active:true,
    slug:''
  })
  const [editId,setEditId]=useState(null)
  const [loading,setLoading]=useState(false)
  const [up,setUp]=useState('')
  const tok=()=>document.cookie.match(/admin_token=([^;]+)/)?.[1]||''

  const load=async()=>{
    const r=await fetch(`${API}/estetikas`,{headers:{Authorization:`Bearer ${tok()}`}, cache:'no-store'})
    const j=await r.json()
    setData(Array.isArray(j)?j:j.data||[])
  }
  useEffect(()=>{load()},[])

  const upload=async(field,file)=>{
    if(!file) return
    setUp(field)
    const fd=new FormData()
    fd.append('file',file)
    fd.append('upload_preset',PRESET)
    fd.append('folder',`pasa-gadang/estetika/${field.includes('bahan')?'bahan':'jadi'}`)
    const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:'POST',body:fd})
    const d=await res.json()
    if(d.secure_url) setForm(f=>({...f,[field]:d.secure_url}))
    else alert('Gagal upload: '+JSON.stringify(d))
    setUp('')
  }

  const resetForm=()=>{
    setForm({nama:'', kategori:'roster', ukuran:'', harga:'', satuan:'pcs', spesifikasi:'', deskripsi:'', badge:'', wa_number:'628979879518', foto_bahan_1:'', foto_bahan_2:'', foto_bahan_3:'', foto_jadi_1:'', foto_jadi_2:'', foto_jadi_3:'', harga_promo:'', is_active:true, slug:''})
    setEditId(null)
  }

  const cleanPayload = (f) => {
    const p = {
      nama: f.nama,
      kategori: f.kategori,
      ukuran: f.ukuran || null,
      harga: parseInt(f.harga)||0,
      satuan: f.satuan || 'pcs',
      spesifikasi: f.spesifikasi || null,
      deskripsi: f.deskripsi || null,
      badge: f.badge || null,
      wa_number: f.wa_number || '628979879518',
      harga_promo: f.harga_promo? parseInt(f.harga_promo) : null,
      is_active:!!f.is_active,
      foto_bahan_1: f.foto_bahan_1,
      foto_bahan_2: f.foto_bahan_2 || null,
      foto_bahan_3: f.foto_bahan_3 || null,
      foto_jadi_1: f.foto_jadi_1,
      foto_jadi_2: f.foto_jadi_2 || null,
      foto_jadi_3: f.foto_jadi_3 || null,
    }
    // Jangan kirim placeholder "FOTO JADI 3 URL" / string kosong
    Object.keys(p).forEach(k=>{
      if(typeof p[k]==='string' && (p[k].includes('FOTO JADI') || p[k].includes('Pilih File') || p[k].trim()==='')){
        if(k.includes('foto')) p[k]=null
      }
    })
    if(f.slug) p.slug = f.slug
    return p
  }

  const submit=async(e)=>{
    e.preventDefault()
    if(!form.nama ||!form.foto_bahan_1) return alert('Nama & Foto Bahan 1 wajib!')
    if(!form.foto_jadi_1) return alert('Foto Jadi 1 wajib bro - biar estetik laku!')
    setLoading(true)

    const payload = cleanPayload(form)

    try {
      let url = editId? `${API}/estetikas/${editId}` : `${API}/estetikas`
      let method = editId? 'PUT' : 'POST'

      console.log('UPDATE URL:', url, payload)
      let res = await fetch(url,{
        method,
        headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      })

      let text = await res.text()
      console.log('Response', res.status, text)

      if(!res.ok){
        // Fallback PATCH kalau PUT 404
        if(res.status===404 && editId){
          console.log('Coba PATCH...')
          res = await fetch(`${API}/estetikas/${editId}`,{
            method:'PATCH',
            headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
            body:JSON.stringify(payload)
          })
          text = await res.text()
          console.log('PATCH Response', res.status, text)
        }

        if(!res.ok){
          try{
            const j = JSON.parse(text)
            throw new Error(j.detail || text)
          }catch{
            throw new Error(text)
          }
        }
      }

      resetForm();
      await load()
    } catch(err){
      alert('GAGAL: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete=async(id)=>{
    if(!confirm('Yakin hapus estetika ini?')) return
    const res=await fetch(`${API}/estetikas/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}})
    if(res.ok) load()
    else alert('Gagal hapus: '+await res.text())
  }

  const handleEdit = (item) => {
    // PENTING: pakai id angka, bukan slug!
    console.log('Edit item:', item.id, item.slug)
    setForm({
      nama: item.nama || '',
      kategori: item.kategori || 'roster',
      ukuran: item.ukuran || '',
      harga: item.harga?.toString()||'',
      satuan: item.satuan || 'pcs',
      spesifikasi: item.spesifikasi || '',
      deskripsi: item.deskripsi || '',
      badge: item.badge || '',
      wa_number: item.wa_number || '628979879518',
      foto_bahan_1: item.foto_bahan_1 || '',
      foto_bahan_2: item.foto_bahan_2 || '',
      foto_bahan_3: item.foto_bahan_3 || '',
      foto_jadi_1: item.foto_jadi_1 || '',
      foto_jadi_2: item.foto_jadi_2 || '',
      foto_jadi_3: item.foto_jadi_3 || '',
      harga_promo: item.harga_promo?.toString()||'',
      is_active: item.is_active?? true,
      slug: item.slug || ''
    })
    setEditId(item.id) // FIX: id angka!
    window.scrollTo({top:0,behavior:'smooth'})
  }

  const inp="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]"
  const label="text-[10px] font-black tracking-widest text-white/40 mb-1"
  const Box=({field,title,req})=>(
    <div className="bg-black/40 border border-white/10 p-2.5 rounded-xl space-y-2">
      <p className="text-[10px] font-black tracking-widest text-zinc-400">{title} {req&&<span className="text-red-400">*</span>}</p>
      <input type="file" accept="image/*" onChange={e=>upload(field,e.target.files[0])} className="w-full text-[11px] text-zinc-400 file:mr-2 file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-full file:px-3 file:py-1 file:font-black file:text-[10px]"/>
      {up===field && <p className="text-[10px] text-[#D4AF37] animate-pulse">UPLOADING {field}...</p>}
      {form[field] && <img src={form[field]} className="w-full h-32 object-cover rounded-lg bg-white"/>}
      <input value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} className={inp} placeholder={`${title} URL`}/>
    </div>
  )

  return(
  <AdminLayout title={`ESTETIKA (${data.length}) - ${API}`}>
    <div className="flex gap-2 mb-4">
      <a href="/admin" className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full font-black text-[11px] hover:bg-white/20">← KEMBALI DASHBOARD</a>
      <a href="/estetika" target="_blank" className="bg-[#D4AF37] text-black px-4 py-2 rounded-full font-black text-[11px]">LIHAT WEB ↗</a>
      {editId && <button onClick={resetForm} className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full font-black text-[11px]">BATAL EDIT (ID:{editId})</button>}
    </div>

    <div className="grid lg:grid-cols-[420px_1fr] gap-6">
      <form onSubmit={submit} className="bg-[#16161E] border border-[#D4AF37]/20 p-5 rounded-[24px] space-y-3 h-fit sticky top-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center"><p className="text-[11px] font-black tracking-[0.3em] text-[#D4AF37]">{editId?`EDIT #${editId}`:'INPUT BARU'}</p><label className="text-[10px] font-black text-white flex gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/>AKTIF</label></div>

        <div><div className={label}>NAMA *</div><input value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} className={inp} placeholder="Roster Putih Minimalis"/></div>
        <div className="grid grid-cols-2 gap-2"><div><div className={label}>KATEGORI *</div><select value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className={inp}><option>roster</option><option>batu alam</option><option>granit</option><option>keramik</option><option>bata ekspos</option><option>ornamen</option></select></div><div><div className={label}>HARGA *</div><input type="number" value={form.harga} onChange={e=>setForm({...form,harga:e.target.value})} className={inp} placeholder="50000"/></div></div>
        <div className="grid grid-cols-2 gap-2"><div><div className={label}>SATUAN</div><input value={form.satuan} onChange={e=>setForm({...form,satuan:e.target.value})} className={inp} placeholder="pcs"/></div><div><div className={label}>BADGE</div><input value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})} className={inp} placeholder="TERLARIS"/></div></div>

        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl space-y-3">
          <p className="text-[11px] font-black text-[#D4AF37] tracking-widest">📦 FOTO BAHAN (foto_bahan_1,2,3)</p>
          <Box field="foto_bahan_1" title="FOTO BAHAN 1 UTAMA" req/><Box field="foto_bahan_2" title="FOTO BAHAN 2"/><Box field="foto_bahan_3" title="FOTO BAHAN 3"/>
        </div>
        <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-3">
          <p className="text-[11px] font-black text-white tracking-widest">🏠 FOTO JADI (foto_jadi_1,2,3) - Contoh Terpasang</p>
          <Box field="foto_jadi_1" title="FOTO JADI 1 UTAMA" req/><Box field="foto_jadi_2" title="FOTO JADI 2"/><Box field="foto_jadi_3" title="FOTO JADI 3"/>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>UKURAN</div><input value={form.ukuran} onChange={e=>setForm({...form,ukuran:e.target.value})} className={inp} placeholder="20x20"/></div>
          <div><div className={label}>HARGA PROMO</div><input type="number" value={form.harga_promo} onChange={e=>setForm({...form,harga_promo:e.target.value})} className={inp} placeholder="Kosongkan jika tidak promo"/></div>
        </div>
        <div><div className={label}>SPESIFIKASI</div><input value={form.spesifikasi} onChange={e=>setForm({...form,spesifikasi:e.target.value})} className={inp} placeholder="20x20 tebal 8cm, bahan beton"/></div>
        <div><div className={label}>DESKRIPSI</div><textarea value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} className={`${inp} h-20`} placeholder="Cocok untuk dinding cafe, pagar minimalis..."/></div>

        <div className="flex gap-2 pt-2">
          <button disabled={loading} className="flex-1 bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs hover:bg-[#E5C158]">{loading?'SIMPAN...':editId?`UPDATE ESTETIKA #${editId}`:'SIMPAN ESTETIKA'}</button>
          {editId && <button type="button" onClick={resetForm} className="bg-white/10 text-white px-6 py-3 rounded-xl font-black text-xs">BATAL</button>}
        </div>
      </form>

      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-3">
        <div className="flex justify-between items-center"><p className="text-[11px] font-black tracking-widest text-white/40">DAFTAR ESTETIKA</p><span className="text-[11px] font-bold text-white/30">{data.length} item • API: pasagadang-api.vercel.app</span></div>
        <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-1">
        {data.map(i=>(
          <div key={i.id} className="bg-black/60 border border-white/5 p-3 rounded-2xl flex gap-3 items-center hover:border-[#D4AF37]/30 transition">
            <img src={i.foto_bahan_1} className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"/>
            <img src={i.foto_jadi_1} className="w-14 h-14 rounded-xl object-cover bg-black border border-[#D4AF37]/30 shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{i.nama}</p>
              <p className="text-[11px] text-zinc-500 truncate">{i.kategori} • {i.slug} • ID:{i.id} {i.is_active?'• ✅ Aktif':'• ⛔ Nonaktif'}</p>
              <p className="text-[10px] font-bold text-[#D4AF37]">Rp{Number(i.harga).toLocaleString()}/{i.satuan}</p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button onClick={()=>handleEdit(i)} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-black text-white hover:bg-white/20">EDIT</button>
              <button onClick={()=>handleDelete(i.id)} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-black hover:bg-red-500/30">HAPUS</button>
            </div>
          </div>
        ))}
        {data.length===0 && <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl"><p className="text-white/30 font-black text-xs">Belum ada data</p><p className="text-white/20 text-[11px] mt-1">Input roster pertama bro!</p></div>}
        </div>
      </div>
    </div>
  </AdminLayout>)
}
