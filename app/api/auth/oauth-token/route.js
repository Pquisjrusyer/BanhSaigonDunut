import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';
import { setAuthCookie } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// Helper to decode JWT payload safely
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      return NextResponse.json(
        { error: 'Thiếu access_token xác thực.' },
        { status: 400 }
      );
    }

    // 1. Try to get user from Supabase using access_token
    let email = null;
    let fullName = null;
    let avatar = '/assets/avatar-user.png';

    const { data: authData, error: authError } = await supabase.auth.getUser(access_token);

    if (!authError && authData?.user) {
      const u = authData.user;
      email = u.email?.toLowerCase();
      fullName = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0];
      avatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || '/assets/avatar-user.png';
    } else {
      // Fallback: decode JWT payload directly
      const payload = parseJwt(access_token);
      if (payload?.email) {
        email = payload.email.toLowerCase();
        fullName =
          payload.user_metadata?.full_name ||
          payload.user_metadata?.name ||
          payload.name ||
          payload.email.split('@')[0];
        avatar =
          payload.user_metadata?.avatar_url ||
          payload.user_metadata?.picture ||
          payload.picture ||
          '/assets/avatar-user.png';
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Không thể xác thực thông tin tài khoản Google.' },
        { status: 401 }
      );
    }

    // 2. Check if user already exists in public.users table
    const { data: existingUser, error: selectErr } = await supabase
      .from('users')
      .select('id, email, full_name, phone, address, district, avatar, points, role')
      .eq('email', email)
      .single();

    let dbUser = existingUser;

    if (!existingUser) {
      // 3. Create new user in public.users table with 50 bonus points
      const { data: newUser, error: insertErr } = await supabase
        .from('users')
        .insert([
          {
            email: email,
            password_hash: 'OAUTH_GOOGLE',
            full_name: fullName,
            avatar: avatar,
            points: 50,
            role: 'customer',
          },
        ])
        .select('id, email, full_name, phone, address, district, avatar, points, role')
        .single();

      if (insertErr || !newUser) {
        console.error('Error creating oauth user in database:', insertErr);
        // Fallback user object
        dbUser = {
          id: 'oauth-' + Date.now(),
          email: email,
          full_name: fullName,
          avatar: avatar,
          points: 50,
          role: 'customer',
        };
      } else {
        dbUser = newUser;
      }
    } else {
      // Update avatar or name if missing
      const updates = {};
      if (!existingUser.avatar || existingUser.avatar === '/assets/avatar-user.png') {
        updates.avatar = avatar;
      }
      if (!existingUser.full_name && fullName) {
        updates.full_name = fullName;
      }
      if (Object.keys(updates).length > 0) {
        const { data: updated } = await supabase
          .from('users')
          .update(updates)
          .eq('id', existingUser.id)
          .select('id, email, full_name, phone, address, district, avatar, points, role')
          .single();
        if (updated) dbUser = updated;
      }
    }

    // 4. Issue local authentication cookie with user ID and email
    await setAuthCookie(dbUser.id, dbUser.email);

    return NextResponse.json({
      success: true,
      user: dbUser,
      message: `Đăng nhập thành công! Chào mừng ${dbUser.full_name || 'bạn'}.`,
    });
  } catch (err) {
    console.error('OAuth token processing error:', err);
    return NextResponse.json(
      { error: 'Lỗi xử lý xác thực tài khoản.' },
      { status: 500 }
    );
  }
}
