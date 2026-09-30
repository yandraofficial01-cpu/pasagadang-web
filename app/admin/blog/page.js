'use client'
import {useEffect,useState, useRef} from 'react'
import AdminLayout from '../components/AdminLayout'
const API=process.env.NEXT_PUBLIC_API_URL

export default function Page(){
  const [data,setData]=useState([]);
  const [form,setForm]=useState({judul:'',kategori:'',thumbnail:'',excerpt:'',konten:'',tags:'',is_published:false, meta_title:'', meta_description:''});
  const [editId,setEditId]=useState(null)
  const [uploading,setUploading]=useState(false)
  const kontenRef = useRef(null)
  const tok=()=>document.cookie.split('admin_token=')[1]?.split(';')[0]

  const load=async()=>{
    const r=await fetch(`${API}/blogs`,{headers:{Authorization:`Bearer ${tok()}`}});
    const j=await r.json();
    setData(Array.isArray(j)?j:j.blogs||j.data||[])
  }
  useEffect(()=>{load()},[])

  // Upload file ke BE yang baru lu bikin tadi
  const uploadImg = async (file) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const r = await fetch(`${API}/blogs/upload-image`, {method:'POST', body: fd, headers:{Authorization:`Bearer ${tok()}`}})
    const j = await r.json()
    setUploading(false)
    return j.url // /static/blogs/xxx.jpg
  }

  const handleThumb = async (e)=>{
    const file = e.target.files[0]
    if(!file) return
    const url = await uploadImg(file)
    setForm({...form, thumbnail: url})
  }

  const handleKontenImg = async (e)=>{
    const file = e.target.files[0]
    if(!file) return
    const url = await uploadImg(file)
    const tag = `\n<img src="${API}${url}" alt="${form.judul}" class="rounded-xl my-4" />\n`
    setForm({...form, konten: form.konten + tag})
  }

  const submit=async(e)=>{
    e.preventDefault();
    const payload = {...form}
    // auto generate meta kalau kosong biar nongol di Google
    if(!payload.meta_title) payload.meta_title = payload.judul
    if(!payload.meta_description) payload.meta_description = payload.excerpt || payload.konten.substring(0,160)

    await fetch(editId?`${API}/blogs/${editId}`:`${API}/blogs`,{
      method:editId?'PUT':'POST',
      headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    load();setEditId(null)
    setForm({judul:'',kategori:'',thumbnail:'',excerpt:'',konten:'',tags:'',is_published:false, meta_title:'', meta_description:''})
  }

  return(
  <AdminLayout title={`BLOG STUDIO (${data.length})`}>
    <div className="grid lg:grid-cols-[450px_1fr] gap-6 mt-4">
      {/* FORM KIRI */}
      <form onSubmit={submit} className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-3 h-fit sticky top-4">
        <h3 className="font-black text-[#D4AF37] text-xs tracking-widest">TULIS ARTIKEL</h3>
        <input value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})} placeholder="Judul Blog (Topik)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required/>

        <div className="grid grid-cols-2 gap-2">
          <input value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} placeholder="Kategori (ex: Kuliner)" className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required/>
          <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="Tags (rendang, padang)" className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
        </div>

        {/* THUMBNAIL UPLOAD */}
        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-zinc-400 mb-2">GAMBAR UTAMA (Thumbnail)</p>
          <input type="file" accept="image/*" onChange={handleThumb} className="text-[11px] w-full" />
          {form.thumbnail && <img src={`${API}${form.thumbnail}`} className="mt-2 rounded-lg h-24 object-cover" />}
          <input value={form.thumbnail} onChange={e=>setForm({...form,thumbnail:e.target.value})} placeholder="atau paste URL" className="w-full mt-2 bg-black/50 border border-white/10 p-2 rounded-xl text-[11px]" />
        </div>

        <input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} placeholder="Excerpt (ringkasan 1 kalimat buat Google)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>

        {/* KONTEN + GAMBAR PENDUKUNG */}
        <div className="bg-black/40 p-3 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] text-zinc-400">KONTEN + GAMBAR PENDUKUNG</p>
            <label className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] cursor-pointer">
              {uploading?'Uploading...':'+ Upload Gambar Isi'}
              <input type="file" accept="image/*" className="hidden" onChange={handleKontenImg} />
            </label>
          </div>
          <textarea ref={kontenRef} value={form.konten} onChange={e=>setForm({...form,konten:e.target.value})} placeholder="Tulis artikel di sini... Gambar akan otomatis masuk sebagai <img>" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-64 font-mono"/>
          <p className="text-[9px] text-zinc-500 mt-1">Tips: Klik "Upload Gambar Isi" nanti otomatis ke-sisip di akhir tulisan. Pindah manual aja tag &lt;img&gt; nya ke tengah.</p>
        </div>

        {/* SPACE IKLAN - INFO */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
          <p className="text-[10px] text-yellow-400 font-bold">SPACE IKLAN AKTIF ✅</p>
          <p className="text-[9px] text-zinc-400">Iklan Top/Middle/Sidebar otomatis muncul di blog. Atur di `routers/blog.py` - IKLAN_CONFIG</p>
        </div>

        <label className="flex gap-2 text-xs items-center"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publish (Biar muncul di Google)</label>
        <button className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs">{editId?'UPDATE ARTIKEL':'SIMPAN & PUBLISH'}</button>
      </form>

      {/* LIST KANAN */}
      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-2">
        <div className="flex justify-between text-[10px] text-zinc-500 mb-2"><span>ARTIKEL TERBIT</span><span>{API}/blogs/sitemap.xml buat Google</span></div>
        {data.map(i=><div key={i.id} className="bg-black/40 border border-white/5 p-3 rounded-xl flex justify-between items-center">
          <div className="flex gap-3 items-center">
            {i.thumbnail && <img src={`${API}${i.thumbnail}`} className="w-12 h-12 rounded-lg object-cover" />}
            <div><p className="text-sm font-bold line-clamp-1">{i.judul}</p><p className="text-[11px] text-zinc-500">{i.kategori} • {i.is_published?'Published ✅':'Draft'} • {i.views} views • Baca Juga: auto by {i.kategori}</p></div>
          </div>
          <div className="flex gap-1">
            <button onClick={()=>{setForm(i);setEditId(i.id); window.scrollTo(0,0)}} className="bg-white/10 px-3 py-1 rounded-full text-[10px]">EDIT</button>
            <button onClick={async()=>{if(!confirm('Hapus?'))return; await fetch(`${API}/blogs/${i.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px]">HAPUS</button>
          </div>
        </div>)}
      </div>
    </div>
  </AdminLayout>)
  }
    }
