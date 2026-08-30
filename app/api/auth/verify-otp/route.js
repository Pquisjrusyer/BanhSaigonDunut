import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';
import { setAuthCookie } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ email và mã OTP.' },
        { status: 400 }
      );
    }

    // Find valid OTP token
    const { data: otpToken, error: otpError } = await supabase
      .from('otp_tokens')
      .select('id, email, code, expires_at, is_used')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpToken) {
      return NextResponse.json(
        { error: 'Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await supabase
      .from('otp_tokens')
      .update({ is_used: true })
      .eq('id', otpToken.id);

    // Find the user and log them in
    const { data: user } = await supabase
      .from('users')
      .select('id, email, full_name, phone, address, district, avatar, points, role')
      .eq('email', email.toLowerCase())
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài khoản.' },
        { status: 404 }
      );
    }

    // Set JWT cookie — user is now logged in
    await setAuthCookie(user.id);

    return NextResponse.json({
      success: true,
      user,
      message: 'Xác thực thành công! Bạn đã đăng nhập.',
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
