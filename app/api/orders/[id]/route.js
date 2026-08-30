import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';
import { getCurrentUser } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/orders/[id] — get order detail by order_code
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id, order_code, customer_name, customer_phone, customer_email,
        shipping_address, district, note, payment_method, payment_status,
        subtotal, shipping_fee, discount_amount, voucher_code, total,
        status, created_at, updated_at,
        order_items (
          id, product_id, product_name, product_price, product_image, quantity, custom_box_flavors
        )
      `)
      .eq('order_code', id)
      .eq('user_id', user.id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('Order detail error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống.' },
      { status: 500 }
    );
  }
}
