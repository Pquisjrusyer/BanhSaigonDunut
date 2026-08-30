import { NextResponse } from 'next/server';
import { clearAuthCookie } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json({
      success: true,
      message: 'Đã đăng xuất tài khoản.',
    });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống.' },
      { status: 500 }
    );
  }
}
