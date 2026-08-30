import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';
import { getCurrentUser } from '../../../../lib/auth';

export async function PUT(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để cập nhật hồ sơ.' },
        { status: 401 }
      );
    }

    const { fullName, phone, address, district } = await request.json();

    const updateData = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (district !== undefined) updateData.district = district;
    updateData.updated_at = new Date().toISOString();

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select('id, email, full_name, phone, address, district, avatar, points, role')
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return NextResponse.json(
        { error: 'Không thể cập nhật hồ sơ. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Cập nhật thông tin cá nhân thành công!',
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
