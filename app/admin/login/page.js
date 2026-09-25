'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const router = useRouter()

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true)
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message || 'Login gagal')
      document.cookie = `admin_token=${data.token || data.access_token}; path=/; max-age=86400; SameSite=Lax`
      router.push('/admin')
    }catch(err){
      alert(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4 relative overflow-hidden">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-10 bg-white border border-black/5 rounded-full px-5 py-2.5 text-[11px] font-bold tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2">
        ← KEMBALI
      </Link>

      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#E8DCCF] rounded-full blur-[120px] opacity-60" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#D6CFC4] rounded-full blur-[120px] opacity-50" />

      <div className="bg-white/90 backdrop-blur-xl p-[32px] rounded-[32px] border border-black/[0.06] shadow-[0_32px_64px_rgba(0,0,0,0.08)] w-full max-w-[400px] relative mt-10">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-black rounded-[14px] flex items-center justify-center text-white font-black text-[20px]">P</div>
          <div className="text-[10px] font-bold tracking-[0.2em] bg-[#F9F5F0] border px-3 py-1.5 rounded-full">CMS v2.0</div>
        </div>

        <h1 className="text-[28px] font-black tracking-tighter leading-none mt-8">LOGIN ADMIN</h1>
        <p className="text-[12px] text-zinc-500 mt-2 font-medium tracking-wide">Pasa Gadang • Management System</p>

        <form onSubmit={handleLogin} className="mt-8">
          <div className="space-y-3.5">
            <input
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              className="w-full bg-[#F9F6F1] border border-black/[0.04] p-4 px-6 rounded-[16px] text-[14px] font-medium outline-none focus:bg-white focus:border-black focus:ring-[3px] focus:ring-black/5 transition-all"
            />
            <div className="relative">
              <input
                value={password}
                onChange={e=>setPassword(e.target.value)}
                placeholder="Password"
                type={show? "text" : "password"}
                required
                className="w-full bg-[#F9F6F1] border border-black/[0.04] p-4 px-6 pr-16 rounded-[16px] text-[14px] font-medium outline-none focus:bg-white focus:border-black focus:ring-[3px] focus:ring-black/5 transition-all"
              />
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-2 bottom-2 px-4 text-[11px] font-black text-zinc-400 hover:text-black">
                {show? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <button disabled={loading} className="w-full mt-6 bg-black text-white py-[16px] rounded-[16px] font-black text-[13px] tracking-[0.15em] hover:bg-zinc-900 active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
            {loading? 'MEMPROSES...' : 'MASUK →'}
          </button>
        </form>
      </div>
    </div>
  )
    }
