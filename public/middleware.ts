import { NextResponse } from 'next/server'

// Fungsi decode JWT manual tanpa library
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1] // ambil bagian payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
       .split('')
       .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
       .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // 1. Kalau akses /admin atau /dashboard harus login
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login-admin', request.url))
    }

    const decoded = decodeJWT(token)
    if (!decoded) {
      return NextResponse.redirect(new URL('/login-admin', request.url))
    }

    const role = decoded.role

    // 2. Pisah akses berdasarkan role
    if (pathname.startsWith('/admin') && role!== 'admin') {
      return NextResponse.redirect(new URL('/login-admin', request.url))
    }

    if (pathname.startsWith('/dashboard') && role!== 'showroom') {
      return NextResponse.redirect(new URL('/login-showroom', request.url))
    }
  }

  // 3. Kalau udah login jangan ke halaman login lagi
  if (token) {
    const decoded = decodeJWT(token)
    if (decoded) {
      if (pathname === '/login-admin' || pathname === '/login-showroom') {
        if (decoded.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
        if (decoded.role === 'showroom') return NextResponse.redirect(new URL('/dashboard/mobil/input', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/login-admin', '/login-showroom'],
}
