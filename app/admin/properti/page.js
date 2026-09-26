'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL

export default function Page(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({
    judul:'', tipe_properti:'Rumah', tipe_transaksi:'jual',
    harga_cash:0, harga_kredit:null, dp:null, cicilan_per_bulan:null, tenor_bulan:null, harga_sewa_per:'bulan',
    alamat:'', kecamatan:'', luas_tanah:0, luas_bangunan:0, kamar_tidur:2, kamar_mandi:1, sertifikat:'SHM',
    thumbnail:'', foto_1:'', foto_2:'', foto_3:'', foto_4:'', foto_5:'', foto_6:'', foto_7:'', foto_8:'',
    video_url:'', video_thumbnail:'', deskripsi:'', fasilitas:'', wa_number:'', badge:'', is_published:false
  })
  const [editId,setEditId]=useState(null)
  const [showFotoLain,setShowFotoLain]=useState(false)

  const tok=()=>document.cookie.split('admin_token=')[1]?.split(';')[0]

  const load=async()=>{
    const r=await fetch(`${API}/properties`,{headers:{Authorization:`Bearer ${tok()}`}})
    const j=await r.json()
    setData(Array.isArray(j)?j:j.data||[])
  }
  useEffect(()=>{load()},[])

  const submit=async(e)=>{
    e.preventDefault()
    // Sesuaikan dengan model: field nullable jadi null kalau kosong
    const payload = {
     ...form,
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
    const url=editId?`${API}/properties/${editId}`:`${API}/properties`
    const res = await fetch(url,{
      method:editId?'PUT':'POST',
      headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    })
    if(res.ok){
      load(); setEditId(null)
      setForm({judul:'', tipe_properti:'Rumah', tipe_transaksi:'jual', harga_cash:0, harga_kredit:null, dp:null, cicilan_per_bulan:null, tenor_bulan:null, harga_sewa_per:'bulan', alamat:'', kecamatan:'', luas_tanah:0, luas_bangunan:0, kamar_tidur:2, kamar_mandi:1, sertifikat:'SHM', thumbnail:'', foto_1:'', foto_2:'', foto_3:'', foto_4:'', foto_5:'', foto_6:'', foto_7:'', foto_8:'', video_url:'', video_thumbnail:'', deskripsi:'', fasilitas:'', wa_number:'', badge:'', is_published:false})
    } else {
      alert('Gagal simpan, cek API')
    }
  }

  return(
  <AdminLayout title={`PROPERTI (${data.length}) - sesuai model properties`}>
    <div className="grid lg:grid-cols-[460px_1fr] gap-6 mt-4">

      {/* FORM KIRI */}
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

        {/* HARGA */}
        <div className="bg-black/30 p-3 rounded-xl space-y-2">
          <p className="text-[10px] tracking-widest text-zinc-500 font-black">HARGA</p>
          <input type="number" value={form.harga_cash} onChange={e=>setForm({...form,harga_cash:e.target.value})} placeholder="Harga Cash * (wajib)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm" required/>

          {form.tipe_transaksi==='kredit' && (
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={form.harga_kredit||''} onChange={e=>setForm({...form,harga_kredit:e.target.value})} placeholder="Harga Kredit" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
              <input type="number" value={form.dp||''} onChange={e=>setForm({...form,dp:e.target.value})} placeholder="DP" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
              <input type="number" value={form.tenor_bulan||''} onChange={e=>setForm({...form,tenor_bulan:e.target.value})} placeholder="Tenor Bulan" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
            </div>
          )}
          {form.tipe_transaksi==='kredit' && (
            <input type="number" value={form.cicilan_per_bulan||''} onChange={e=>setForm({...form,cicilan_per_bulan:e.target.value})} placeholder="Cicilan Per Bulan" className="w-full bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
          )}
          {form.tipe_transaksi==='sewa' && (
            <select value={form.harga_sewa_per} onChange={e=>setForm({...form,harga_sewa_per:e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 rounded-xl text-sm">
              <option value="bulan">Per Bulan</option><option value="tahun">Per Tahun</option><option value="hari">Per Hari</option>
            </select>
          )}
        </div>

        {/* SPEK */}
        <div className="grid grid-cols-4 gap-2">
          <input type="number" value={form.luas_tanah} onChange={e=>setForm({...form,luas_tanah:e.target.value})} placeholder="LT" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
          <input type="number" value={form.luas_bangunan} onChange={e=>setForm({...form,luas_bangunan:e.target.value})} placeholder="LB" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
          <input type="number" value={form.kamar_tidur} onChange={e=>setForm({...form,kamar_tidur:e.target.value})} placeholder="KT" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
          <input type="number" value={form.kamar_mandi} onChange={e=>setForm({...form,kamar_mandi:e.target.value})} placeholder="KM" className="bg-black/50 border border-white/10 p-2 rounded-xl text-sm"/>
        </div>

        <input value={form.alamat} onChange={e=>setForm({...form,alamat:e.target.value})} placeholder="Alamat Lengkap" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.kecamatan} onChange={e=>setForm({...form,kecamatan:e.target.value})} placeholder="Kecamatan" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
          <input value={form.wa_number} onChange={e=>setForm({...form,wa_number:e.target.value})} placeholder="WA Number (08...)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
        </div>

        {/* MEDIA - SESUAI MODEL LU */}
        <div className="bg-black/30 p-3 rounded-xl space-y-2">
          <p className="text-[10px] tracking-widest text-zinc-500 font-black">MEDIA (thumbnail + foto_1..8)</p>
          <input value={form.thumbnail} onChange={e=>setForm({...form,thumbnail:e.target.value})} placeholder="Thumbnail URL *" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
          <input value={form.foto_1} onChange={e=>setForm({...form,foto_1:e.target.value})} placeholder="Foto 1 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>

          <button type="button" onClick={()=>setShowFotoLain(!showFotoLain)} className="text-[10px] text-[#D4AF37] font-bold">+ {showFotoLain?'Sembunyikan':'Tambah Foto 2-8 & Video'}</button>

          {showFotoLain && (
            <div className="space-y-2">
              <input value={form.foto_2} onChange={e=>setForm({...form,foto_2:e.target.value})} placeholder="Foto 2 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.foto_3} onChange={e=>setForm({...form,foto_3:e.target.value})} placeholder="Foto 3 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.foto_4} onChange={e=>setForm({...form,foto_4:e.target.value})} placeholder="Foto 4 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.foto_5} onChange={e=>setForm({...form,foto_5:e.target.value})} placeholder="Foto 5 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.foto_6} onChange={e=>setForm({...form,foto_6:e.target.value})} placeholder="Foto 6 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.foto_7} onChange={e=>setForm({...form,foto_7:e.target.value})} placeholder="Foto 7 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.foto_8} onChange={e=>setForm({...form,foto_8:e.target.value})} placeholder="Foto 8 URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.video_url} onChange={e=>setForm({...form,video_url:e.target.value})} placeholder="Video URL (Youtube)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
              <input value={form.video_thumbnail} onChange={e=>setForm({...form,video_thumbnail:e.target.value})} placeholder="Video Thumbnail URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
            </div>
          )}
        </div>

        <textarea value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} placeholder="Deskripsi Lengkap" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-24"/>
        <textarea value={form.fasilitas} onChange={e=>setForm({...form,fasilitas:e.target.value})} placeholder="Fasilitas (pisah koma: AC, Listrik 2200w, Carport)" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm h-16"/>

        <div className="grid grid-cols-2 gap-2">
          <input value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})} placeholder="Badge (BEST SELLER)" className="bg-black/50 border border-white/10 p-3 rounded-xl text-sm"/>
          <label className="flex items-center justify-center gap-2 bg-black/50 border border-white/10 rounded-xl text-xs"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publish</label>
        </div>

        <button className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs tracking-widest">{editId?'UPDATE PROPERTI':'SIMPAN PROPERTI'}</button>
        {editId&&<button type="button" onClick={()=>{setEditId(null); setForm({judul:'', tipe_properti:'Rumah', tipe_transaksi:'jual', harga_cash:0, harga_kredit:null, dp:null, cicilan_per_bulan:null, tenor_bulan:null, harga_sewa_per:'bulan', alamat:'', kecamatan:'', luas_tanah:0, luas_bangunan:0, kamar_tidur:2, kamar_mandi:1, sertifikat:'SHM', thumbnail:'', foto_1:'', foto_2:'', foto_3:'', foto_4:'', foto_5:'', foto_6:'', foto_7:'', foto_8:'', video_url:'', video_thumbnail:'', deskripsi:'', fasilitas:'', wa_number:'', badge:'', is_published:false})}} className="w-full bg-white/10 py-3 rounded-xl font-black text-xs">BATAL EDIT</button>}
      </form>

      {/* LIST KANAN */}
      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-2 max-h-[90vh] overflow-y-auto">
        {data.map(i=>(
          <div key={i.id} className="bg-black/40 border border-white/5 p-3 rounded-xl flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-bold line-clamp-1">{i.judul}</p>
              <p className="text-[11px] text-zinc-500">{i.tipe_properti} | {i.tipe_transaksi} | Rp{i.harga_cash?.toLocaleString()} | {i.kecamatan}</p>
              <p className="text-[10px] text-zinc-600 mt-1">{i.is_published?'✅ Published':'📝 Draft'} | {i.views} views | {i.foto_1?'📷':''} {i.video_url?'🎥':''}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={()=>{setForm(i);setEditId(i.id); window.scrollTo(0,0)}} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold">EDIT</button>
              <button onClick={async()=>{if(!confirm('Hapus properti ini?'))return;await fetch(`${API}/properties/${i.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-bold">HAPUS</button>
            </div>
          </div>
        ))}
        {data.length===0 && <p className="text-center text-zinc-500 text-sm py-10">Belum ada properti</p>}
      </div>

    </div>
  </AdminLayout>)
}
