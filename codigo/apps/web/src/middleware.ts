import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Rutas que NO requieren autenticación (o que son accesibles con sesión activa)
const PUBLIC_ROUTES = ['/login', '/register', '/auth/callback', '/onboarding']

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refrescar el token de sesión
    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

    // Redirigir al login si no hay sesión y la ruta es protegida
    if (!user && !isPublic) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        return NextResponse.redirect(loginUrl)
    }

    // Redirigir al dashboard si ya hay sesión y va al login/registro
    // (pero NO a /onboarding — debe ser accesible con sesión)
    if (user && isPublic && pathname !== '/auth/callback' && pathname !== '/onboarding') {
        const homeUrl = request.nextUrl.clone()
        homeUrl.pathname = '/'
        return NextResponse.redirect(homeUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
