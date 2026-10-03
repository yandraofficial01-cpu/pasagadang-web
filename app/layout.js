import "./globals.css";

export const metadata = {
  title: "Pasa Gadang - Material & Rumah Gadang #1 di Padang",
  description: "Pasa Material & Rumah Gadang #1 di Padang",
  verification: {
    google: "sBpare7PyIDICjHvIs8mKgjmNcTu7BsrHeOJ5vzFEYY",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
