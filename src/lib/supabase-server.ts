import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, type NextResponse } from 'next/server'

export function createClient(request?: NextRequest, response?: NextResponse) {
  let cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (request) {
            return request.cookies.get(name)?.value
          }
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          if (response) {
            response.cookies.set({
              name,
              value,
              ...options,
              path: options.path ?? '/',
              sameSite: options.sameSite ?? 'lax',
              httpOnly: options.httpOnly ?? true,
            })
          } else {
            cookieStore.set(name, value, options as any)
          }
        },
        remove(name: string, options: CookieOptions) {
          if (response) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              path: options.path ?? '/',
              sameSite: options.sameSite ?? 'lax',
              maxAge: 0,
            })
          } else {
            cookieStore.delete(name)
          }
        },
      },
    }
  )
} 