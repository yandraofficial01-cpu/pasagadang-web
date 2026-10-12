// app/blogs/[slug]/layout.js
// FILE SERVER UNTUK GOOGLE DISCOVER - JANGAN PAKE 'use client'

export async function generateMetadata({ params }) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'
  
  try {
    const res = await fetch(`${API}/blogs/${params.slug}`, {
      next: { revalidate: 3600 }
    })
    
    if (!res.ok) throw new Error('blog not found')
    
    const j = await res.json()
    const b = j.blog || j.data || j

    return {
      title: `${b.judul} | PasaGadang.com`,
      description: b.excerpt ? b.excerpt.slice(0, 155) : b.judul,
      alternates: {
        canonical: `https://pasagadang.com/blogs/${params.slug}`,
      },
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
      openGraph: {
        title: b.judul,
        description: b.excerpt,
        url: `https://pasagadang.com/blogs/${params.slug}`,
        type: "article",
        publishedTime: b.created_at,
        authors: ["Tim PasaGadang"],
        images: [
          {
            url: b.thumbnail,
            width: 1200,
            height: 675,
            alt: b.judul,
          },
        ],
      },
    }
  } catch {
    return {
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    }
  }
}

export default function BlogSlugLayout({ children }) {
  return <>{children}</>
}
