import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGIN = 'https://otopadang-frontend.vercel.app'

function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export function middleware(request: NextRequest) {
  // HANDLE PREFLIGHT
  if (request.method === 'OPTIONS') {
    return setCorsHeaders(new NextResponse(null, { status: 200 }))
  }

  const adminToken = request.cookies.get('admin_token')?.value
  const showroomToken = request.cookies.get('showroom_token')?.value
  const pathname = request.nextUrl.pathname

  let response: NextResponse

  // RULE 1: KALAU MASUK /admin TAPI BAWA TOKEN SHOWROOM -> HAPUS & TENDANG
  if (pathname.startsWith('/admin') && showroomToken) {
    response = NextResponse.redirect(new URL('/login-admin', request.url))
    response.cookies.delete('showroom_token')
    response.cookies.delete('showroom_id')
    return setCorsHeaders(response)
  }

  // RULE 2: KALAU MASUK /dashboard TAPI BAWA TOKEN ADMIN -> HAPUS & TENDANG
  if (pathname.startsWith('/dashboard') && adminToken) {
    response = NextResponse.redirect(new URL('/login-showroom', request.url))
    response.cookies.delete('admin_token')
    return setCorsHeaders(response)
  }

  // RULE 3: PROTEKSI /admin - CUKUP CEK ADA TOKEN, JANGAN CEK ROLE
  if (pathname.startsWith('/admin')) {
    if (!adminToken) { // HAPUS CEK ROLE DI SINI
      response = NextResponse.redirect(new URL('/login-admin', request.url))
      response.cookies.delete('admin_token')
      return setCorsHeaders(response)
    }
  }

  // RULE 4: PROTEKSI /dashboard - CUKUP CEK ADA TOKEN
  if (pathname.startsWith('/dashboard')) {
    if (!showroomToken) { // HAPUS CEK ROLE DI SINI
      response = NextResponse.redirect(new URL('/login-showroom', request.url))
      response.cookies.delete('showroom_token')
      response.cookies.delete('showroom_id')
      return setCorsHeaders(response)
    }
  }

  // RULE 5: UDAH LOGIN JANGAN KE LOGIN LAGI
  if (pathname === '/login-admin' && adminToken) {
    response = NextResponse.redirect(new URL('/admin', request.url))
    return setCorsHeaders(response)
  }

  if (pathname === '/login-showroom' && showroomToken) {
    response = NextResponse.redirect(new URL('/dashboard', request.url))
    return setCorsHeaders(response)
  }

  response = NextResponse.next()
  return setCorsHeaders(response)
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login-admin', '/login-showroom', '/api/:path*'],
}
