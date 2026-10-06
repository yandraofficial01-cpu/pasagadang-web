'use client'
import {useEffect,useState,useRef} from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

// --- RICH EDITOR COMPONENT ---
function RichEditor({value, onChange, title}){
  const editorRef = useRef(null)

  useEffect(()=>{
    if(editorRef.current && value!== editorRef.current.innerHTML){
      if(!editorRef.current.innerHTML || value.includes('<')){
        editorRef.current.innerHTML = value || ''
      }
    }
  },[])

  const exec = (cmd, val=null)=>{
    document.execCommand(cmd, false, val)
    editorRef.current.focus()
    onChange(editorRef.current.innerHTML)
  }

  const btn = "w-8 h-8 bg-white/10 hover:bg-[#D4AF37] hover:text-black rounded-lg font-black text-[12px] flex items-center justify-center transition"

  return(
    <div className="bg-black/50 border border-white/10 rounded-xl overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 p-2 bg-white/5 border-b border-white/10">
        <button type="button" onClick={()=>exec('bold')} className={btn} title="Tebal">B</button>
        <button type="button" onClick={()=>exec('italic')} className={`${btn} italic`} title="Miring">I</button>
        <button type="button" onClick={()=>exec('underline')} className={`${btn} underline`} title="Garis bawah">U</button>
        <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
        <button type="button" onClick={()=>exec('formatBlock','<h2>')} className={`${btn} w-10`} title="Judul Besar">H2</button>
        <button type="button" onClick={()=>exec('formatBlock','<h3>')} className={`${btn} w-10`} title="Judul Kecil">H3</button>
        <button type="button" onClick={()=>exec('formatBlock','<p>')} className={`${btn} w-10`} title="Paragraf">P</button>
        <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
        <button type="button" onClick={()=>exec('insertUnorderedList')} className={btn} title="List">•≡</button>
        <button type="button" onClick={()=>exec('insertOrderedList')} className={btn} title="Nomor">1≡</button>
        <button type="button" onClick={()=>exec('justifyLeft')} className={btn} title="Kiri">⬅</button>
        <button type="button" onClick={()=>exec('justifyCenter')} className={btn} title="Tengah">↔</button>
        <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
        <button type="button" onClick={()=>exec('foreColor','#D4AF37')} className="w-8 h-8 bg-[#D4AF37] text-black rounded-lg font-black text-[12px] flex items-center justify-center" title="Warna Emas">A</button>
        <button type="button" onClick={()=>exec('foreColor','white')} className="w-8 h-8 bg-white text-black rounded-lg font-black text-[12px]" title="Warna Putih">A</button>
        <button type="button" onClick={()=>exec('removeFormat')} className={`${btn} text-[10px]`} title="Hapus Format">✖</button>
      </div>
      {/* EDITABLE AREA */}
      <div
        ref={editorRef}
        contentEditable
        onInput={(e)=> onChange(e.currentTarget.innerHTML)}
        className="min-h-[350px] p-4 text-sm text-white outline-none leading-relaxed prose prose-invert max-w-none
        [&_h2]:text-[18px] [&_h2]:font-black [&_h2]:text-[#D4AF37] [&_h2]:mt-6 [&_h2]:mb-3
        [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
        [&_p]:mb-3 [&_p]:leading-relaxed
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
        [&_img]:rounded-2xl [&_img]:my-6 [&_img]:w-full"
        placeholder="Tulis artikel di sini... bisa tebalin, miringin, kasih H2..."
      />
    </div>
  )
}

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
      const r=await fetch(`${API}/blogs/?all=true`,{headers:{Authorization:`Bearer ${tok()}`},cache:'no-store'})
      const j=await r.json()
      setData(Array.isArray(j)?j:j.blogs||j.data||[])
    }catch(e){}
  }
  useEffect(()=>{load()},[])

  const makeSlug = (s)=> s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')
  const wordCount = form.konten.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length
  const seoStatus = wordCount >= 900? '✅ SEO BAGUS' : wordCount >= 500? '⚠️ KURANG' : '❌ TIPIS BANGET'

  const upload=async(field,file)=>{
    if(!file) return
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
          const tag = `<img src="${bigUrl}" alt="${form.judul}" class="rounded-2xl my-6 w-full h-auto shadow-lg" loading="lazy" /><p><br></p>`
          setForm(f=>({...f, konten: f.konten + tag}))
        } else {
          setForm(f=>({...f,[field]:bigUrl}))
        }
      }
    }catch(e){ alert(e.message) }
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
    setLoading(true)
    const cleanText = form.konten.replace(/<[^>]*>?/gm, '').substring(0,160)
    const finalSlug = form.slug || makeSlug(form.judul)
    const payload={
      judul: form.judul, slug: finalSlug, kategori: form.kategori,
      thumbnail: form.thumbnail, excerpt: form.excerpt, konten: form.konten,
      tags: form.tags || "", is_published: form.is_published,
      meta_title: form.meta_title || form.judul,
      meta_description: form.meta_description || form.excerpt || cleanText,
      focus_keyword: form.focus_keyword || ""
    }
    const url = editId? `${API}/blogs/${editId}/` : `${API}/blogs/`
    const res=await fetch(url,{method:editId?'PUT':'POST',headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if(!res.ok){ alert(await res.text()); setLoading(false); return }
    resetForm(); load(); setLoading(false)
  }

  const inp="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]"
  const label="text-[10px] font-black tracking-widest text-white/40 mb-1"

  return(
  <AdminLayout title={`BLOG STUDIO (${data.length})`}>
    <div className="flex gap-2 mb-4">
      <a href="/admin" className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full font-black text-[11px]">← DASHBOARD</a>
      <a href="/blogs" target="_blank" className="bg-[#D4AF37] text-black px-4 py-2 rounded-full font-black text-[11px]">LIHAT WEB ↗</a>
      {editId && <button onClick={resetForm} className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full font-black text-[11px]">BATAL EDIT</button>}
    </div>

    <div className="grid lg:grid-cols-[480px_1fr] gap-6 mt-4">
      <form onSubmit={submit} className="bg-[#16161E] border border-[#D4AF37]/20 p-5 rounded-[24px] space-y-3 h-fit sticky top-4 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <p className="text-[11px] font-black tracking-[0.3em] text-[#D4AF37]">{editId?`EDIT #${editId}`:'TULIS BARU'}</p>
          <label className="text-[10px] font-black text-white flex gap-2 cursor-pointer"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/>PUBLISH</label>
        </div>

        <div className={`p-2.5 rounded-xl border text-[10px] font-black flex justify-between ${wordCount>=900?'bg-green-500/20 border-green-500/30 text-green-400':'bg-red-500/20 border-red-500/30 text-red-400'}`}>
          <span>{wordCount} KATA</span><span>{seoStatus}</span><span className="opacity-60">TARGET 900+</span>
        </div>

        <div><div className={label}>JUDUL *</div><input value={form.judul} onChange={e=>setForm({...form,judul:e.target.value, slug: makeSlug(e.target.value), meta_title: e.target.value.substring(0,60)})} className={inp} required/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>SLUG</div><input value={form.slug} onChange={e=>setForm({...form,slug:makeSlug(e.target.value)})} className={inp}/></div>
          <div><div className={label}>KEYWORD</div><input value={form.focus_keyword} onChange={e=>setForm({...form,focus_keyword:e.target.value})} className={inp} placeholder="beli rumah di Padang"/></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>KATEGORI *</div><input value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className={inp} required/></div>
          <div><div className={label}>TAGS</div><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className={inp}/></div>
        </div>
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl space-y-2">
          <p className="text-[11px] font-black text-[#D4AF37]">🖼️ THUMBNAIL *</p>
          <input type="file" accept="image/*" onChange={e=>upload('thumbnail',e.target.files[0])} className="w-full text-[11px] text-zinc-400 file:mr-2 file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-full file:px-3 file:py-1 file:font-black file:text-[10px]"/>
          {form.thumbnail && <img src={form.thumbnail} className="w-full h-48 object-cover rounded-xl"/>}
        </div>
        <div><div className={label}>EXCERPT</div><input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} className={inp}/></div>

        {/* EDITOR BARU */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black text-white">📝 KONTEN - BISA TEBAL MIRING WARNA</p>
            <label className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-black cursor-pointer">
              {up==='konten_img'?'+ Uploading...':'+ Gambar'}
              <input type="file" accept="image/*" className="hidden" onChange={e=>upload('konten_img',e.target.files[0])}/>
            </label>
          </div>
          <RichEditor value={form.konten} onChange={(html)=> setForm(f=>({...f, konten: html}))} title={form.judul} />
          <p className="text-[9px] text-zinc-500">Bold = tebal, Italic = miring, H2 = judul emas, List = titik-titik. Enter = paragraf baru otomatis.</p>
        </div>

        <div className="grid grid-cols-1 gap-2 bg-black/30 p-3 rounded-xl border border-white/10">
          <p className="text-[10px] font-black text-[#D4AF37]">SEO GOOGLE</p>
          <input value={form.meta_title} onChange={e=>setForm({...form,meta_title:e.target.value})} className={inp} maxLength={60}/>
          <input value={form.meta_description} onChange={e=>setForm({...form,meta_description:e.target.value})} className={inp} maxLength={160}/>
        </div>
        <button disabled={loading} className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs">{loading?'SIMPAN...':editId?'UPDATE':'SIMPAN & PUBLISH'}</button>
      </form>

      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-2">
        <p className="text-[11px] font-black tracking-widest text-white/40">DAFTAR ARTIKEL ({data.length})</p>
        <div className="space-y-2 max-h-[80vh] overflow-y-auto">
        {data.map(i=>(
          <div key={i.id} className="bg-black/60 border border-white/5 p-3 rounded-2xl flex gap-3 items-center">
            <img src={i.thumbnail} className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{i.judul}</p>
              <p className="text-[11px] text-zinc-500">{i.kategori} • {i.is_published?'✅':'⛔'} • {i.slug}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={()=>{setForm({judul:i.judul||'',slug:i.slug||'',kategori:i.kategori||'',thumbnail:i.thumbnail||'',excerpt:i.excerpt||'',konten:i.konten||'',tags:i.tags||'',is_published:!!i.is_published,meta_title:i.meta_title||'',meta_description:i.meta_description||'',focus_keyword:i.focus_keyword||''}); setEditId(i.id); window.scrollTo({top:0,behavior:'smooth'})}} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-black text-white">EDIT</button>
              <button onClick={async()=>{if(!confirm('Hapus?'))return; await fetch(`${API}/blogs/${i.id}/`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-black">HAPUS</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  </AdminLayout>
  )
}
