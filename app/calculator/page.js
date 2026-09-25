'use client'
import { useState } from 'react'

export default function Calculator(){
  const [panjang, setPanjang] = useState(10)
  const [lebar, setLebar] = useState(6)
  const [hasil, setHasil] = useState(null)

  const hitung = () => {
    const luas = panjang * lebar
    const bata = luas * 70
    const semen = Math.ceil(luas * 0.3)
    const pasir = (luas * 0.05).toFixed(1)
    setHasil({luas, bata, semen, pasir})
  }

  return <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-10">
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-5xl font-black">KALKULATOR<br/><span className="text-[#C5A059]">MATERIAL</span></h1>
        <p className="text-gray-500 mt-4">Hitung kebutuhan bata, semen, pasir otomatis. Gak perlu takut kurang bahan.</p>

        <div className="bg-white p-8 rounded-[24px] border mt-8 space-y-4">
          <div><label className="text-xs font-black">PANJANG BANGUNAN (m)</label><input type="number" value={panjang} onChange={e=>setPanjang(e.target.value)} className="w-full mt-2 p-4 border rounded-xl text-xl font-black"/></div>
          <div><label className="text-xs font-black">LEBAR BANGUNAN (m)</label><input type="number" value={lebar} onChange={e=>setLebar(e.target.value)} className="w-full mt-2 p-4 border rounded-xl text-xl font-black"/></div>
          <button onClick={hitung} className="w-full bg-black text-white py-4 rounded-xl font-black text-lg">HITUNG SEKARANG →</button>
        </div>
      </div>

      <div className="bg-black text-white rounded-[32px] p-8 md:p-10 h-fit">
        <p className="text-[#C5A059] font-black tracking-widest text-xs">ESTIMASI KEBUTUHAN</p>
        {!hasil? <p className="text-white/50 mt-10">Masukkan ukuran dulu bro...</p> :
        <div className="mt-8 space-y-6">
          <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/60">Luas Bangunan</span><span className="font-black text-xl">{hasil.luas} m²</span></div>
          <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/60">Bata Merah</span><span className="font-black text-xl">{hasil.bata.toLocaleString()} pcs</span></div>
          <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-white/60">Semen</span><span className="font-black text-xl">{hasil.semen} sak</span></div>
          <div className="flex justify-between"><span className="text-white/60">Pasir</span><span className="font-black text-xl">{hasil.pasir} m³</span></div>
          <button className="w-full mt-8 bg-[#C5A059] text-black py-4 rounded-xl font-black">PESAN MATERIAL INI</button>
        </div>
        }
      </div>
    </div>
  </main>
      }
