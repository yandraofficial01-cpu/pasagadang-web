export const dynamic = 'force-dynamic'

export default async function sitemap(){
  const API = process.env.NEXT_PUBLIC_API_URL
  const base = 'https://pasagadang.com'

  const staticPages = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/properties`, lastModified: new Date() },
    { url: `${base}/estetika`, lastModified: new Date() },
    { url: `${base}/materials`, lastModified: new Date() },
    { url: `${base}/blogs`, lastModified: new Date() },
  ]

  try{
    const [propsRes, estRes, matRes, blogRes] = await Promise.all([
      fetch(`${API}/properties?is_published=true&limit=1000`, { next: { revalidate: 3600 } }).then(r=>r.json()).catch(()=>[]),
      fetch(`${API}/estetikas?is_active=true&limit=1000`, { next: { revalidate: 3600 } }).then(r=>r.json()).catch(()=>[]),
      fetch(`${API}/materials?is_active=true&limit=1000`, { next: { revalidate: 3600 } }).then(r=>r.json()).catch(()=>[]),
      fetch(`${API}/blogs?is_published=true&limit=1000`, { next: { revalidate: 3600 } }).then(r=>r.json()).catch(()=>[]),
    ])
    const props = propsRes.data||propsRes.items||propsRes||[]
    const est = estRes.data||estRes.items||estRes||[]
    const mat = matRes.data||matRes.items||matRes||[]
    const blogs = blogRes.data||blogRes.items||blogRes||[]

    return [
      ...staticPages,
      ...props.map(p=>({ url: `${base}/properties/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date(), priority: 0.9 })),
      ...est.map(e=>({ url: `${base}/estetika/${e.slug||e.id}`, lastModified: new Date(), priority: 0.7 })),
      ...mat.map(m=>({ url: `${base}/materials/${m.slug||m.id}`, lastModified: new Date(), priority: 0.6 })),
      ...blogs.map(b=>({ url: `${base}/blogs/${b.slug||b.id}`, lastModified: new Date(), priority: 0.5 })),
    ]
  }catch(e){ return staticPages }
                                 }
