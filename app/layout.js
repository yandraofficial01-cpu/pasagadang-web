import "./globals.css";

export const metadata = {
  title: "Pasa Gadang - Material & Rumah Gadang #1 di Padang",
  description: "Pasa Material & Rumah Gadang #1 di Padang - Jual Roster, Roster Minimalis, Material Estetik & Properti Rumah Gadang Modern di Padang, Sumatera Barat",
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
    title: "Pasa Gadang - Material & Rumah Gadang #1 di Padang",
    description: "Pasa Material & Rumah Gadang #1 di Padang",
    url: "https://pasagadang.com",
    siteName: "Pasa Gadang",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Pasa Gadang Logo",
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
