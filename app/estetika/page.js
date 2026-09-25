
'use client'
import { useState } from 'react'

export default function EstetikaRoster(){
  const [active, setActive] = useState('Semua')
  const roster = [
    {id:1, name:'Roster Granit Candi Borobudur', cat:'Granit Alam', price:'Rp 125.000', img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', best:true},
    {id:2, name:'Roster Minimalis Bulan Sabit', cat:'Granit Alam', price:'Rp 95.000', img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', best:false},
    {id:3, name:'Roster Motif Pucuk Rebung', cat:'Budaya Minang', price:'Rp 145.000', img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', best:true},
    {id:4, name:'Roster Alam Lubang Silang', cat:'Granit Alam', price:'Rp 85.000', img:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', best:false},
    {id:5, name:'Roster Roster Putih Tulang', cat:'Premium', price:'Rp 175.000', img:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600', best:true},
    {id:6, name:'Roster Hitam Doff Anti Lumut', cat:'Premium', price:'Rp 185.000', img:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600', best:false},
  ]

  const filtered = active === 'Semua'? roster : roster.filter(r=>r.cat === active)

  return <main className="min-h-screen bg-[#F8F5F0] p-4 md:p-10">
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="text-[11px] font-black tracking-[0.3em] text-[#C5A059]">ESTETIKA • ROSTER GRANIT ALAM</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-2">ROSTER<br/>ALAM<span className="text-[#C5A059]">.</span></h1>
        </div>
        <p className="max-w-sm text-sm text-gray-500 leading-relaxed">Bukan roster semen abal-abal. Ini granit alam asli Padang, anti lumut, anti retak, bikin rumah adem & estetik 20 tahun.</p>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mt-10 overflow-x-auto pb-2">
        {['Semua','Granit Alam','Budaya Minang','Premium'].map(c=>(
          <button key={c} onClick={()=>setActive(c)} className={`px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition ${active===c? 'bg-black text-white' : 'bg-white border'}`}>{c}</button>
        ))}
      </div>

      {/* GRID PRODUK */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {filtered.map(r=>(
          <div key={r.id} className="group bg-white rounded-[24px] p-3 border hover:shadow-2xl transition-all duration-500">
            <div className="h-[320px] bg-[#F0EDE8] rounded-[18px] overflow-hidden relative">
              <img src={r.img} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition duration-700"/>
              {r.best && <span className="absolute top-3 left-3 bg-[#C5A059] text-black text-[10px] font-black px-3 py-1.5 rounded-full">BEST SELLER</span>}
              <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black">{r.cat}</span>
            </div>
            <div className="p-4">
              <h3 className="font-black text-[15px] leading-tight">{r.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-black">{r.price}<span className="text-[11px] font-normal text-gray-500"> /pcs</span></p>
                <button className="bg-black text-white w-10 h-10 rounded-full font-black group-hover:bg-[#C5A059] group-hover:text-black transition">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* USP */}
      <div className="grid md:grid-cols-3 gap-4 mt-16 bg-black text-white rounded-[24px] p-6 md:p-10">
        <div><p className="text-[#C5A059] font-black">01</p><h4 className="font-bold mt-2">Granit Alam 100%</h4><p className="text-white/60 text-sm mt-1">Bukan cetakan semen. Lebih kuat, tidak jamuran.</p></div>
        <div><p className="text-[#C5A059] font-black">02</p><h4 className="font-bold mt-2">Custom Ukuran</h4><p className="text-white/60 text-sm mt-1">Bisa request 20x20, 30x30, sampai 40x40 cm.</p></div>
        <div><p className="text-[#C5A059] font-black">03</p><h4 className="font-bold mt-2">Kirim Se-Sumatra</h4><p className="text-white/60 text-sm mt-1">Stok 5.000+ pcs ready di gudang Padang.</p></div>
      </div>
    </div>
  </main>
    }
