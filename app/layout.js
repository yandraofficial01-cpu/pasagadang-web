import "./globals.css";

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
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
