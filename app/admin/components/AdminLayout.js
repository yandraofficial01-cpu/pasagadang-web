'use client'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ title, children, isDark = true }){
  const router = useRouter()
  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden p-2 sm:p-4 box-border transition-colors ${isDark ? 'bg-[#0B0B0F] text-[#E5E5E5]' : 'bg-[#FFFBF0] text-black'}`}>
      <div className={`w-full max-w-full box-border flex justify-between items-center gap-2 p-3 sm:p-4 rounded-2xl border mb-4 overflow-hidden transition-colors ${isDark ? 'bg-[#16161E] border-white/10' : 'bg-white border-black/10 shadow-md'}`}>
        <p className={`font-black text-[11px] sm:text-sm truncate min-w-0 flex-1 leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
          PASA GADANG <span className="text-[#D4AF37]">{title}</span>
        </p>
        <button onClick={()=>router.push('/admin')} className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black transition-colors ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>BACK</button>
      </div>
      <div className="w-full max-w-full overflow-x-hidden box-border">
        {children}
      </div>
    </div>
  )
}
