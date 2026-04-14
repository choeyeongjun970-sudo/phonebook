import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Defensive check for environment variables to prevent middleware crash
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Middleware: Missing Supabase environment variables')
      return supabaseResponse
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake can make it very hard to debug
    // issues with Supabase Auth.
    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    
    // Auth related routes and static assets should be excluded
    const isPublicRoute = 
      pathname.startsWith('/login') || 
      pathname.startsWith('/signup') || 
      pathname.startsWith('/auth') ||
      pathname === '/favicon.ico'

    if (!user && !isPublicRoute) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      // Preserve the original destination for redirect after login if needed
      if (pathname !== '/') {
        loginUrl.searchParams.set('next', pathname)
      }
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  } catch (e) {
    // If anything fails, let the request through rather than returning a 500 error
    console.error('Middleware execution error caught:', e)
    return NextResponse.next({
      request,
    })
  }
}
