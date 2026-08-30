import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';
import { getCurrentUser } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/orders — list orders for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để xem đơn hàng.' },
        { status: 401 }
      );
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, order_code, customer_name, customer_phone, shipping_address, district,
        payment_method, subtotal, shipping_fee, discount_amount, voucher_code, total,
        status, created_at,
        order_items (
          id, product_id, product_name, product_price, product_image, quantity, custom_box_flavors
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch orders error:', error);
      return NextResponse.json(
        { error: 'Không thể tải đơn hàng.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orders: orders || [] });
  } catch (err) {
    console.error('Orders GET error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống.' },
      { status: 500 }
    );
  }
}

// POST /api/orders — create a new order
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để đặt hàng.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      items,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      district,
      note,
      paymentMethod,
      subtotal,
      shippingFee,
      discountAmount,
      voucherCode,
      total,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Giỏ hàng trống. Vui lòng thêm sản phẩm.' },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin giao hàng.' },
        { status: 400 }
      );
    }

    // Generate unique order code
    const orderCode = 'DS-' + Math.floor(1000000 + Math.random() * 9000000);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        user_id: user.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || user.email,
        shipping_address: shippingAddress,
        district: district || '',
        note: note || '',
        payment_method: paymentMethod || 'wallet',
        subtotal,
        shipping_fee: shippingFee || 0,
        discount_amount: discountAmount || 0,
        voucher_code: voucherCode || '',
        total,
        status: 'Đã đặt hàng',
      })
      .select('id, order_code')
      .single();

    if (orderError) {
      console.error('Create order error:', orderError);
      return NextResponse.json(
        { error: 'Không thể tạo đơn hàng. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      product_image: item.img || '',
      quantity: item.qty || 1,
      custom_box_flavors: item.details ? item.details.split(', ') : [],
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Create order items error:', itemsError);
    }

    // Add loyalty points to user (1 point per 10,000 VNĐ)
    const pointsEarned = Math.floor(total / 10000);
    if (pointsEarned > 0) {
      await supabase
        .from('users')
        .update({
          points: user.points + pointsEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    // Increment voucher usage if applicable
    if (voucherCode) {
      await supabase.rpc('increment_voucher_usage', { voucher_code: voucherCode });
    }

    return NextResponse.json({
      success: true,
      orderId: order.order_code,
      message: 'Đặt hàng thành công!',
    });
  } catch (err) {
    console.error('Orders POST error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
