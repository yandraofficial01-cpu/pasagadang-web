import Link from 'next/link'
const API_URL = 'https://pasagadang-api.vercel.app'

export default async function DetailPage({ params }){
  const { slug } = await params
  const res = await fetch(`${API_URL}/materials/${slug}`, { cache: 'no-store' })

  if(!res.ok){
    return <main className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#FFFBF0]">
      <h1 className="text-5xl font-black">404</h1>
      <p>API tidak menemukan {slug}</p>
      <p className="text-xs mt-2 opacity-60">{API_URL}/materials/{slug}</p>
      <Link href="/materials" className="mt-6 bg-black text-white px-6 py-3 rounded-full font-black">KEMBALI</Link>
    </main>
  }
  const m = await res.json()
  return(
    <main className="min-h-screen bg-[#FFFBF0] p-10">
      <Link href="/materials">← KEMBALI</Link>
      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-[28px] border-2 border-[#D4AF37] p-6 grid md:grid-cols-2 gap-6">
        <img src={m.foto_1} alt={m.nama} className="h-[400px] object-contain"/>
        <div>
          <h1 className="text-3xl font-black">{m.nama}</h1>
          <p className="text-3xl font-black text-[#B8960C] mt-4">Rp {m.harga} / {m.satuan}</p>
          <a href={`https://wa.me/628979879518?text=Halo%20mau%20${m.nama}%20https://pasagadang-web.vercel.app/materials/${m.slug}`} target="_blank" className="mt-6 block bg-[#25D366] text-white text-center py-4 rounded-full font-black">WA</a>
        </div>
      </div>
    </main>
  )
}
