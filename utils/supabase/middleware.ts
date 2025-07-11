import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/app/core/interfaces/Database'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Rutas públicas que no requieren autenticación
    const publicRoutes = [
      '/sign-in',
      '/sign-up',
      '/auth',
      '/auth/callback',
      '/forgot-password',
      '/reset-password'
    ]

    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))

    // Si no hay usuario y no es una ruta pública, redirigir a sign-in
    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Error in updateSession:', error)
    // En caso de error, crear una respuesta simple
    return NextResponse.next({
      request,
    })
  }
}