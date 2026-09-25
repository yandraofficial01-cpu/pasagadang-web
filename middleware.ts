import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://pasagadang-web.vercel.app',
  'https://pasagadang.com',
  'https://www.pasagadang.com',
  'http://localhost:3000',
  'http://localhost:3001'
]

function setCorsHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin') || ''
  // Kalo origin ada di whitelist, pakai origin itu. Kalo gak, pakai domain utama
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)? origin : ALLOWED_ORIGINS[0]

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export function middleware(request: NextRequest) {
  // HANDLE PREFLIGHT - WAJIB UNTUK API
  if (request.method === 'OPTIONS') {
    return setCorsHeaders(request, new NextResponse(null, { status: 200 }))
  }

  const adminToken = request.cookies.get('admin_token')?.value
  const showroomToken = request.cookies.get('showroom_token')?.value
  const pathname = request.nextUrl.pathname

  let response: NextResponse

  // RULE 1: MASUK /admin TAPI BAWA TOKEN SHOWROOM -> TENDANG
  if (pathname.startsWith('/admin') && showroomToken) {
    response = NextResponse.redirect(new URL('/login-admin', request.url))
    response.cookies.delete('showroom_token')
    response.cookies.delete('showroom_id')
    return setCorsHeaders(request, response)
  }

  // RULE 2: MASUK /dashboard TAPI BAWA TOKEN ADMIN -> TENDANG
  if (pathname.startsWith('/dashboard') && adminToken) {
    response = NextResponse.redirect(new URL('/login-showroom', request.url))
    response.cookies.delete('admin_token')
    return setCorsHeaders(request, response)
  }

  // RULE 3: PROTEKSI /admin
  if (pathname.startsWith('/admin') &&!pathname.startsWith('/admin/login')) {
    if (!adminToken) {
      response = NextResponse.redirect(new URL('/login-admin', request.url))
      response.cookies.delete('admin_token')
      return setCorsHeaders(request, response)
    }
  }

  // RULE 4: PROTEKSI /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!showroomToken) {
      response = NextResponse.redirect(new URL('/login-showroom', request.url))
      response.cookies.delete('showroom_token')
      response.cookies.delete('showroom_id')
      return setCorsHeaders(request, response)
    }
  }

  // RULE 5: UDAH LOGIN JANGAN KE LOGIN LAGI
  if (pathname === '/login-admin' && adminToken) {
    response = NextResponse.redirect(new URL('/admin', request.url))
    return setCorsHeaders(request, response)
  }

  if (pathname === '/login-showroom' && showroomToken) {
    response = NextResponse.redirect(new URL('/dashboard', request.url))
    return setCorsHeaders(request, response)
  }

  response = NextResponse.next()
  return setCorsHeaders(request, response)
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login-admin', '/login-showroom', '/api/:path*'],
}
