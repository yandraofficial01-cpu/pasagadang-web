// app/blogs/[slug]/layout.js - FINAL FIX
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://pasagadang-api.vercel.app'

  try {
    const res = await fetch(`${API}/blogs/${slug}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('not found')
    const j = await res.json()
    const b = j.blog || j.data || j

    return {
      title: b.judul,
      description: b.excerpt?.slice(0, 155) || b.judul,
      alternates: { canonical: `https://pasagadang.com/blogs/${slug}` },
      robots: { index: true, follow: true, "max-image-preview": "large" },
      openGraph: {
        title: b.judul,
        description: b.excerpt,
        url: `https://pasagadang.com/blogs/${slug}`,
        type: 'article',
        images: [
          { url: b.thumbnail, width: 1200, height: 630 },
          { url: b.thumbnail, width: 1200, height: 675 },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: b.judul,
        images: [b.thumbnail],
      }
    }
  } catch (e) {
    return { robots: { index: true, follow: true, "max-image-preview": "large" } }
  }
}

export default function Layout({ children }) { return <>{children}</> }
