import './globals.css'
import Navbar from '@/components/navbar'
export default function RootLayout({children}){return <html><body className="bg-gray-50"><Navbar/>{children}</body></html>}
