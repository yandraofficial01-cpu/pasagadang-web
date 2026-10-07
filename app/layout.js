import "./globals.css";
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500','600','700','800'], // <- FIX: hapus 900, max 800
  variable: '--font-jakarta',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700','800','900'], // Fraunces ada 900 aman
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata = {
  title: "Jual Properti / Rumah di Padang, Sumatera Barat",
  description: "Jual properti / rumah di Padang, Sumatera Barat mulai 300JT-an. Bahan estetik untuk properti cantikmu ada di sini.",
  verification: {
    google: "sBpare7PyIDICjHvIs8mKgjMncTu7BsrHeOJ5vzFEYY",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "Jual Properti / Rumah di Padang, Sumatera Barat",
    description: "Jual properti / rumah di Padang, Sumatera Barat mulai 300JT-an. Bahan estetik untuk properti cantikmu ada di sini.",
    url: "https://pasagadang.com",
    siteName: "Pasa Gadang",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Jual Properti Rumah di Padang Sumatera Barat",
      },
    ],
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${fraunces.variable} antialiased`}>
      <body 
        className="font-jakarta antialiased bg-[#FFFBF0] text-black 
        [text-rendering:optimizeLegibility] 
        [-webkit-font-smoothing:antialiased] 
        [-moz-osx-font-smoothing:grayscale]"
      >
        {children}
      </body>
    </html>
  );
}
