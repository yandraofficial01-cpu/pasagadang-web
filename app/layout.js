import "./globals.css";
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500','600','700','800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700','800','900'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL("https://pasagadang.com"),
  title: {
    default: "Pasagadang.com | Jual Properti/Rumah dan Material Estetik di Padang, Sumatera Barat",
    template: "%s | Pasagadang.com"
  },
  description: "Jual properti/rumah dan material estetik di Padang, Sumatera Barat mulai 300JT-an. Legalitas aman, bisa KPR.",
  verification: {
    google: "sBpare7PyIDICjHvIs8mKgjMncTu7BsrHeOJ5vzFEYY",
  },
  alternates: {
    canonical: "https://pasagadang.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "Pasagadang.com | Jual Properti/Rumah dan Material Estetik di Padang, Sumatera Barat",
    description: "Jual properti/rumah dan material estetik di Padang, Sumatera Barat mulai 300JT-an. Legalitas aman, bisa KPR.",
    url: "https://pasagadang.com",
    siteName: "Pasagadang.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 675, alt: "Pasagadang.com" }],
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${fraunces.variable} antialiased`}>
      <body className="font-jakarta antialiased bg-[#FFFBF0] text-black [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Pasagadang.com",
              "alternateName": "Pasa Gadang",
              "url": "https://pasagadang.com",
              "logo": "https://pasagadang.com/icon.png",
              "image": "https://pasagadang.com/og-image.jpg",
              "description": "Jual properti/rumah dan material estetik di Padang, Sumatera Barat",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Padang",
                "addressRegion": "Sumatera Barat",
                "addressCountry": "ID"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
