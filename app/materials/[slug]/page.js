import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-pasagadang.onrender.com'

export async function generateMetadata({ params }){
  const { slug } = await params
  try{
    const res = await fetch(`${API_URL}/materials/${slug}`, { next: { revalidate: 3600 } })
    if(!res.ok) return { title: 'Material Tidak Ditemukan | Pasa Gadang' }
    const m = await res.json()
    return {
      title: `${m.nama} - ${m.brand} | Toko Material Pasa Gadang Padang`,
      description: m.spesifikasi?.slice(0, 160) || `${m.nama} ${m.brand} harga Rp ${m.harga} di Toko Material Pasa Gadang.`,
      openGraph: {
        title: m.nama,
        description: m.spesifikasi || m.deskripsi,
        images: [m.foto_1],
      }
    }
  }catch{
    return { title: 'Material | Pasa Gadang' }
  }
}

export default async function DetailPage({ params }){
  const { slug } = await params
  const res = await fetch(`${API_URL}/materials/${slug}`, { next: { revalidate: 60 }, cache: 'no-store' })

  if(!res.ok){
    return (
      <main className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-5xl font-black text-black">404</h1>
        <p className="font-bold mt-2">Material {slug} tidak ditemukan</p>
        <p className="text-xs opacity-60 mt-1">API: {API_URL}/materials/{slug}</p>
        <Link href="/materials" className="mt-6 bg-black text-white px-8 py-3 rounded-full font-black">KEMBALI</Link>
      </main>
    )
  }

  const m = await res.json()
  const hargaDiskon = m.harga_promo && m.harga_promo < m.harga? m.harga_promo : null

  const waMsg = encodeURIComponent(`Halo Pasa Gadang, saya mau pesan:\n\n*${m.nama}*\nBrand: ${m.brand}\nHarga: Rp ${Number(hargaDiskon||m.harga).toLocaleString('id-ID')}\nLink: https://pasagadang-web.vercel.app/materials/${m.slug}`)
  const waNumber = '628979879518'

  return(
    <main className="min-h-screen bg-[#FFFBF0] pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-10 pt-6">
        <Link href="/materials" className="font-black text-black text-sm">← KEMBALI KE MATERIAL</Link>

        <div className="grid md:grid-cols-2 gap-8 mt-6 bg-white rounded-[28px] border-[2px] border-[#D4AF37] p-4 md:p-8 shadow-[6px_6px_0px_0px_#D4AF37]">
          <div className="bg-white rounded-[20px] border-[1.5px] border-black/10 p-2">
            <img src={m.foto_1} alt={m.nama} className="w-full h-[350px] md:h-[500px] object-contain rounded-xl" />
          </div>

          <div>
            <span className="bg-[#D4AF37] text-black text-[11px] font-black px-3 py-1 rounded-full">{m.kategori} • {m.brand}</span>
            <h1 className="text-[28px] md:text-[36px] font-black text-black leading-none mt-4">{m.nama}</h1>
            <p className="mt-3 font-bold text-black/60 text-sm">{m.spesifikasi || m.deskripsi}</p>

            <div className="mt-6">
              {hargaDiskon && <p className="text-sm font-bold line-through text-black/40">Rp {Number(m.harga).toLocaleString('id-ID')}</p>}
              <p className="text-[32px] font-black text-[#B8960C]">Rp {Number(hargaDiskon||m.harga).toLocaleString('id-ID')}<span className="text-[16px] text-black/50 ml-2">/{m.satuan}</span></p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[16px] shadow-[3px_3px_0px_0px_black]">PESAN VIA WHATSAPP</a>
              <Link href="/materials" className="bg-white border-[2px] border-black text-black text-center py-4 rounded-full font-black text-[14px]">LIHAT PRODUK LAIN</Link>
            </div>

            <div className="mt-6 bg-[#FFFBF0] rounded-xl p-4 border border-black/10">
              <p className="text-[12px] font-black">Link SEO untuk dibagikan:</p>
              <p className="text-[12px] font-bold text-black/70 break-all mt-1">pasagadang-web.vercel.app/materials/{m.slug}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
      }
