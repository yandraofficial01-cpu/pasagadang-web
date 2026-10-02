'use client'
import { useEffect, useState, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

export default function Page(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({
    judul:'', tipe_properti:'Rumah', tipe_transaksi:'jual',
    harga_cash:0, harga_kredit:null, dp:null, cicilan_per_bulan:null, tenor_bulan:null, harga_sewa_per:'bulan',
    alamat:'', kecamatan:'', luas_tanah:0, luas_bangunan:0, kamar_tidur:2, kamar_mandi:1, sertifikat:'SHM',
    thumbnail:'', foto_1:'', foto_2:'', foto_3:'', foto_4:'', foto_5:'', foto_6:'', foto_7:'', foto_8:'',
    video_url:'', video_thumbnail:'', deskripsi:'', fasilitas:'', wa_number:'', badge:'', is_published:false,
    map_link:'', map_img:''
  })
  const [editId,setEditId]=useState(null)
  const [showFotoLain,setShowFotoLain]=useState(false)
  const [up,setUp]=useState('')
  const [cropSrc,setCropSrc]=useState(null)
  const [cropField,setCropField]=useState(null)
  const [cropBox,setCropBox]=useState({x:10,y:10,w:80,h:45})
  const [dragging,setDragging]=useState(false)
  const imgRef=useRef(null)

  const tok=()=>document.cookie.split('admin_token=')[1]?.split(';')[0]
  const load=async()=>{
    const r=await fetch(`${API}/properties`,{headers:{Authorization:`Bearer ${tok()}`}})
    const j=await r.json()
    setData(Array.isArray(j)?j:j.data||[])
  }
  useEffect(()=>{load()},[])

  const onFileSelect = (field, file)=>{
    if(!file) return
    const reader = new FileReader()
    reader.onload = (e)=>{ setCropSrc(e.target.result); setCropField(field); setCropBox(field==='map_img'?{x:5,y:20,w:90,h:50}:{x:10,y:10,w:80,h:80}) }
    reader.readAsDataURL(file)
  }

  const uploadCropped = async()=>{
    if(!cropSrc ||!imgRef.current) return
    setUp(cropField)
    try{
      const img = imgRef.current
      const canvas = document.createElement('canvas')
      const rect = img.getBoundingClientRect()
      const scaleX = img.naturalWidth / rect.width
      const scaleY = img.naturalHeight / rect.height
      const sx = (cropBox.x/100)*rect.width*scaleX
      const sy = (cropBox.y/100)*rect.height*scaleY
      const sw = (cropBox.w/100)*rect.width*scaleX
      const sh = (cropBox.h/100)*rect.height*scaleY
      canvas.width = sw; canvas.height = sh
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
      const blob = await new Promise(res=>canvas.toBlob(res,'image/jpeg',0.9))
      const fd=new FormData()
      fd.append('file', blob)
      fd.append('upload_preset', PRESET)
      fd.append('folder', 'pasa-gadang/properti')
      const resp=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:'POST',body:fd})
      const d=await resp.json()
      if(d.secure_url){ setForm(f=>({...f,[cropField]:d.secure_url})); setCropSrc(null); setCropField(null) }
      else alert('Gagal: '+JSON.stringify(d))
    }catch(e){ alert('Error crop') }
    setUp('')
  }

  const submit=async(e)=>{
    e.preventDefault()
    let fasilitasFinal = form.fasilitas || ''
    fasilitasFinal = fasilitasFinal.replace(/\[MAP:.*?\]/g,'').replace(/\[MAP_IMG:.*?\]/g,'').trim()
    if(form.map_link) fasilitasFinal = fasilitasFinal? `${fasilitasFinal}, [MAP:${form.map_link}]` : `[MAP:${form.map_link}]`
    if(form.map_img) fasilitasFinal = fasilitasFinal? `${fasilitasFinal}, [MAP_IMG:${form.map_img}]` : `[MAP_IMG:${form.map_img}]`
    const payload = {...form, fasilitas: fasilitasFinal,
      harga_kredit: form.harga_kredit? parseInt(form.harga_kredit) : null,
      dp: form.dp? parseInt(form.dp) : null,
      cicilan_per_bulan: form.cicilan_per_bulan? parseInt(form.cicilan_per_bulan) : null,
      tenor_bulan: form.tenor_bulan? parseInt(form.tenor_bulan) : null,
      harga_cash: parseInt(form.harga_cash)||0,
      luas_tanah: parseInt(form.luas_tanah)||0,
      luas_bangunan: parseInt(form.luas_bangunan)||0,
      kamar_tidur: parseInt(form.kamar_tidur)||0,
      kamar_mandi: parseInt(form.kamar_mandi)||0,
    }
    delete payload.map_link; delete payload.map_img
    const url=editId?`${API}/properties/${editId}`:`${API}/properties`
    const res = await fetch(url,{method:editId?'PUT':'POST',headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},body:JSON.stringify(payload)})
    if(res.ok){
      load(); setEditId(null)
      setForm({judul:'', tipe_properti:'Rumah', tipe_transaksi:'jual', harga_cash:0, harga_kredit:null, dp:null, cicilan_per_bulan:null, tenor_bulan:null, harga_sewa_per:'bulan', alamat:'', kecamatan:'', luas_tanah:0, luas_bangunan:0, kamar_tidur:2, kamar_mandi:1, sertifikat:'SHM', thumbnail:'', foto_1:'', foto_2:'', foto_3:'', foto_4:'', foto_5:'', foto_6:'', foto_7:'', foto_8:'', video_url:'', video_thumbnail:'', deskripsi:'', fasilitas:'', wa_number:'', badge:'', is_published:false, map_link:'', map_img:''})
    } else alert('Gagal simpan')
  }

  const FieldUpload = ({field, label, required=false}) => {
    const isMap = field==='map_img'
    return (
    <div className="bg-black/40 border border-white/5 p-2.5 rounded-xl space-y-2">
      <p className="text-[10px] font-black tracking-widest text-zinc-400">{label} {required&&<span className="text-red-400">*</span>}</p>
      <input type="file" accept="image/*" onChange={e=>onFileSelect(field, e.target.files[0])} className="w-full text-[11px] text-zinc-400 file:mr-2 file:bg-[#D4AF37] file:text-black file:border-0 file:rounded-full file:px-3 file:py-1 file:font-black file:text-[10px]"/>
      {up===field && <p className="text-[10px] text-[#D4AF37] animate-pulse">UPLOADING...</p>}
      {form[field] && (
        <div className={`w-full rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center ${isMap?'h-48':'h-40'}`}>
          <img src={form[field]} className={`${isMap?'w-full h-full object-cover object-center':'max-w-full max-h-full w-auto h-auto object-contain'}`}/>
        </div>
      )}
      <input value={form[field]||''} onChange={e=>setForm({...form,[field]:e.target.value})} placeholder={`${label} URL`} className="w-full bg-black/50 border border-white/10 p-2.5 rounded-xl text-[11px]" required={required}/>
      <p className="text-[9px] text-zinc-500">Pilih file → crop manual kayak WA → Simpan</p>
    </div>
  )}

  const handleEdit = (i) => {
    const m = i.fasilitas?.match(/\[MAP:(.*?)\]/)
    const mImg = i.fasilitas?.match(/\[MAP_IMG:(.*?)\]/)
    setForm({...i, fasilitas: i.fasilitas?.replace(/\[MAP:.*?\]/g,'').replace(/\[MAP_IMG:.*?\]/g,'').trim(), map_link: m?m[1]:'', map_img: mImg?mImg[1]:'', harga_kredit:i.harga_kredit||'', dp:i.dp||'', cicilan_per_bulan:i.cicilan_per_bulan||'', tenor_bulan:i.tenor_bulan||''})
    setEditId(i.id); setShowFotoLain(true); window.scrollTo(0,0)
  }

  return(
  <AdminLayout title={`PROPERTI (${data.length}) - sesuai model properties`}>
    <div className="grid lg:grid-cols-[480px_1fr] gap-6 mt-4">
      <form onSubmit={submit} className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-3 h-fit max-h-[90vh] overflow-y-auto">
        <input value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})} placeholder="Judul Properti * (ex: Rumah Gadang 2 Lantai)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required/>
        <div className="grid grid-cols-3 gap-2">
          <select value={form.tipe_properti} onChange={e=>setForm({...form,tipe_properti:e.target.value})} className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm">
            <option>Rumah</option><option>Rumah Gadang</option><option>Tanah</option><option>Ruko</option><option>Apartemen</option>
          </select>
          <select value={form.tipe_transaksi} onChange={e=>setForm({...form,tipe_transaksi:e.target.value})} className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm">
            <option value="jual">Jual</option><option value="sewa">Sewa</option><option value="kredit">Kredit</option>
          </select>
          <select value={form.sertifikat} onChange={e=>setForm({...form,sertifikat:e.target.value})} className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm">
            <option>SHM</option><option>HGB</option><option>SHGB</option><option>Girik</option>
          </select>
        </div>
        <div className="bg-black/30 p-3 rounded-xl space-y-2">
          <p className="text-[10px] tracking-widest text-zinc-500 font-black">HARGA</p>
          <input type="number" value={form.harga_cash} onChange={e=>setForm({...form,harga_cash:e.target.value})} placeholder="Harga Cash * (wajib)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required/>
          {form.tipe_transaksi==='kredit' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={form.harga_kredit||''} onChange={e=>setForm({...form,harga_kredit:e.target.value})} placeholder="Harga Kredit" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
                <input type="number" value={form.dp||''} onChange={e=>setForm({...form,dp:e.target.value})} placeholder="DP" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
                <input type="number" value={form.tenor_bulan||''} onChange={e=>setForm({...form,tenor_bulan:e.target.value})} placeholder="Tenor" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
              </div>
              <input type="number" value={form.cicilan_per_bulan||''} onChange={e=>setForm({...form,cicilan_per_bulan:e.target.value})} placeholder="Cicilan Per Bulan" className="w-full bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
            </>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <input type="number" value={form.luas_tanah} onChange={e=>setForm({...form,luas_tanah:e.target.value})} placeholder="LT" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
          <input type="number" value={form.luas_bangunan} onChange={e=>setForm({...form,luas_bangunan:e.target.value})} placeholder="LB" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
          <input type="number" value={form.kamar_tidur} onChange={e=>setForm({...form,kamar_tidur:e.target.value})} placeholder="KT" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
          <input type="number" value={form.kamar_mandi} onChange={e=>setForm({...form,kamar_mandi:e.target.value})} placeholder="KM" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
        </div>
        <input value={form.alamat} onChange={e=>setForm({...form,alamat:e.target.value})} placeholder="Alamat Lengkap" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>

        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl space-y-3">
          <p className="text-[10px] font-black tracking-widest text-[#D4AF37]">📍 MAP REAL + FOTO MAP CROP MANUAL KAYAK WA</p>
          <input value={form.map_link} onChange={e=>setForm({...form,map_link:e.target.value})} placeholder="Paste link Google Maps https://maps.app.goo.gl/..." className="w-full bg-black/50 border border-[#D4AF37]/30 p-3 rounded-xl text-sm"/>
          {form.map_link && <a href={form.map_link} target="_blank" className="text-[10px] text-[#D4AF37] underline">🔗 Test Buka Map Real</a>}
          <FieldUpload field="map_img" label="FOTO MAP / SCREENSHOT PIN MERAH (crop manual)" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input value={form.kecamatan} onChange={e=>setForm({...form,kecamatan:e.target.value})} placeholder="Kecamatan" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
          <input value={form.wa_number} onChange={e=>setForm({...form,wa_number:e.target.value})} placeholder="WA Number" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
        </div>
        <div className="bg-black/30 p-3 rounded-xl space-y-3">
          <p className="text-[10px] tracking-widest text-[#D4AF37] font-black">MEDIA RUMAH - ANTI MELEBAR + CROP MANUAL</p>
          <FieldUpload field="thumbnail" label="THUMBNAIL *" required />
          <FieldUpload field="foto_1" label="FOTO 1" />
          <button type="button" onClick={()=>setShowFotoLain(!showFotoLain)} className="w-full bg-white/5 py-2 rounded-xl text-[11px] font-bold text-[#D4AF37]">{showFotoLain?'Sembunyikan Foto Lain':' + Tambah Foto 2-8 & Video'}</button>
          {showFotoLain && (
            <div className="space-y-3">
              <FieldUpload field="foto_2" label="FOTO 2" />
              <FieldUpload field="foto_3" label="FOTO 3" />
              <FieldUpload field="foto_4" label="FOTO 4" />
              <FieldUpload field="foto_5" label="FOTO 5" />
              <FieldUpload field="foto_6" label="FOTO 6" />
              <FieldUpload field="foto_7" label="FOTO 7" />
              <FieldUpload field="foto_8" label="FOTO 8" />
            </div>
          )}
        </div>
        <textarea value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} placeholder="Deskripsi Lengkap" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-24"/>
        <textarea value={form.fasilitas} onChange={e=>setForm({...form,fasilitas:e.target.value})} placeholder="Fasilitas (pisah koma)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-16"/>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})} placeholder="Badge (BEST, TERJUAL, PROMO)" className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
          <label className="flex items-center justify-center gap-2 bg-black/50 border border-white/10 rounded-xl text-xs"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publish</label>
        </div>
        <button className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs tracking-widest">{editId?'UPDATE PROPERTI':'SIMPAN PROPERTI'}</button>
        {editId && <button type="button" onClick={()=>{setEditId(null); setForm({judul:'', tipe_properti:'Rumah', tipe_transaksi:'jual', harga_cash:0, harga_kredit:null, dp:null, cicilan_per_bulan:null, tenor_bulan:null, harga_sewa_per:'bulan', alamat:'', kecamatan:'', luas_tanah:0, luas_bangunan:0, kamar_tidur:2, kamar_mandi:1, sertifikat:'SHM', thumbnail:'', foto_1:'', foto_2:'', foto_3:'', foto_4:'', foto_5:'', foto_6:'', foto_7:'', foto_8:'', video_url:'', video_thumbnail:'', deskripsi:'', fasilitas:'', wa_number:'', badge:'', is_published:false, map_link:'', map_img:''})}} className="w-full bg-white/10 py-3 rounded-xl font-black text-xs">BATAL EDIT</button>}
      </form>

      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-2 max-h-[90vh] overflow-y-auto">
        {data.map(i=>{
          const hasMap = i.fasilitas?.includes('[MAP:')
          const hasMapImg = i.fasilitas?.includes('[MAP_IMG:')
          return(
          <div key={i.id} className="bg-black/40 border border-white/5 p-3 rounded-xl flex justify-between items-start">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <img src={i.thumbnail||i.foto_1} className="w-14 h-14 rounded-lg object-cover bg-zinc-800"/>
                {i.badge && <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce border border-white shadow-[0_0_10px_rgba(239,68,68,0.8)]">🔥 {i.badge}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold line-clamp-1 flex items-center gap-1">{i.judul} {i.badge && <span className="animate-pulse">🔥</span>}</p>
                <p className="text-[11px] text-zinc-500">{i.tipe_properti} | Rp{i.harga_cash?.toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500">{i.is_published?'✅ Publish':'📝 Draft'} | {hasMap?'📍 Map OK':'⚠️ No Map'} {hasMapImg?'| 🖼️ Foto Map':''}</p>
              </div>
            </div>
            <div className="flex gap-1 ml-2 flex-shrink-0">
              <button onClick={()=>handleEdit(i)} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold">EDIT</button>
              <button onClick={async()=>{if(!confirm('Hapus?'))return;await fetch(`${API}/properties/${i.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-bold">HAPUS</button>
            </div>
          </div>
        )})}
      </div>
    </div>

    {cropSrc && (
      <div className="fixed inset-0 z-[999] bg-black/90 flex flex-col items-center justify-center p-4">
        <div className="bg-[#16161E] border border-white/10 rounded-[24px] p-4 w-full max-w-md">
          <p className="text-[12px] font-black text-[#D4AF37] mb-3">CROP MANUAL - GESER KOTAK KUNING KAYAK WA</p>
          <div className="relative w-full h-[60vh] bg-black rounded-xl overflow-hidden"
            onMouseMove={e=>{if(!dragging)return; const r=e.currentTarget.getBoundingClientRect(); setCropBox(b=>({...b, x: Math.max(0,Math.min(100-b.w, ((e.clientX-r.left)/r.width*100)-b.w/2)), y: Math.max(0,Math.min(100-b.h, ((e.clientY-r.top)/r.height*100)-b.h/2))}))}}
            onTouchMove={e=>{if(!dragging)return; const r=e.currentTarget.getBoundingClientRect(); const t=e.touches[0]; setCropBox(b=>({...b, x: Math.max(0,Math.min(100-b.w, ((t.clientX-r.left)/r.width*100)-b.w/2)), y: Math.max(0,Math.min(100-b.h, ((t.clientY-r.top)/r.height*100)-b.h/2))}))}}
          >
            <img ref={imgRef} src={cropSrc} className="w-full h-full object-contain pointer-events-none"/>
            <div className="absolute border-2 border-[#D4AF37] bg-[#D4AF37]/20 shadow-[0_0_0_2000px_rgba(0,0,0,0.6)]" style={{left:`${cropBox.x}%`, top:`${cropBox.y}%`, width:`${cropBox.w}%`, height:`${cropBox.h}%`}} onMouseDown={()=>setDragging(true)} onMouseUp={()=>setDragging(false)} onTouchStart={()=>setDragging(true)} onTouchEnd={()=>setDragging(false)}>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white bg-black/30">GESER</div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>{setCropSrc(null); setCropField(null)}} className="flex-1 bg-white/10 py-3 rounded-full font-bold text-[12px]">BATAL</button>
            <button onClick={uploadCropped} className="flex-1 bg-[#D4AF37] text-black py-3 rounded-full font-black text-[12px]">{up? 'UPLOADING...' : 'SIMPAN CROP & UPLOAD'}</button>
          </div>
          <p className="text-[9px] text-zinc-500 mt-2 text-center">Tahan & geser kotak kuning ke pin merah, mirip crop di WA</p>
        </div>
      </div>
    )}
  </AdminLayout>)
                                                }
