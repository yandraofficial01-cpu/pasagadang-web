import Link from 'next/link'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

function formatRupiah(n){ return new Intl.NumberFormat('id-ID').format(n||0) }

export async function generateMetadata({ params }){
  const { slug } = await params
  try{
    const res = await fetch(`${API_URL}/materials/${slug}`, { next: { revalidate: 3600 } })
    if(!res.ok) return { title: 'Material | Pasa Gadang' }
    const m = await res.json()
    return {
      title: `${m.nama} - ${m.brand} | Pasa Gadang`,
      description: m.spesifikasi?.slice(0,160),
      openGraph: { title: m.nama, images: [m.foto_1] }
    }
  }catch{ return { title: 'Material | Pasa Gadang' } }
}

export default async function DetailPage({ params }){
  const { slug } = await params
  const res = await fetch(`${API_URL}/materials/${slug}`, { cache: 'no-store' })

  if(!res.ok){
    return (
      <main className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-5xl font-black text-black">404</h1>
        <p className="font-bold text-black mt-2">Material {slug} tidak ditemukan di {API_URL}</p>
        <Link href="/materials" className="mt-6 bg-black text-white px-8 py-3 rounded-full font-black">KEMBALI</Link>
      </main>
    )
  }
  const m = await res.json()
  const hasPromo = m.harga_promo && m.harga_promo < m.harga
  const hargaAktif = hasPromo? m.harga_promo : m.harga
  const wa62 = String(m.wa_number||'08979879518').replace(/[^0-9]/g,'').replace(/^0/,'62')

  return(
    <main className="min-h-screen bg-[#FFFBF0]">
      {/* NAV SAMA KAYAK LIST */}
      <nav className="sticky top-0 z-50 bg-white border-b-[2px] border-[#D4AF37] px-4 md:px-10 py-4 flex justify-between items-center">
        <Link href="/" className="font-black text-[22px] tracking-tighter text-black">PASA<span className="text-[#D4AF37]"> GADANG</span></Link>
        <Link href="/materials" className="px-5 py-2.5 rounded-full font-black text-[11px] bg-black text-white">MATERIAL</Link>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <Link href="/materials" className="font-black text-black text-sm">← KEMBALI</Link>

        {/* CARD SAMA PERSIS KAYAK DI LISTING */}
        <div className="mt-6 bg-white rounded-[28px] overflow-hidden border-[2px] border-[#D4AF37] shadow-[0_10px_40px_rgba(212,175,55,0.18)] grid md:grid-cols-2">

          <div className="h-[350px] md:h-[560px] relative bg-white flex items-center justify-center p-8">
            <img src={m.foto_1} alt={m.nama} className="w-full h-full object-contain"/>
            {m.badge && <span className={`absolute top-6 left-6 text-[11px] font-black px-4 py-1.5 rounded-full ${m.badge.toLowerCase()==='promo'?'bg-red-500 text-white':'bg-[#D4AF37] text-black'}`}>{m.badge.toUpperCase()}</span>}
            <div className="absolute bottom-6 left-6 bg-black text-white text-[11px] font-bold px-4 py-2 rounded-full">{m.kategori?.toUpperCase()} • {m.brand?.toUpperCase()}</div>
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <h1 className="font-black text-[26px] md:text-[36px] text-black leading-tight">{m.nama}</h1>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl"><div className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Satuan</div><div className="text-[15px] font-black text-black mt-1">{m.satuan}</div></div>
              <div className="bg-[#FFFBF0] border border-[#D4AF37]/30 p-3 rounded-2xl"><div className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Ukuran</div><div className="text-[15px] font-black text-black mt-1">{m.ukuran||'-'}</div></div>
            </div>

            <div className="mt-3 p-3 rounded-2xl bg-black text-white"><div className="text-[10px] font-bold tracking-widest opacity-60 uppercase">Spesifikasi</div><div className="text-[13px] font-bold mt-1">{m.spesifikasi || m.deskripsi || 'Siap antar, paling tidak setelah kirim bukti booking minimal 20%'}</div></div>

            <div className="mt-5">
              {hasPromo && <p className="text-[12px] line-through font-bold text-black/40">Rp {formatRupiah(m.harga)}</p>}
              <p className="text-[32px] font-black text-[#B8960C]">Rp {formatRupiah(hargaAktif)}</p>
              <p className="text-[11px] font-black tracking-widest text-black/50">PER {m.satuan?.toUpperCase()} • STOK MIN: {m.stok_minimum}</p>
            </div>

            <div className="mt-auto grid grid-cols-[1.6fr_1fr] gap-3 pt-6">
              <a href={`https://wa.me/${wa62}?text=Halo%20Pasa%20Gadang%20mau%20pesan%20${encodeURIComponent(m.nama)}%20https://pasagadang-web.vercel.app/materials/${m.slug}`} target="_blank" className="bg-[#25D366] text-white text-center py-4 rounded-full font-black text-[15px]">Whatsapp</a>
              <Link href="/materials" className="bg-white border-[2px] border-black text-black text-center py-4 rounded-full font-black text-[14px]">↗ Bagikan</Link>
            </div>

            <p className="mt-4 text-[11px] font-bold text-black/40 break-all bg-[#FFFBF0] p-2 rounded">pasagadang-web.vercel.app/materials/{m.slug}</p>
          </div>
        </div>
      </div>
    </main>
  )
      }
