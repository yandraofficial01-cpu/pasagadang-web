'use client'
import {useEffect,useState} from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

export default function Page(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({
    judul:'', kategori:'', thumbnail:'', excerpt:'', konten:'', tags:'',
    is_published:false, meta_title:'', meta_description:''
  })
  const [editId,setEditId]=useState(null)
  const [loading,setLoading]=useState(false)
  const [up,setUp]=useState('')
  const tok=()=>document.cookie.match(/admin_token=([^;]+)/)?.[1]||''

  const load=async()=>{
    try{
      const r=await fetch(`${API}/blogs/?all=true`,{
        headers:{Authorization:`Bearer ${tok()}`},
        cache:'no-store'
      })
      const j=await r.json()
      setData(Array.isArray(j)?j:j.blogs||j.data||[])
    }catch(e){ console.error(e) }
  }
  useEffect(()=>{load()},[])

  const upload=async(field,file)=>{
    if(!file) return
    if(!CLOUD_NAME ||!PRESET) return alert('Cloudinary belum di-set di.env')
    setUp(field)
    const fd=new FormData()
    fd.append('file',file)
    fd.append('upload_preset',PRESET)
    fd.append('folder',`pasa-gadang/blog/${field}`)
    try{
      const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:'POST',body:fd})
      const d=await res.json()
      if(d.secure_url){
        // FOTO BESAR OTOMATIS
        const bigUrl = d.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')
        if(field==='konten_img'){
          const tag = `\n<img src="${bigUrl}" alt="${form.judul}" class="rounded-2xl my-6 w-full h-auto shadow-lg" loading="lazy" />\n`
          setForm(f=>({...f, konten: f.konten + tag}))
        } else {
          setForm(f=>({...f,[field]:bigUrl}))
        }
      } else alert('Gagal upload: '+JSON.stringify(d))
    }catch(e){ alert('Upload error: '+e.message) }
    setUp('')
  }

  const resetForm=()=>{
    setForm({judul:'',kategori:'',thumbnail:'',excerpt:'',konten:'',tags:'',is_published:false, meta_title:'', meta_description:''})
    setEditId(null)
  }

  const submit=async(e)=>{
    e.preventDefault()
    if(!form.judul ||!form.thumbnail) return alert('Judul & Thumbnail wajib!')
    if(!form.konten) return alert('Konten wajib!')
    setLoading(true)

    // Bersihin HTML buat meta description biar SEO #1
    const cleanText = form.konten.replace(/<[^>]*>?/gm, '').substring(0,160)

    const payload={
      judul: form.judul,
      kategori: form.kategori,
      thumbnail: form.thumbnail,
      excerpt: form.excerpt,
      konten: form.konten,
      tags: form.tags? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
      is_published: form.is_published,
      meta_title: form.meta_title || form.judul,
      meta_description: form.meta_description || form.excerpt || cleanText
    }

    const url = editId? `${API}/blogs/${editId}/` : `${API}/blogs/`
    const res=await fetch(url,{
      method:editId?'PUT':'POST',
      headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    })
    if(!res.ok){ alert(await res.text()); setLoading(false); return }
    resetForm(); load(); setLoading(false)
  }

  const inp="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]"
  const label="text-[10px] font-black tracking-widest text-white/40 mb-1"

  return(
  <AdminLayout title={`BLOG STUDIO (${data.length})`}>
    <div className="flex gap-2 mb-4">
      <a href="/admin" className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full font-black text-[11px]">← DASHBOARD</a>
      <a href="/blog" target="_blank" className="bg-[#D4AF37] text-black px-4 py-2 rounded-full font-black text-[11px]">LIHAT WEB ↗</a>
      {editId && <button onClick={resetForm} className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full font-black text-[11px]">BATAL EDIT</button>}
    </div>

    <div className="grid lg:grid-cols-[450px_1fr] gap-6 mt-4">
      <form onSubmit={submit} className="bg-[#16161E] border border-[#D4AF37]/20 p-5 rounded-[24px] space-y-3 h-fit sticky top-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <p className="text-[11px] font-black tracking-[0.3em] text-[#D4AF37]">{editId?`EDIT #${editId}`:'TULIS BARU'}</p>
          <label className="text-[10px] font-black text-white flex gap-2 cursor-pointer"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/>PUBLISH</label>
        </div>

        <div><div className={label}>JUDUL *</div><input value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})} className={inp} placeholder="Contoh: Harga Roster Minimalis di Padang 2026" required/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>KATEGORI *</div><input value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className={inp} placeholder="material" required/></div>
          <div><div className={label}>TAGS (pisah koma)</div><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className={inp} placeholder="roster, padang, tahan gempa"/></div>
        </div>

        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl space-y-3">
          <p className="text-[11px] font-black text-[#D4AF37] tracking-widest">🖼️ GAMBAR UTAMA (Thumbnail) *</p>
          <input type="file" accept="image/*" onChange={e=>upload('thumbnail',e.target.files[0])} className="w-full text-[11px] text-zinc-400 file:mr-2 file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-full file:px-3 file:py-1 file:font-black file:text-[10px]"/>
          {up==='thumbnail' && <p className="text-[10px] text-[#D4AF37] animate-pulse">UPLOADING...</p>}
          {form.thumbnail && <img src={form.thumbnail} className="w-full h-64 object-cover rounded-xl border border-[#D4AF37]/20"/>}
          <input value={form.thumbnail} onChange={e=>setForm({...form,thumbnail:e.target.value})} className={inp} placeholder="URL Cloudinary"/>
        </div>

        <div><div className={label}>EXCERPT (buat Google)</div><input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} className={inp} placeholder="Ringkasan 1 kalimat yang muncul di Google"/></div>

        <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black text-white tracking-widest">📝 KONTEN (Foto jadi besar otomatis)</p>
            <label className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-black cursor-pointer">
              {up==='konten_img'?'Uploading...':'+ Gambar Isi Besar'}
              <input type="file" accept="image/*" className="hidden" onChange={e=>upload('konten_img',e.target.files[0])}/>
            </label>
          </div>
          <textarea value={form.konten} onChange={e=>setForm({...form,konten:e.target.value})} className={`${inp} h-64 font-mono text-xs`} placeholder="Tulis artikel... setiap upload gambar otomatis jadi BESAR w-full"/>
          <p className="text-[9px] text-white/30">Tips SEO: Gambar otomatis w_1200 biar tajam di Google & HP</p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <input value={form.meta_title} onChange={e=>setForm({...form,meta_title:e.target.value})} className={inp} placeholder="Meta Title (kosongkan = pakai judul)"/>
          <input value={form.meta_description} onChange={e=>setForm({...form,meta_description:e.target.value})} className={inp} placeholder="Meta Description (kosongkan = pakai excerpt)"/>
        </div>

        <button disabled={loading} className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs hover:bg-[#c9a227]">{loading?'SIMPAN...':editId?'UPDATE ARTIKEL':'SIMPAN & PUBLISH'}</button>
      </form>

      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-2">
        <p className="text-[11px] font-black tracking-widest text-white/40">DAFTAR ARTIKEL ({data.length})</p>
        <div className="space-y-2 max-h-[80vh] overflow-y-auto">
        {data.map(i=>(
          <div key={i.id} className="bg-black/60 border border-white/5 p-3 rounded-2xl flex gap-3 items-center">
            <img src={i.thumbnail} className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{i.judul}</p>
              <p className="text-[11px] text-zinc-500">{i.kategori} • {i.is_published?'✅ Publish':'⛔ Draft'} • {i.views||0} views</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={()=>{setForm({judul:i.judul||'',kategori:i.kategori||'',thumbnail:i.thumbnail||'',excerpt:i.excerpt||'',konten:i.konten||'',tags:Array.isArray(i.tags)?i.tags.join(', '):i.tags||'',is_published:!!i.is_published,meta_title:i.meta_title||'',meta_description:i.meta_description||''}); setEditId(i.id); window.scrollTo({top:0,behavior:'smooth'})}} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-black text-white hover:bg-white/20">EDIT</button>
              <button onClick={async()=>{if(!confirm('Hapus?'))return; await fetch(`${API}/blogs/${i.id}/`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-black hover:bg-red-500/30">HAPUS</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  </AdminLayout>
  )
        }
