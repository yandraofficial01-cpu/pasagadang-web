'use client'
import { useEffect, useState } from 'react'

export default function PropertiesPage(){
  const [propsData] = useState([
    {id:1, title:'Rumah Gadang Modern 2 Lantai', loc:'Koto Tangah, Padang', price:'850jt', img:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', type:'Gadang Modern'},
    {id:2, title:'Cluster Pasa Gadang Asri', loc:'Lubuk Minturun', price:'450jt', img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', type:'Cluster'},
    {id:3, title:'Rumah Tumbuh Minang', loc:'Pauh, Padang', price:'320jt', img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', type:'Tumbuh'},
  ])

  return <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-10">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter">PROPERTI<span className="text-[#C5A059]"> GADANG</span></h1>
      <p className="text-gray-500 mt-3 max-w-xl">Kurasi rumah adat Minang dengan sentuhan modern. KPR syariah, material toko sendiri, harga transparan.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {propsData.map(p=>(
          <div key={p.id} className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border">
            <div className="h-[240px] overflow-hidden relative">
              <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">{p.type}</span>
            </div>
            <div className="p-6">
              <h3 className="font-black text-lg leading-tight">{p.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{p.loc}</p>
              <div className="flex justify-between items-center mt-5">
                <p className="text-2xl font-black">Rp {p.price}</p>
                <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold">Detail</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>
  }
