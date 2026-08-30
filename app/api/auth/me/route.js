import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('Auth me error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống.' },
      { status: 500 }
    );
  }
}
