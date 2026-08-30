import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';
import { verifyPassword, setAuthCookie } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Email và Mật khẩu.' },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project')) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_URL trong file .env. Vui lòng mở file .env và điền URL/Key từ Supabase của bạn.' },
        { status: 503 }
      );
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, full_name, phone, address, district, avatar, points, role')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    // Set JWT cookie
    await setAuthCookie(user.id);

    // Return user info (without password_hash)
    const { password_hash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Đăng nhập thành công! Chào mừng bạn quay trở lại.',
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
