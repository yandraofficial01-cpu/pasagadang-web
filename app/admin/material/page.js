'use client'
import {useEffect,useState} from 'react'
import AdminLayout from '../components/AdminLayout'
const API=process.env.NEXT_PUBLIC_API_URL

export default function Page(){
  const [data,setData]=useState([])
  const [form,setForm]=useState({
    nama:'', kategori:'', brand:'',
    foto_1:'', foto_2:'', foto_3:'',
    spesifikasi:'', ukuran:'',
    harga:'', satuan:'pcs', stok_minimum:10,
    wa_number:'', deskripsi:'',
    badge:'', harga_promo:'', is_active:true
  })
  const [editId,setEditId]=useState(null)
  const [loading,setLoading]=useState(false)

  const tok=()=>document.cookie.split('admin_token=')[1]?.split(';')[0]

  const load=async()=>{
    const r=await fetch(`${API}/materials`,{headers:{Authorization:`Bearer ${tok()}`}})
    const j=await r.json()
    setData(Array.isArray(j)?j:j.data||[])
  }
  useEffect(()=>{load()},[])

  const submit=async(e)=>{
    e.preventDefault()
    if(!form.nama ||!form.kategori ||!form.harga) return alert('Nama, Kategori, Harga wajib!')
    setLoading(true)
    try{
      const payload={
       ...form,
        harga: parseInt(form.harga)||0,
        harga_promo: form.harga_promo?parseInt(form.harga_promo):null,
        stok_minimum: parseInt(form.stok_minimum)||10
      }
      const res=await fetch(editId?`${API}/materials/${editId}`:`${API}/materials`,{
        method:editId?'PUT':'POST',
        headers:{Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      })
      if(!res.ok) throw new Error(await res.text())
      setForm({nama:'',kategori:'',brand:'',foto_1:'',foto_2:'',foto_3:'',spesifikasi:'',ukuran:'',harga:'',satuan:'pcs',stok_minimum:10,wa_number:'',deskripsi:'',badge:'',harga_promo:'',is_active:true})
      setEditId(null)
      load()
    }catch(err){ alert('Error: '+err.message) }
    setLoading(false)
  }

  const edit=(item)=>{
    setForm({
      nama:item.nama||'',
      kategori:item.kategori||'',
      brand:item.brand||'',
      foto_1:item.foto_1||'',
      foto_2:item.foto_2||'',
      foto_3:item.foto_3||'',
      spesifikasi:item.spesifikasi||'',
      ukuran:item.ukuran||'',
      harga:item.harga||'',
      satuan:item.satuan||'pcs',
      stok_minimum:item.stok_minimum||10,
      wa_number:item.wa_number||'',
      deskripsi:item.deskripsi||'',
      badge:item.badge||'',
      harga_promo:item.harga_promo||'',
      is_active:item.is_active??true
    })
    setEditId(item.id)
    window.scrollTo({top:0,behavior:'smooth'})
  }

  const inp="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]"
  const label="text-[10px] font-black tracking-widest text-white/40 mb-1 ml-1"

  return(
  <AdminLayout title={`MATERIAL (${data.length})`}>
    <div className="grid lg:grid-cols-[400px_1fr] gap-6 mt-4">
      {/* FORM */}
      <form onSubmit={submit} className="bg-[#16161E] border border-[#D4AF37]/20 p-5 rounded-[24px] space-y-3 h-fit sticky top-6">
        <div className="text-[11px] font-black tracking-[0.3em] text-[#D4AF37]">{editId?'EDIT MATERIAL':'INPUT BARU'}</div>

        <div><div className={label}>NAMA MATERIAL *</div><input value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} placeholder="Semen Padang 50kg" className={inp} required/></div>

        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>KATEGORI *</div><input value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} placeholder="semen/keramik/cat" className={inp} required/></div>
          <div><div className={label}>BRAND</div><input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} placeholder="Semen Padang" className={inp}/></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div><div className={label}>HARGA *</div><input type="number" value={form.harga} onChange={e=>setForm({...form,harga:e.target.value})} placeholder="75000" className={inp}/></div>
          <div><div className={label}>HARGA PROMO</div><input type="number" value={form.harga_promo} onChange={e=>setForm({...form,harga_promo:e.target.value})} placeholder="69000" className={inp}/></div>
          <div><div className={label}>SATUAN</div><select value={form.satuan} onChange={e=>setForm({...form,satuan:e.target.value})} className={inp}><option>pcs</option><option>sak</option><option>dus</option><option>meter</option><option>kg</option><option>roll</option><option>buah</option></select></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>UKURAN</div><input value={form.ukuran} onChange={e=>setForm({...form,ukuran:e.target.value})} placeholder="50kg / 60x60" className={inp}/></div>
          <div><div className={label}>STOK MINIMUM</div><input type="number" value={form.stok_minimum} onChange={e=>setForm({...form,stok_minimum:e.target.value})} className={inp}/></div>
        </div>

        <div><div className={label}>FOTO 1 * (UTAMA)</div><input value={form.foto_1} onChange={e=>setForm({...form,foto_1:e.target.value})} placeholder="https://..." className={inp}/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>FOTO 2</div><input value={form.foto_2} onChange={e=>setForm({...form,foto_2:e.target.value})} placeholder="https://..." className={inp}/></div>
          <div><div className={label}>FOTO 3</div><input value={form.foto_3} onChange={e=>setForm({...form,foto_3:e.target.value})} placeholder="https://..." className={inp}/></div>
        </div>

        <div><div className={label}>SPESIFIKASI</div><input value={form.spesifikasi} onChange={e=>setForm({...form,spesifikasi:e.target.value})} placeholder="Kuat tekan, tahan air, SNI..." className={inp}/></div>
        <div><div className={label}>DESKRIPSI</div><textarea value={form.deskripsi} onChange={e=>setForm({...form,deskripsi:e.target.value})} placeholder="Deskripsi lengkap..." className={`${inp} h-20`}/></div>

        <div className="grid grid-cols-2 gap-2">
          <div><div className={label}>BADGE</div><input value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})} placeholder="promo/baru/best" className={inp}/></div>
          <div><div className={label}>WA NUMBER</div><input value={form.wa_number} onChange={e=>setForm({...form,wa_number:e.target.value})} placeholder="6285..." className={inp}/></div>
        </div>

        <div className="flex gap-2">
          <button disabled={loading} className="flex-1 bg-[#D4AF37] text-black py-3 rounded-xl font-black text-xs tracking-widest">{loading?'...':editId?'UPDATE MATERIAL':'SIMPAN MATERIAL'}</button>
          {editId && <button type="button" onClick={()=>{setEditId(null); setForm({nama:'',kategori:'',brand:'',foto_1:'',foto_2:'',foto_3:'',spesifikasi:'',ukuran:'',harga:'',satuan:'pcs',stok_minimum:10,wa_number:'',deskripsi:'',badge:'',harga_promo:'',is_active:true})}} className="bg-white/10 text-white px-5 py-3 rounded-xl font-black text-xs">BATAL</button>}
        </div>
      </form>

      {/* LIST */}
      <div className="bg-[#16161E] border border-white/10 p-5 rounded-[24px] space-y-2 h-fit">
        <div className="text-[11px] font-black tracking-widest text-white/40 mb-3">DAFTAR MATERIAL - TAP EDIT</div>
        {data.map(i=>(
          <div key={i.id} className="bg-black/40 border border-white/5 p-3 rounded-xl flex justify-between items-center group hover:border-[#D4AF37]/30 transition">
            <div className="flex gap-3 items-center">
              <img src={i.foto_1||'https://via.placeholder.com/60'} className="w-12 h-12 rounded-lg object-cover bg-black"/>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{i.nama} {i.badge && <span className="ml-2 bg-[#D4AF37] text-black text-[9px] px-2 py-0.5 rounded-full">{i.badge.toUpperCase()}</span>}</p>
                <p className="text-[11px] text-zinc-500 font-bold">{i.kategori} • {i.brand} • Rp{Number(i.harga||0).toLocaleString('id-ID')}/{i.satuan} • StokMin:{i.stok_minimum}</p>
                <p className="text-[10px] text-zinc-600 truncate w-64">{i.spesifikasi}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={()=>edit(i)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-black">EDIT</button>
              <button onClick={async()=>{if(!confirm('Hapus '+i.nama+'?'))return; await fetch(`${API}/materials/${i.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${tok()}`}});load()}} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-black">HAPUS</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AdminLayout>)
  }
