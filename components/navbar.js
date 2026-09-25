'use client'
import Link from 'next/link'
export default function Navbar(){
 return <nav className="bg-black text-white p-4 flex justify-between sticky top-0 z-50"><Link href="/" className="font-black">PASAGADANG</Link><div className="flex gap-3 text-sm font-bold"><Link href="/properties">Properti</Link><Link href="/calculator">Kalkulator</Link><Link href="/gudang">Gudang</Link></div></nav>
}
