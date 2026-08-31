import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const provider = searchParams.get('provider'); // 'google' | 'facebook'
    const isMock = searchParams.get('mock') === 'true';

    if (!provider || !['google', 'facebook'].includes(provider)) {
      return NextResponse.redirect(`${origin}/account?error=provider_not_supported`);
    }

    // Direct mock simulation for local dev test if requested
    if (isMock) {
      return NextResponse.redirect(`${origin}/api/auth/callback?provider=${provider}&mock=true`);
    }

    // Real Supabase OAuth flow
    const redirectUrl = `${origin}/api/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error || !data?.url) {
      console.warn(`Supabase OAuth for ${provider} not fully configured or returned error:`, error?.message);
      // Fallback in dev: forward to callback with provider for seamless testing
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.redirect(`${origin}/api/auth/callback?provider=${provider}&mock=true`);
      }
      return NextResponse.redirect(`${origin}/account?error=oauth_init_failed`);
    }

    return NextResponse.redirect(data.url);
  } catch (err) {
    console.error('OAuth init error:', err);
    return NextResponse.redirect(new URL('/account?error=oauth_error', request.url));
  }
}
