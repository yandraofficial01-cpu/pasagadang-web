'use client'
import { useRouter } from 'next/navigation'
export default function AdminLayout({ title, children }){
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#E5E5E5] p-4">
      <div className="flex justify-between items-center bg-[#16161E] p-4 rounded-2xl border border-white/10 mb-6">
        <p className="font-black text-sm">PASA GADANG <span className="text-[#D4AF37]">CMS - {title}</span></p>
        <button onClick={()=>router.push('/admin')} className="bg-white text-black px-4 py-2 rounded-full text-xs font-black">BACK</button>
      </div>
      {children}
    </div>
  )
    }
