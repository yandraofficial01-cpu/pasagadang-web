'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function AdminDashboard(){
  const router = useRouter()
  const timeoutRef = useRef(null)

  const menus = [
    { label: 'PROPERTI', desc: 'Rumah, Tanah, Ruko', path: '/admin/properti', icon: '🏠' },
    { label: 'MATERIAL', desc: 'Semen, Besi, Cat', path: '/admin/material', icon: '🧱' },
    { label: 'ESTETIKA', desc: 'Interior & Desain', path: '/admin/estetika', icon: '✨' },
    { label: 'BLOG', desc: 'Artikel & Berita', path: '/admin/blog', icon: '📰' },
    { label: 'PENGUNJUNG', desc: 'Inquiry & Leads', path: '/admin/pengunjung', icon: '👥' },
  ]

  const doLogout = () => {
    document.cookie='admin_token=; path=/; max-age=0'
    if (typeof window!== 'undefined') {
      localStorage.removeItem('token')
    }
    router.push('/admin/login')
  }

  useEffect(() => {
    let t
    const resetTimer = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        alert('Sesi habis 15 menit, login lagi bro')
        doLogout()
      }, 15 * 60 * 1000)
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      clearTimeout(t)
      events.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#E5E5E5] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#16161E] p-5 rounded-[20px] border border-white/10 flex justify-between items-center">
          <p className="font-black tracking-widest text-sm">PASA GADANG <span className="text-[#D4AF37]">ADMIN</span></p>
          <button onClick={doLogout} className="bg-white text-black px-5 py-2 rounded-full text-xs font-black">LOGOUT</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {menus.map(m=>(
            <button key={m.path} onClick={()=>router.push(m.path)} className="bg-[#16161E] border border-white/10 rounded-[24px] p-8 text-left hover:border-[#D4AF37]/30 transition">
              <div className="text-3xl">{m.icon}</div>
              <p className="mt-4 font-black tracking-widest">{m.label}</p>
              <p className="text-xs text-zinc-500 mt-1">{m.desc}</p>
              <p className="mt-4 text-[10px] text-[#D4AF37] tracking-widest">KLIK UNTUK MASUK →</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
              }
