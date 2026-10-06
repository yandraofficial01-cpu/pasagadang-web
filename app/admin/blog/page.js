'use client'
import {useEffect,useState,useRef} from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

function cleanHTML(dirty){
  if(!dirty) return ''
  let s = dirty.replace(/&nbsp;/gi,' ')
  s = s.replace(/<div><br><\/div>/gi,'').replace(/<div>\s*<\/div>/gi,'')
  s = s.replace(/<div>/gi,'<p>').replace(/<\/div>/gi,'</p>')
  s = s.replace(/<font[^>]*>/gi,'').replace(/<\/font>/gi,'')
  s = s.replace(/<span[^>]*>/gi,'').replace(/<\/span>/gi,'')
  s = s.replace(/class="[^"]*"/gi,'')
  s = s.replace(/style="[^"]*"/gi,'')
  s = s.replace(/<p>\s*<\/p>/gi,'')
  return s.trim()
}

function RichEditor({isDark, editorRef, savedRangeRef, onChange}){
  useEffect(()=>{ document.execCommand('defaultParagraphSeparator', false, 'p') },[])
  const saveSel = ()=>{
    const sel = window.getSelection()
    if(sel?.rangeCount && editorRef.current){
      const r = sel.getRangeAt(0)
      if(editorRef.current.contains(r.commonAncestorContainer)) savedRangeRef.current = r.cloneRange()
    }
  }
  const exec = (cmd,val=null)=>{
    editorRef.current.focus()
    if(savedRangeRef.current){ const sel=window.getSelection(); sel.removeAllRanges(); sel.addRange(savedRangeRef.current) }
    document.execCommand(cmd,false,val); saveSel(); onChange(editorRef.current.innerHTML)
  }
  const b = `w-8 h-8 rounded-lg font-black text-[12px] flex items-center justify-center border shrink-0 ${isDark?'bg-white/10 border-white/10 text-white':'bg-black/5 border-black/10 text-black'}`
  const bGold = `w-8 h-8 rounded-lg bg-[#D4AF37] text-black font-black text-[12px] flex items-center justify-center shrink-0`

  return(
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/10">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-white/5 border-white/10 w-full max-w-full overflow-x-auto">
        <button type="button" onClick={()=>exec('formatBlock','<p>')} className={`${b} w-10`}>P</button>
        <button type="button" onClick={()=>exec('formatBlock','<h2>')} className={`${b} w-10`}>H2</button>
        <button type="button" onClick={()=>exec('formatBlock','<h3>')} className={`${b} w-10`}>H3</button>
        <button type="button" onClick={()=>exec('bold')} className={b}>B</button>
        <button type="button" onClick={()=>exec('italic')} className={b}>I</button>
        <button type="button" onClick={()=>exec('underline')} className={b}>U</button>
        <button type="button" onClick={()=>exec('foreColor','#D4AF37')} className={bGold}>A</button>
        <button type="button" onClick={()=>exec('foreColor', isDark?'#fff':'#000')} className={b}>A</button>
        <button type="button" onClick={()=>exec('foreColor','#B22222')} className={`${b} text-red-500`}>A</button>
        <button type="button" onClick={()=>exec('removeFormat')} className={b}>✖</button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onInput={e=>{saveSel(); onChange(e.currentTarget.innerHTML)}}
        onMouseUp={saveSel} onKeyUp={saveSel} onBlur={saveSel} onFocus={saveSel}
        className={`min-h-[320px] w-full max-w-full min-w-0 overflow-x-hidden break-words p-3 text-[14px] outline-none ${isDark?'text-white bg-[#0A0A0F]':'text-black bg-[#FFFBF0]'}`}
      />
    </div>
  )
}

export default function Page(){
  const [data,setData]=useState([]); const [theme,setTheme]=useState('dark')
  const [form,setForm]=useState({judul:'', slug:'', kategori:'', thumbnail:'', excerpt:'', konten:'', tags:'', is_published:false, meta_title:'', meta_description:'', focus_keyword:''})
  const [editId,setEditId]=useState(null); const [loading,setLoading]=useState(false); const [up,setUp]=useState('')
  const editorRef = useRef(null); const savedRangeRef = useRef(null)
  const tok=()=>document.cookie.match(/admin_token=([^;]+)/)?.[1]||''

  useEffect(()=>{ setTheme(localStorage.getItem('admin_theme')||'dark'); load() },[])
  const toggleTheme = ()=>{ const n=theme==='dark'?'light':'dark'; setTheme(n); localStorage.setItem('admin_theme',n) }
  const isDark = theme==='dark'

  const load=async()=>{
    try{
      const r=await fetch(`${API}/blogs/?all=true`,{headers:{Authorization:`Bearer ${tok()}`},cache:'no-store'})
      const j=await r.json(); setData(Array.isArray(j)?j:j.blogs||j.data||[])
    }catch(e){}
  }
  const makeSlug = (s)=> s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')
  const wordCount = form.konten.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length
  const seoStatus = wordCount >= 900? '✅ SEO BAGUS' : wordCount >= 500? '⚠️ KURANG' : '❌ TIPIS'

  const saveCursorBeforePicker = ()=>{
    if(!editorRef.current) return
    const sel=window.getSelection()
    if(sel?.rangeCount && editorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)){ savedRangeRef.current=sel.getRangeAt(0).cloneRange(); return }
    const range=document.createRange(); range.selectNodeContents(editorRef.current); range.collapse(false); savedRangeRef.current=range
  }
  const upload=async(field,file)=>{
    if(!file) return; setUp(field)
    const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',PRESET); fd.append('folder',`pasa-gadang/blog/${field}`)
    try{
      const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:'POST',body:fd})
      const d=await res.json()
      if(d.secure_url){
        const bigUrl = d.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')
        if(field==='konten_img'){
          editorRef.current.focus(); const sel=window.getSelection(); sel.removeAllRanges(); if(savedRangeRef.current) sel.addRange(savedRangeRef.current)
          const html=`<p><br></p><img src="${bigUrl}" alt="blog" loading="lazy" /><p><br></p>`
          document.execCommand('insertHTML', false, html); setForm(f=>({...f, konten: editorRef.current.innerHTML}))
        } else { setForm(f=>({...f,[field]:bigUrl})) }
      }
    }catch(e){ alert(e.message) }
    setUp('')
  }
  const resetForm=()=>{ setForm({judul:'',slug:'',kategori:'',thumbnail:'',excerpt:'',konten:'',tags:'',is_published:false, meta_title:'', meta_description:'', focus_keyword:''}); setEditId(null); if(editorRef.current) editorRef.current.innerHTML='' }

  const submit=async(e)=>{
    e.preventDefault()
    if(!form.judul ||!form.thumbnail) return alert('Judul & Thumbnail wajib!')
    const rawKonten = editorRef.current? editorRef.current.innerHTML : form.konten
    if(!rawKonten) return alert('Konten wajib!')
    setLoading(true)
    const finalKonten = cleanHTML(rawKonten)
    const payload={judul: form.judul, slug: form.slug||makeSlug(form.judul), kategori: form.kategori, thumbnail: form.thumbnail, excerpt: form.excerpt, konten: finalKonten, tags: form.tags||"", is_published: form.is_published, meta_title: form.meta_title||form.judul, meta_description: form.meta_description||form.excerpt, focus_keyword: form.focus_keyword||""}
    const url = editId? `${API}/blogs/${editId}/` : `${API}/blogs/`
    const res=await fetch(url,{method:editId?'PUT':'POST',headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if(!res.ok){ alert(await res.text()); setLoading(false); return }
    resetForm(); load(); setLoading(false)
  }

  const inp = "w-full max-w-full min-w-0 box-border bg-black/50 border border-white/10 p-3 rounded-xl text-sm text-white outline-none"
  const label = "text-[10px] font-black tracking-widest text-white/40 mb-1"
  const card = "bg-[#16161E] border-[#D4AF37]/20"
  const card2 = "bg-[#16161E] border-white/10"

  return(
  <div className="bg-[#0B0B0F] min-h-screen w-full max-w-full overflow-x-hidden box-border">
  <AdminLayout title={`BLOG STUDIO (${data.length})`}>
    <div className="w-full max-w-full min-w-0 overflow-x-hidden box-border px-1">
      <div className="flex gap-2 mb-4 items-center w-full max-w-full min-w-0 overflow-x-auto">
        <a href="/admin" className="shrink-0 px-4 py-2 rounded-full font-black text-[11px] border bg-white/10 border-white/20 text-white">← DASHBOARD</a>
        <a href="/blogs" target="_blank" className="shrink-0 bg-[#D4AF37] text-black px-4 py-2 rounded-full font-black text-[11px]">LIHAT WEB ↗</a>
        <button onClick={toggleTheme} className="ml-auto shrink-0 w-10 h-10 rounded-full border flex items-center justify-center bg-white text-black">{isDark?'☀️':'🌙'}</button>
        {editId && <button onClick={resetForm} className="shrink-0 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full font-black text-[11px]">BATAL</button>}
      </div>

      {/* FIX UTAMA: 380px bukan 480px + grid-cols-1 di HP */}
      <div className="w-full max-w-full min-w-0 overflow-x-hidden grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        <form onSubmit={submit} className={`${card} border p-4 rounded-[24px] space-y-3 w-full max-w-full min-w-0 overflow-x-hidden box-border h-fit lg:sticky lg:top-4`}>
          <div className="flex justify-between items-center gap-2 w-full max-w-full min-w-0">
            <p className="text-[11px] font-black tracking-[0.2em] text-[#D4AF37] truncate min-w-0">{editId?`EDIT #${editId}`:'TULIS BARU'}</p>
            <label className="shrink-0 text-[10px] font-black flex gap-2 cursor-pointer text-white"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/>PUBLISH</label>
          </div>
          <div className="p-2.5 rounded-xl border text-[10px] font-black flex justify-between bg-red-500/20 border-red-500/30 text-red-400 w-full max-w-full min-w-0">
            <span>{wordCount} KATA</span><span>{seoStatus}</span><span className="opacity-60">900+</span>
          </div>
          <div className="w-full max-w-full min-w-0"><div className={label}>JUDUL *</div><input value={form.judul} onChange={e=>setForm({...form,judul:e.target.value, slug: makeSlug(e.target.value)})} className={inp} required/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-full min-w-0">
            <div className="min-w-0"><div className={label}>SLUG</div><input value={form.slug} onChange={e=>setForm({...form,slug:makeSlug(e.target.value)})} className={inp}/></div>
            <div className="min-w-0"><div className={label}>KEYWORD</div><input value={form.focus_keyword} onChange={e=>setForm({...form,focus_keyword:e.target.value})} className={inp} placeholder="beli rumah"/></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-full min-w-0">
            <div className="min-w-0"><div className={label}>KATEGORI *</div><input value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className={inp} required/></div>
            <div className="min-w-0"><div className={label}>TAGS</div><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className={inp}/></div>
          </div>
          <div className="border p-3 rounded-xl space-y-2 bg-[#D4AF37]/10 border-[#D4AF37]/30 w-full max-w-full min-w-0 overflow-hidden">
            <p className="text-[11px] font-black text-[#D4AF37]">🖼️ THUMBNAIL *</p>
            <input type="file" accept="image/*" onChange={e=>upload('thumbnail',e.target.files[0])} className="w-full max-w-full min-w-0 text-[11px]"/>
            {up==='thumbnail' && <p className="text-[10px] text-[#D4AF37]">UPLOADING...</p>}
            {form.thumbnail && <img src={form.thumbnail} className="w-full max-w-full h-48 object-cover rounded-xl"/>}
          </div>
          <div className="w-full max-w-full min-w-0"><div className={label}>EXCERPT</div><input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} className={inp}/></div>
          <div className="border p-3 rounded-xl space-y-3 bg-white/5 border-white/10 w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex justify-between items-center gap-2 w-full max-w-full min-w-0">
              <p className="text-[10px] font-black text-white truncate min-w-0">📝 KONTEN P,H2,B,I,U,Warna</p>
              <label onMouseDown={saveCursorBeforePicker} className="shrink-0 bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border border-[#D4AF37]/30">{up==='konten_img'?'+...':'+ Gambar'}<input type="file" accept="image/*" className="hidden" onChange={e=>upload('konten_img',e.target.files[0])}/></label>
            </div>
            <RichEditor isDark={isDark} editorRef={editorRef} savedRangeRef={savedRangeRef} onChange={(html)=> setForm(f=>({...f, konten: html}))} />
          </div>
          <div className="grid grid-cols-1 gap-2 p-3 rounded-xl border bg-black/30 border-white/10 w-full max-w-full min-w-0">
            <p className="text-[10px] font-black text-[#D4AF37]">SEO</p>
            <input value={form.meta_title} onChange={e=>setForm({...form,meta_title:e.target.value})} className={inp} maxLength={60} placeholder="Meta Title 60 char"/>
            <input value={form.meta_description} onChange={e=>setForm({...form,meta_description:e.target.value})} className={inp} maxLength={160} placeholder="Meta Desc 160 char"/>
          </div>
          <button disabled={loading} className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs">{loading?'SIMPAN...':editId?'UPDATE':'SIMPAN & PUBLISH'}</button>
        </form>

        <div className={`${card2} border p-4 rounded-[24px] space-y-2 w-full max-w-full min-w-0 overflow-x-hidden box-border`}>
          <p className="text-[11px] font-black tracking-widest text-white/40">DAFTAR ({data.length})</p>
          <div className="space-y-2 w-full max-w-full min-w-0">
          {data.map(i=>(
            <div key={i.id} className="border p-3 rounded-2xl flex gap-3 items-center bg-black/60 border-white/5 w-full max-w-full min-w-0 overflow-hidden">
              <img src={i.thumbnail} className="w-12 h-12 rounded-xl object-cover shrink-0"/>
              <div className="flex-1 min-w-0 overflow-hidden"><p className="text-sm font-black truncate text-white">{i.judul}</p><p className="text-[10px] text-zinc-500 truncate">{i.kategori} • {i.slug}</p></div>
              <button onClick={()=>{setForm({judul:i.judul||'',slug:i.slug||'',kategori:i.kategori||'',thumbnail:i.thumbnail||'',excerpt:i.excerpt||'',konten:i.konten||'',tags:i.tags||'',is_published:!!i.is_published,meta_title:i.meta_title||'',meta_description:i.meta_description||'',focus_keyword:i.focus_keyword||''}); setEditId(i.id); setTimeout(()=>{ if(editorRef.current) editorRef.current.innerHTML = i.konten||'' },100); window.scrollTo({top:0,behavior:'smooth'})}} className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black bg-white/10 text-white">EDIT</button>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  </div>
  )
  }
