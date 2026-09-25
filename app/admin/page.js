'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Admin(){
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = document.cookie.split('admin_token=')[1]?.split(';')[0]
    if(!token){
      router.push('/login')
      return
    }
    // ambil profile
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`,{
      headers:{ Authorization: `Bearer ${token}` }
    })
   .then(r=>r.json())
   .then(setUser)
   .catch(()=> router.push('/login'))
  },[])

  function logout(){
    document.cookie = 'admin_token=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] admin-light">
      {/* Navbar */}
      <div className="bg-white border-b border-black/5 sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-black">P</div>
            <div>
              <p className="font-black tracking-tighter text-[14px]">PASA GADANG</p>
              <p className="text-[10px] text-zinc-500 tracking-widest -mt-1">ADMIN PANEL</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-bold">{user?.nama || 'Admin'}</p>
              <p className="text-[10px] text-zinc-500">{user?.email}</p>
            </div>
            <button onClick={logout} className="bg-black text-white px-5 py-2.5 rounded-full text-[11px] font-black tracking-widest hover:bg-zinc-800">LOGOUT</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-zinc-400">TOTAL PRODUK</p>
            <p className="text-[28px] font-black mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-zinc-400">ORDER HARI INI</p>
            <p className="text-[28px] font-black mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-zinc-400">PENDAPATAN</p>
            <p className="text-[28px] font-black mt-2">Rp 0</p>
          </div>
          <div className="bg-black text-white p-6 rounded-[24px] shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-zinc-400">STATUS API</p>
            <p className="text-[14px] font-bold mt-3">✅ Connected</p>
            <p className="text-[10px] opacity-60">pasagadang-api.vercel.app</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10">
          <h2 className="font-black text-[18px] tracking-tight">MANAGEMENT</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Link href="/" className="bg-white p-6 rounded-[24px] border border-black/5 hover:border-black transition group">
              <div className="w-10 h-10 bg-[#FAF7F2] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition">📦</div>
              <p className="font-bold mt-4">Kelola Produk</p>
              <p className="text-[12px] text-zinc-500 mt-1">Tambah, edit, hapus produk</p>
            </Link>
            <div className="bg-white p-6 rounded-[24px] border border-black/5 opacity-60">
              <div className="w-10 h-10 bg-[#FAF7F2] rounded-xl flex items-center justify-center">🧾</div>
              <p className="font-bold mt-4">Pesanan</p>
              <p className="text-[12px] text-zinc-500 mt-1">Coming soon</p>
            </div>
            <div className="bg-white p-6 rounded-[24px] border border-black/5 opacity-60">
              <div className="w-10 h-10 bg-[#FAF7F2] rounded-xl flex items-center justify-center">👥</div>
              <p className="font-bold mt-4">User</p>
              <p className="text-[12px] text-zinc-500 mt-1">Coming soon</p>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-400 mt-16 tracking-widest">© 2026 PASA GADANG SULTAN • FIXED FROM 500 ERROR 🎉</p>
      </div>
    </div>
  )
    }
