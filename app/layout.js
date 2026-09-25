import "./globals.css";

export const metadata = {
  title: "Pasa Gadang - Material & Rumah Gadang #1 di Padang",
  description: "Pasa Material & Rumah Gadang #1 di Padang",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
