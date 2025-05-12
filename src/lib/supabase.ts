import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';

export function createClient() {
  const cookieStore = cookies() as unknown as RequestCookies;

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? '';
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, {
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
          });
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', {
            ...options,
            maxAge: 0,
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
          });
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
} 