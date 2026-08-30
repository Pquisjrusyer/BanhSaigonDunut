import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Vui lòng nhập mã ưu đãi.' },
        { status: 400 }
      );
    }

    const { data: voucher, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .single();

    if (error || !voucher) {
      return NextResponse.json(
        { error: 'Mã ưu đãi không tồn tại.' },
        { status: 404 }
      );
    }

    // Check if voucher is active
    if (!voucher.is_active) {
      return NextResponse.json(
        { error: 'Mã ưu đãi đã ngưng hoạt động.' },
        { status: 400 }
      );
    }

    // Check expiry date
    if (new Date(voucher.expiry_date) < new Date()) {
      return NextResponse.json(
        { error: 'Mã ưu đãi đã hết hạn sử dụng.' },
        { status: 400 }
      );
    }

    // Check max usage
    if (voucher.usage_count >= voucher.max_usage) {
      return NextResponse.json(
        { error: 'Mã ưu đãi đã hết lượt sử dụng.' },
        { status: 400 }
      );
    }

    // Check minimum order value
    const orderSubtotal = subtotal || 0;
    if (orderSubtotal < voucher.min_order_value) {
      return NextResponse.json(
        { error: `Đơn hàng tối thiểu ${voucher.min_order_value.toLocaleString('vi-VN')}đ để áp dụng mã này.` },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (voucher.discount_type === 'fixed') {
      discountAmount = voucher.discount_value;
    } else if (voucher.discount_type === 'percent') {
      discountAmount = Math.floor(orderSubtotal * voucher.discount_value / 100);
      if (voucher.max_discount > 0) {
        discountAmount = Math.min(discountAmount, voucher.max_discount);
      }
    }

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        discountType: voucher.discount_type,
        discountValue: voucher.discount_value,
        discountAmount,
      },
      message: `Áp dụng mã ${voucher.code} thành công! Giảm ${discountAmount.toLocaleString('vi-VN')}đ`,
    });
  } catch (err) {
    console.error('Voucher validate error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
