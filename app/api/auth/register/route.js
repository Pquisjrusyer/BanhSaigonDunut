import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';
import { hashPassword, setAuthCookie } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { fullName, email, phone, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự.' },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project')) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_URL trong file .env. Vui lòng mở file .env và điền URL/Key từ Supabase của bạn.' },
        { status: 503 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        phone: phone || '',
      })
      .select('id, email, full_name, phone, address, district, avatar, points, role')
      .single();

    if (error) {
      console.error('Register error:', error);
      return NextResponse.json(
        { error: 'Không thể tạo tài khoản. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Set JWT cookie
    await setAuthCookie(newUser.id);

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Đăng ký thành công! Chào mừng bạn đến với Donut Saigon.',
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
