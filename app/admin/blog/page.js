'use client'
import {useEffect,useState} from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

export default function Page(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({
    judul:'', slug:'', kategori:'', thumbnail:'', excerpt:'', konten:'', tags:'',
    is_published:false, meta_title:'', meta_description:'', focus_keyword:''
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

  // --- HELPER SEO ---
  const makeSlug = (s)=> s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')
  const wordCount = form.konten.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length
  const seoStatus = wordCount >= 900? '✅ SEO BAGUS' : wordCount >= 500? '⚠️ KURANG' : '❌ TIPIS BANGET'

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
    setForm({judul:'',slug:'',kategori:'',thumbnail:'',excerpt:'',konten:'',tags:'',is_published:false, meta_title:'', meta_description:'', focus_keyword:''})
    setEditId(null)
  }

  const submit=async(e)=>{
    e.preventDefault()
    if(!form.judul ||!form.thumbnail) return alert('Judul & Thumbnail wajib!')
    if(!form.konten) return alert('Konten wajib!')
    if(wordCount < 300) return alert(`Artikel masih ${wordCount} kata, minimal 500 kata biar SEO! Sekarang masih ${seoStatus}`)
    setLoading(true)

    const cleanText = form.konten.replace(/<[^>]*>?/gm, '').substring(0,160)
    const finalSlug = form.slug || makeSlug(form.judul)

    const payload={
      judul: form.judul,
      slug: finalSlug,
      kategori: form.kategori,
      thumbnail: form.thumbnail,
      excerpt: form.excerpt,
      konten: form.konten,
      tags: form.tags || "",
      is_published: form.is_published,
      meta_title: form.meta_title || form.judul,
      meta_description: form.meta_description || form.excerpt || cleanText,
      focus_keyword: form.focus_keyword || ""
    }

    const url = editId? `${API}/blogs/${editId}/` : `${API}/blogs/`
    const res=await fetch(url,{
      method:editId?'PUT':'POST',
      headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    })
    if(!res.ok){
      const err = await res.text()
      alert(err)
      setLoading(false)
      return
    }
    resetForm()
    load()
    setLoading(false)
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

        {/* SEO LIVE BAR */}
        <div className={`p-2.5 rounded-xl border text-[10px] font-black flex justify-between ${wordCount>=900?'bg-green-500/20 border-green-500/30 text-green-400':'bg-red-500/20 border-red-500/30 text-red-400'}`}>
          <span>{wordCount} KATA</span><span>{seoStatus}</span><span className="opacity-60">TARGET 900+</span>
        </div>

        <div><div className={label}>JUDUL *</div><input value={form.judul} onChange={e=>setForm({...form,judul:e.target.value, slug: makeSlug(e.target.value), meta_title: e.target.value.substring(0,60)})} className={inp} placeholder="5 Cara Aman Beli Rumah di Padang Biar Gak Kena Tipu" required/></div>

        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>SLUG (URL SEO) *</div><input value={form.slug} onChange={e=>setForm({...form,slug:makeSlug(e.target.value)})} className={inp} placeholder="cara-aman-beli-rumah-di-padang"/></div>
          <div><div className={label}>FOCUS KEYWORD</div><input value={form.focus_keyword} onChange={e=>setForm({...form,focus_keyword:e.target.value})} className={inp} placeholder="beli rumah di Padang"/></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>KATEGORI *</div><input value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className={inp} placeholder="properti" required/></div>
          <div><div className={label}>TAGS</div><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className={inp} placeholder="rumah tahan gempa padang"/></div>
        </div>

        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl space-y-3">
          <p className="text-[11px] font-black text-[#D4AF37] tracking-widest">🖼️ GAMBAR UTAMA *</p>
          <input type="file" accept="image/*" onChange={e=>upload('thumbnail',e.target.files[0])} className="w-full text-[11px] text-zinc-400 file:mr-2 file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-full file:px-3 file:py-1 file:font-black file:text-[10px]"/>
          {up==='thumbnail' && <p className="text-[10px] text-[#D4AF37] animate-pulse">UPLOADING...</p>}
          {form.thumbnail && <img src={form.thumbnail} className="w-full h-64 object-cover rounded-xl border border-[#D4AF37]/20"/>}
        </div>

        <div><div className={label}>EXCERPT (buat Google - 1 kalimat)</div><input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value, meta_description:e.target.value.substring(0,160)})} className={inp} placeholder="Takut kena tipu developer? Ini cara aman beli rumah..."/></div>

        <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black text-white tracking-widest">📝 KONTEN</p>
            <label className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-black cursor-pointer">
              {up==='konten_img'?'Uploading...':'+ Gambar'}
              <input type="file" accept="image/*" className="hidden" onChange={e=>upload('konten_img',e.target.files[0])}/>
            </label>
          </div>
          <textarea value={form.konten} onChange={e=>setForm({...form,konten:e.target.value})} className={`${inp} h-64 font-mono text-xs`} placeholder="Minimal 900 kata biar SEO..."/>
          <p className="text-[9px] text-zinc-500">Tips: Artikel lu yang 311 kata tadi paste di sini, bakal merah. Tambahin FAQ & tabel biar jadi 900+.</p>
        </div>

        <div className="grid grid-cols-1 gap-2 bg-black/30 p-3 rounded-xl border border-white/10">
          <p className="text-[10px] font-black text-[#D4AF37]">SEO GOOGLE</p>
          <input value={form.meta_title} onChange={e=>setForm({...form,meta_title:e.target.value})} className={inp} placeholder="Meta Title (60 char)" maxLength={60}/>
          <input value={form.meta_description} onChange={e=>setForm({...form,meta_description:e.target.value})} className={inp} placeholder="Meta Description (160 char)" maxLength={160}/>
          <div className="flex justify-between text-[9px] text-zinc-500"><span>{form.meta_title.length}/60</span><span>{form.meta_description.length}/160</span></div>
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
              <p className="text-[11px] text-zinc-500">{i.kategori} • {i.is_published?'✅':'⛔'} • {i.slug||'no-slug'}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={()=>{setForm({judul:i.judul||'',slug:i.slug||makeSlug(i.judul||''),kategori:i.kategori||'',thumbnail:i.thumbnail||'',excerpt:i.excerpt||'',konten:i.konten||'',tags:i.tags||'',is_published:!!i.is_published,meta_title:i.meta_title||'',meta_description:i.meta_description||'',focus_keyword:i.focus_keyword||''}); setEditId(i.id); window.scrollTo({top:0,behavior:'smooth'})}} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-black text-white hover:bg-white/20">EDIT</button>
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
