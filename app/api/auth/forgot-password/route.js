import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Vui lòng nhập địa chỉ email.' },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project')) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_URL trong file .env.' },
        { status: 503 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài khoản với email này trong hệ thống.' },
        { status: 404 }
      );
    }

    // Generate 5-digit OTP
    const otpCode = String(Math.floor(10000 + Math.random() * 90000));
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString(); // +3 minutes

    // Save OTP to database
    const { error: otpError } = await supabase
      .from('otp_tokens')
      .insert({
        email: email.toLowerCase(),
        code: otpCode,
        expires_at: expiresAt,
      });

    if (otpError) {
      console.error('OTP insert error:', otpError);
      return NextResponse.json(
        { error: 'Không thể tạo mã OTP trong database. Vui lòng kiểm tra bảng otp_tokens.' },
        { status: 500 }
      );
    }

    // Send OTP email via Resend API
    const resendKey = process.env.RESEND_API_KEY;
    let resendStatus = 'not_configured';
    let resendErrorMessage = null;

    if (resendKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Donut Saigon <onboarding@resend.dev>',
            to: [email.toLowerCase()],
            subject: 'Mã xác thực OTP đặt lại mật khẩu - Donut Saigon',
            html: `
              <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FFF8F0; border-radius: 16px; border: 2px solid #FDD6DC;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #004691; font-size: 24px; margin: 0;">🍩 Donut Saigon</h1>
                  <p style="color: #74575C; margin-top: 8px;">Xác thực đặt lại mật khẩu</p>
                </div>
                <div style="background: #FFF; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #FDD6DC;">
                  <p style="color: #333; margin-bottom: 16px;">Xin chào <strong>${user.full_name || 'bạn'}</strong>,</p>
                  <p style="color: #555; margin-bottom: 20px;">Mã OTP của bạn là:</p>
                  <div style="font-size: 36px; font-weight: bold; color: #004691; letter-spacing: 8px; padding: 16px; background: #F0F4FF; border-radius: 8px; display: inline-block;">
                    ${otpCode}
                  </div>
                  <p style="color: #999; font-size: 13px; margin-top: 20px;">Mã có hiệu lực trong <strong>3 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
                </div>
                <p style="color: #AAA; font-size: 12px; text-align: center; margin-top: 24px;">© 2024 Donut Saigon — Nạp vị ngọt, bật công suất!</p>
              </div>
            `,
          }),
        });

        const resendData = await resendRes.json();
        console.log('📧 Resend API Response Status:', resendRes.status, resendData);

        if (resendRes.ok) {
          resendStatus = 'sent';
        } else {
          resendStatus = 'failed';
          resendErrorMessage = resendData?.message || 'Resend error';
        }
      } catch (emailErr) {
        console.error('Resend email exception:', emailErr);
        resendStatus = 'error';
        resendErrorMessage = emailErr.message;
      }
    }

    console.log(`🔑 OTP generated for ${email}: ${otpCode} (expires in 3 min)`);

    return NextResponse.json({
      success: true,
      message: resendStatus === 'sent' 
        ? 'Đã gửi mã OTP đến email của bạn.' 
        : 'Mã OTP đã được tạo thành công!',
      resendStatus,
      resendErrorMessage,
      devOtp: otpCode, // Luôn trả OTP để hỗ trợ test nhanh khi Resend chưa verify domain
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'Lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
