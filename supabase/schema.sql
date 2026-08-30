-- ==============================================================================
-- DONUT SAIGON (BANHNE) - SUPABASE POSTGRESQL SCHEMA
-- ==============================================================================
-- Chạy toàn bộ script này trong Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. BẢNG USERS (Người dùng / Thành viên)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone         TEXT DEFAULT '',
  address       TEXT DEFAULT '',
  district      TEXT DEFAULT '',
  avatar        TEXT DEFAULT '/assets/avatar-user.png',
  points        INTEGER DEFAULT 0,
  role          TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG ORDERS (Đơn hàng)
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code       TEXT UNIQUE NOT NULL,
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT,
  shipping_address TEXT NOT NULL,
  district         TEXT DEFAULT '',
  note             TEXT DEFAULT '',
  payment_method   TEXT DEFAULT 'wallet' CHECK (payment_method IN ('wallet', 'cod', 'card')),
  payment_status   TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  subtotal         INTEGER NOT NULL,
  shipping_fee     INTEGER DEFAULT 0,
  discount_amount  INTEGER DEFAULT 0,
  voucher_code     TEXT DEFAULT '',
  total            INTEGER NOT NULL,
  status           TEXT DEFAULT 'Đã đặt hàng',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG ORDER_ITEMS (Chi tiết món trong đơn hàng)
CREATE TABLE IF NOT EXISTS order_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id          TEXT NOT NULL,
  product_name        TEXT NOT NULL,
  product_price       INTEGER NOT NULL,
  product_image       TEXT DEFAULT '',
  quantity            INTEGER DEFAULT 1,
  custom_box_flavors  TEXT[] DEFAULT '{}'
);

-- 4. BẢNG VOUCHERS (Mã ưu đãi giảm giá)
CREATE TABLE IF NOT EXISTS vouchers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  discount_type   TEXT DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percent')),
  discount_value  INTEGER NOT NULL,
  min_order_value INTEGER DEFAULT 0,
  max_discount    INTEGER DEFAULT 0,
  max_usage       INTEGER DEFAULT 1000,
  usage_count     INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  expiry_date     TIMESTAMPTZ NOT NULL
);

-- 5. BẢNG OTP_TOKENS (Mã xác thực 5 số gửi qua Resend)
CREATE TABLE IF NOT EXISTS otp_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  code       TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HÀM TỰ ĐỘNG TĂNG SỐ LƯỢT DÙNG VOUCHER (Stored Procedure)
CREATE OR REPLACE FUNCTION increment_voucher_usage(voucher_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE vouchers
  SET usage_count = usage_count + 1
  WHERE code = voucher_code;
END;
$$ LANGUAGE plpgsql;

-- 7. SEED DỮ LIỆU MẪU (VOUCHERS)
INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, max_usage, expiry_date)
VALUES
  ('DONUT5', 'fixed', 5000, 0, 1000, '2028-12-31 23:59:59+00'),
  ('DONUT10', 'percent', 10, 100000, 500, '2028-12-31 23:59:59+00'),
  ('FREESHIP', 'fixed', 25000, 150000, 200, '2028-12-31 23:59:59+00')
ON CONFLICT (code) DO NOTHING;
