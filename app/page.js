import HomeClient from "./components/HomeClient"

async function fetchJSON(path) {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) return []
  try {
    const res = await fetch(`${base}${path}`, { cache: "no-store" })
    if (!res.ok) return []
    const j = await res.json()
    return j.data || j.items || j || []
  } catch {
    return []
  }
}

export const metadata = {
  title: "Pasa Gadang - Jual Properti, Roster & Material di Padang",
  description: "Pasa Gadang jual Properti impian, Bahan Estetika Roster/Granit, dan Material bangunan. Kirim online se Sumatera Barat.",
}

export default async function Page() {
  const [properties, materials, estetikas, blogs] = await Promise.all([
    fetchJSON("/properties/?is_published=true&limit=20"),
    fetchJSON("/materials/?is_active=true&limit=6"),
    fetchJSON("/estetikas/?is_active=true&limit=6"),
    fetchJSON("/blogs/?is_published=true&limit=6"),
  ])

  return (
    <HomeClient
      initialProperties={properties}
      initialMaterials={materials}
      initialEstetikas={estetikas}
      initialBlogs={blogs}
    />
  )
}
