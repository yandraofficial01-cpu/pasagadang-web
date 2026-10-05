import "./globals.css";

export const metadata = {
  title: "RUMAH IMPIAN MULAI 300JT-AN - Pasa Gadang Padang",
  description: "RUMAH IMPIAN MULAI 300JT-AN. BAHAN ESTETIK UNTUK PROPERTI CANTIKMU ADA DI SINI. Jual Properti Rumah Gadang Modern, Roster Minimalis & Material Estetik #1 di Padang, Sumatera Barat!",
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
    title: "RUMAH IMPIAN MULAI 300JT-AN - Pasa Gadang",
    description: "BAHAN ESTETIK UNTUK PROPERTI CANTIKMU ADA DI SINI. Properti Rumah Gadang Modern mulai 300jt & Roster Minimalis terlengkap di Padang!",
    url: "https://pasagadang.com",
    siteName: "Pasa Gadang",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Pasa Gadang - Rumah Impian Mulai 300 Jt-an",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
