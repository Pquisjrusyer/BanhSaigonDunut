import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';
import { setAuthCookie } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const provider = searchParams.get('provider') || 'google';
  const isMock = searchParams.get('mock') === 'true';

  try {
    let email = '';
    let fullName = '';
    let avatarUrl = '/assets/avatar-user.png';

    if (code) {
      // Exchange authorization code for Supabase session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data?.user) {
        console.error('Supabase exchangeCodeForSession error:', error);
        return NextResponse.redirect(`${origin}/account?error=oauth_exchange_failed`);
      }

      const user = data.user;
      email = user.email?.toLowerCase() || '';
      fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.user_name ||
        (user.app_metadata?.provider === 'facebook' ? 'Người dùng Facebook' : 'Người dùng Google');
      avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        '/assets/avatar-user.png';
    } else if (isMock || process.env.NODE_ENV === 'development') {
      // Dev mode realistic profile fallback if Google/Facebook OAuth provider is not yet configured in Supabase Dashboard
      if (provider === 'facebook') {
        email = 'lephuongthao.fb@gmail.com';
        fullName = 'Lê Phương Thảo';
        avatarUrl = '/assets/avatar-review-hamster.png';
      } else {
        email = 'nguyenthanhnam.gg@gmail.com';
        fullName = 'Nguyễn Thành Nam';
        avatarUrl = '/assets/avatar-review-bear.png';
      }
    } else {
      const errorDesc = searchParams.get('error_description') || searchParams.get('error') || 'missing_oauth_code';
      return NextResponse.redirect(`${origin}/account?error=${encodeURIComponent(errorDesc)}`);
    }

    if (!email) {
      return NextResponse.redirect(`${origin}/account?error=no_email_returned`);
    }

    // Check if user exists in public.users
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, full_name, avatar, points')
      .eq('email', email)
      .single();

    let userId = '';

    if (existingUser) {
      userId = existingUser.id;
      // Update avatar or name if needed
      await supabase
        .from('users')
        .update({
          full_name: existingUser.full_name || fullName,
          avatar: existingUser.avatar || avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } else {
      // Insert new user into database with welcome bonus points
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: email,
          password_hash: `OAUTH_${provider.toUpperCase()}`,
          full_name: fullName,
          avatar: avatarUrl,
          points: 50, // 50 welcome loyalty points!
          role: 'customer',
        })
        .select('id')
        .single();

      if (insertError || !newUser) {
        console.error('Failed to create OAuth user in database:', insertError);
        return NextResponse.redirect(`${origin}/account?error=db_user_create_failed`);
      }

      userId = newUser.id;
    }

    // Issue standard application JWT cookie
    await setAuthCookie(userId);

    // Redirect to account dashboard
    return NextResponse.redirect(`${origin}/account`);
  } catch (err) {
    console.error('OAuth callback exception:', err);
    return NextResponse.redirect(`${origin}/account?error=oauth_server_error`);
  }
}
