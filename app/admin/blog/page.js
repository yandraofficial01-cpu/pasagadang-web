'use client'
import {useEffect,useState,useRef} from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

// CLEANER ANTI <div>&nbsp; & style bocor
function cleanHTML(dirty){
  if(!dirty) return ''
  let s = dirty
  // buang &nbsp; berantakan
  s = s.replace(/&nbsp;/gi, ' ')
  // ganti div jadi p biar gak numpuk
  s = s.replace(/<div><br><\/div>/gi, '')
  s = s.replace(/<div>\s*<\/div>/gi, '')
  s = s.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '</p>')
  // buang font, span yang gak perlu
  s = s.replace(/<font[^>]*>/gi, '').replace(/<\/font>/gi, '')
  s = s.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '')
  // buang style berantakan tailwind
  s = s.replace(/style="[^"]*"/gi, (m)=>{
    // keep only if ada width 100% (gambar)
    if(m.includes('width:100%')) return m
    return ''
  })
  // buang class shadow-lg dll yang bikin --tw- bocor
  s = s.replace(/class="[^"]*"/gi, (m)=>{
    if(m.includes('rounded')) return '' // buang semua class, nanti di slug dirender ulang bersih
    return ''
  })
  s = s.replace(/<p>\s*<\/p>/gi, '')
  s = s.replace(/\n{3,}/g, '\n')
  return s.trim()
}

function RichEditor({isDark, editorRef, savedRangeRef, onChange}){
  useEffect(()=>{
    // INI KUNCI BIAR ENTER JADI <p> BUKAN <div>
    document.execCommand('defaultParagraphSeparator', false, 'p')
  },[])

  const saveSelection = () => {
    const sel = window.getSelection()
    if(sel && sel.rangeCount > 0 && editorRef.current){
      const range = sel.getRangeAt(0)
      if(editorRef.current.contains(range.commonAncestorContainer) || editorRef.current===range.commonAncestorContainer){
        savedRangeRef.current = range.cloneRange()
      }
    }
  }

  const exec = (cmd, val=null)=>{
    editorRef.current.focus()
    if(savedRangeRef.current){
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }
    document.execCommand(cmd, false, val)
    saveSelection()
    onChange(editorRef.current.innerHTML)
  }

  const btn = `w-8 h-8 rounded-lg font-black text-[12px] flex items-center justify-center transition border ${isDark? 'bg-white/10 border-white/10 text-white hover:bg-[#D4AF37] hover:text-black' : 'bg-black/5 border-black/10 text-black hover:bg-black hover:text-white'}`
  const btnGold = "w-8 h-8 bg-[#D4AF37] text-black rounded-lg font-black text-[12px] flex items-center justify-center border border-[#D4AF37]"

  return(
    <div className={`rounded-xl overflow-hidden border ${isDark?'bg-black/50 border-white/10':'bg-white border-black/10'}`}>
      <div className={`flex flex-wrap gap-1 p-2 border-b ${isDark?'bg-white/5 border-white/10':'bg-black/5 border-black/10'}`}>
        <button type="button" onClick={()=>exec('bold')} className={btn}>B</button>
        <button type="button" onClick={()=>exec('italic')} className={`${btn} italic`}>I</button>
        <button type="button" onClick={()=>exec('underline')} className={`${btn} underline`}>U</button>
        <div className={`w-[1px] h-8 mx-1 ${isDark?'bg-white/10':'bg-black/10'}`}></div>
        <button type="button" onClick={()=>exec('formatBlock','<h2>')} className={`${btn} w-10`}>H2</button>
        <button type="button" onClick={()=>exec('formatBlock','<h3>')} className={`${btn} w-10`}>H3</button>
        <button type="button" onClick={()=>exec('formatBlock','<p>')} className={`${btn} w-10`}>P</button>
        <div className={`w-[1px] h-8 mx-1 ${isDark?'bg-white/10':'bg-black/10'}`}></div>
        <button type="button" onClick={()=>exec('insertUnorderedList')} className={btn}>•≡</button>
        <button type="button" onClick={()=>exec('insertOrderedList')} className={btn}>1≡</button>
        <button type="button" onClick={()=>exec('justifyLeft')} className={btn}>⬅</button>
        <button type="button" onClick={()=>exec('justifyCenter')} className={btn}>↔</button>
        <div className={`w-[1px] h-8 mx-1 ${isDark?'bg-white/10':'bg-black/10'}`}></div>
        <button type="button" onClick={()=>exec('foreColor','#D4AF37')} className={btnGold}>A</button>
        <button type="button" onClick={()=>exec('foreColor', isDark? 'white':'black')} className={`w-8 h-8 rounded-lg font-black text-[12px] border ${isDark?'bg-white text-black':'bg-black text-white'}`}>A</button>
        <button type="button" onClick={()=>exec('removeFormat')} className={`${btn} text-[10px]`}>✖</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e)=> { saveSelection(); onChange(e.currentTarget.innerHTML) }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={saveSelection}
        onFocus={saveSelection}
        className={`min-h-[380px] p-4 text-[14px] outline-none leading-relaxed max-w-none
        ${isDark? 'text-white bg-[#0A0A0F]':'text-black bg-[#FFFBF0]'}
        [&_h2]:text-[18px] [&_h2]:font-black [&_h2]:text-[#D4AF37] [&_h2]:mt-6 [&_h2]:mb-3
        [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
        [&_p]:mb-3 [&_p]:leading-relaxed
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
        [&_img]:rounded-2xl [&_img]:my-6 [&_img]:w-full [&_img]:block [&_img]:h-auto [&_img]:object-contain`}
      />
    </div>
  )
}

export default function Page(){
  const [data,setData]=useState([])
  const [theme,setTheme]=useState('dark')
  const [form,setForm]=useState({
    judul:'', slug:'', kategori:'', thumbnail:'', excerpt:'', konten:'', tags:'',
    is_published:false, meta_title:'', meta_description:'', focus_keyword:''
  })
  const [editId,setEditId]=useState(null)
  const [loading,setLoading]=useState(false)
  const [up,setUp]=useState('')
  const editorRef = useRef(null)
  const savedRangeRef = useRef(null)
  const tok=()=>document.cookie.match(/admin_token=([^;]+)/)?.[1]||''

  useEffect(()=>{
    const saved = localStorage.getItem('admin_theme') || 'dark'
    setTheme(saved)
    load()
  },[])

  const toggleTheme = ()=>{
    const n = theme==='dark'?'light':'dark'
    setTheme(n); localStorage.setItem('admin_theme',n)
  }
  const isDark = theme==='dark'

  const load=async()=>{
    try{
      const r=await fetch(`${API}/blogs/?all=true`,{headers:{Authorization:`Bearer ${tok()}`},cache:'no-store'})
      const j=await r.json()
      setData(Array.isArray(j)?j:j.blogs||j.data||[])
    }catch(e){}
  }

  const makeSlug = (s)=> s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')
  const wordCount = form.konten.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length
  const seoStatus = wordCount >= 900? '✅ SEO BAGUS' : wordCount >= 500? '⚠️ KURANG' : '❌ TIPIS BANGET'

  const saveCursorBeforePicker = () => {
    if(!editorRef.current) return
    const sel = window.getSelection()
    if(sel && sel.rangeCount>0){
      const range = sel.getRangeAt(0)
      if(editorRef.current.contains(range.commonAncestorContainer)){
        savedRangeRef.current = range.cloneRange()
        return
      }
    }
    const range = document.createRange()
    range.selectNodeContents(editorRef.current)
    range.collapse(false)
    savedRangeRef.current = range
  }

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
          if(editorRef.current){
            editorRef.current.focus()
            const sel = window.getSelection()
            sel.removeAllRanges()
            if(savedRangeRef.current){
              sel.addRange(savedRangeRef.current)
            } else {
              const r = document.createRange()
              r.selectNodeContents(editorRef.current)
              r.collapse(false)
              sel.addRange(r)
            }
            // FIX: JANGAN PAKE class shadow-lg LAGI, PAKE STYLE BERSIH LANGSUNG
            const html = `<p><br></p><img src="${bigUrl}" alt="${form.judul}" style="width:100%;height:auto;object-fit:contain;border-radius:20px;margin:24px 0;display:block;background:#F5F5F0" loading="lazy" /><p><br></p>`
            document.execCommand('insertHTML', false, html)
            setForm(f=>({...f, konten: editorRef.current.innerHTML}))
          }
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
    if(editorRef.current) editorRef.current.innerHTML = ''
    savedRangeRef.current = null
  }

  const submit=async(e)=>{
    e.preventDefault()
    if(!form.judul ||!form.thumbnail) return alert('Judul & Thumbnail wajib!')
    const rawKonten = editorRef.current? editorRef.current.innerHTML : form.konten
    if(!rawKonten) return alert('Konten wajib!')
    setLoading(true)

    // INI YANG FIX - BERSIHIN DULU SEBELUM SAVE KE API
    const finalKonten = cleanHTML(rawKonten)

    const cleanText = finalKonten.replace(/<[^>]*>?/gm, '').substring(0,160)
    const finalSlug = form.slug || makeSlug(form.judul)
    const payload={
      judul: form.judul, slug: finalSlug, kategori: form.kategori,
      thumbnail: form.thumbnail, excerpt: form.excerpt, konten: finalKonten,
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

  const inp = isDark? "w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]" : "w-full bg-white border border-black/10 p-3 rounded-xl text-sm text-black outline-none focus:border-[#D4AF37]"
  const label = isDark? "text-[10px] font-black tracking-widest text-white/40 mb-1" : "text-[10px] font-black tracking-widest text-black/50 mb-1"
  const card = isDark? "bg-[#16161E] border-[#D4AF37]/20" : "bg-white border-black/10 shadow-lg"
  const card2 = isDark? "bg-[#16161E] border-white/10" : "bg-white border-black/10 shadow-lg"

  return(
  <div className={isDark?'bg-[#0B0B0F] min-h-screen':'bg-[#FFFBF0] min-h-screen'}>
  <AdminLayout title={`BLOG STUDIO (${data.length})`}>
    <div className="flex gap-2 mb-4 items-center">
      <a href="/admin" className={`px-4 py-2 rounded-full font-black text-[11px] border ${isDark?'bg-white/10 border-white/20 text-white':'bg-white border-black/10 text-black'}`}>← DASHBOARD</a>
      <a href="/blogs" target="_blank" className="bg-[#D4AF37] text-black px-4 py-2 rounded-full font-black text-[11px]">LIHAT WEB ↗</a>
      <button onClick={toggleTheme} className={`ml-auto w-10 h-10 rounded-full border flex items-center justify-center font-black ${isDark?'bg-white text-black border-white':'bg-black text-white border-black'}`}>{isDark?'☀️':'🌙'}</button>
      {editId && <button onClick={resetForm} className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full font-black text-[11px]">BATAL EDIT</button>}
    </div>

    <div className="grid lg:grid-cols-[480px_1fr] gap-6 mt-4">
      <form onSubmit={submit} className={`${card} border p-5 rounded-[24px] space-y-3 h-fit sticky top-4 max-h-[92vh] overflow-y-auto`}>
        <div className="flex justify-between items-center">
          <p className="text-[11px] font-black tracking-[0.3em] text-[#D4AF37]">{editId?`EDIT #${editId}`:'TULIS BARU'}</p>
          <label className={`text-[10px] font-black flex gap-2 cursor-pointer ${isDark?'text-white':'text-black'}`}><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/>PUBLISH</label>
        </div>

        <div className={`p-2.5 rounded-xl border text-[10px] font-black flex justify-between ${wordCount>=900?'bg-green-500/20 border-green-500/30 text-green-500':'bg-red-500/20 border-red-500/30 text-red-500'}`}>
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
        <div className={`border p-3 rounded-xl space-y-2 ${isDark?'bg-[#D4AF37]/10 border-[#D4AF37]/30':'bg-[#FFFBF0] border-[#D4AF37]/30'}`}>
          <p className="text-[11px] font-black text-[#D4AF37]">🖼️ THUMBNAIL *</p>
          <input type="file" accept="image/*" onChange={e=>upload('thumbnail',e.target.files[0])} className={`w-full text-[11px] file:mr-2 file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-full file:px-3 file:py-1 file:font-black file:text-[10px] ${isDark?'text-zinc-400':'text-zinc-600'}`}/>
          {up==='thumbnail' && <p className="text-[10px] text-[#D4AF37] animate-pulse">UPLOADING...</p>}
          {form.thumbnail && <img src={form.thumbnail} className="w-full h-48 object-cover rounded-xl"/>}
        </div>
        <div><div className={label}>EXCERPT</div><input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} className={inp}/></div>

        <div className={`border p-3 rounded-xl space-y-3 ${isDark?'bg-white/5 border-white/10':'bg-black/5 border-black/10'}`}>
          <div className="flex justify-between items-center">
            <p className={`text-[11px] font-black ${isDark?'text-white':'text-black'}`}>📝 KONTEN - KLIK DULU BARU TAMBAH GAMBAR</p>
            <label
              onMouseDown={saveCursorBeforePicker}
              onTouchStart={saveCursorBeforePicker}
              className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-black cursor-pointer border border-[#D4AF37]/30">
              {up==='konten_img'?'+ Uploading...':'+ Gambar'}
              <input type="file" accept="image/*" className="hidden" onChange={e=>upload('konten_img',e.target.files[0])}/>
            </label>
          </div>
          <RichEditor isDark={isDark} editorRef={editorRef} savedRangeRef={savedRangeRef} onChange={(html)=> setForm(f=>({...f, konten: html}))} />
          <p className="text-[9px] opacity-60">Cara: Tap di tengah tulisan dulu, baru tap Gambar. Tulisan bawah otomatis kegeser.</p>
        </div>

        <div className={`grid grid-cols-1 gap-2 p-3 rounded-xl border ${isDark?'bg-black/30 border-white/10':'bg-black/5 border-black/10'}`}>
          <p className="text-[10px] font-black text-[#D4AF37]">SEO GOOGLE</p>
          <input value={form.meta_title} onChange={e=>setForm({...form,meta_title:e.target.value})} className={inp} maxLength={60} placeholder="Meta Title 60 char"/>
          <input value={form.meta_description} onChange={e=>setForm({...form,meta_description:e.target.value})} className={inp} maxLength={160} placeholder="Meta Desc 160 char"/>
        </div>
        <button disabled={loading} className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs hover:bg-[#c9a227] shadow-lg">{loading?'SIMPAN...':editId?'UPDATE ARTIKEL':'SIMPAN & PUBLISH'}</button>
      </form>

      <div className={`${card2} border p-5 rounded-[24px] space-y-2`}>
        <p className={`text-[11px] font-black tracking-widest ${isDark?'text-white/40':'text-black/40'}`}>DAFTAR ARTIKEL ({data.length})</p>
        <div className="space-y-2 max-h-[80vh] overflow-y-auto">
        {data.map(i=>(
          <div key={i.id} className={`border p-3 rounded-2xl flex gap-3 items-center ${isDark?'bg-black/60 border-white/5':'bg-[#FFFBF0] border-black/5'}`}>
            <img src={i.thumbnail} className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-black truncate ${isDark?'text-white':'text-black'}`}>{i.judul}</p>
              <p className="text-[11px] text-zinc-500">{i.kategori} • {i.is_published?'✅':'⛔'} • {i.slug}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={()=>{setForm({judul:i.judul||'',slug:i.slug||'',kategori:i.kategori||'',thumbnail:i.thumbnail||'',excerpt:i.excerpt||'',konten:i.konten||'',tags:i.tags||'',is_published:!!i.is_published,meta_title:i.meta_title||'',meta_description:i.meta_description||'',focus_keyword:i.focus_keyword||''}); setEditId(i.id); setTimeout(()=>{ if(editorRef.current) editorRef.current.innerHTML = i.konten||'' },100); window.scrollTo({top:0,behavior:'smooth'})}} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${isDark?'bg-white/10 text-white':'bg-black/10 text-black'}`}>EDIT</button>
              <button onClick={async()=>{if(!confirm('Hapus?'))return; await fetch(`${API}/blogs/${i.id}/`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-black">HAPUS</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  </AdminLayout>
  </div>
  )
}
