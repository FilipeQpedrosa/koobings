import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin))

  if (code) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
              path: options.path ?? '/',
              sameSite: options.sameSite ?? 'lax',
              httpOnly: options.httpOnly ?? true,
            })
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              path: options.path ?? '/',
              sameSite: options.sameSite ?? 'lax',
              maxAge: 0,
            })
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  return response
} 