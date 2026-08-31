import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import supabase from './supabase';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'donut-saigon-fallback-secret');
const COOKIE_NAME = 'dnsg_token';

// ─── Password Helpers ───────────────────────────────────────────
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ─── JWT Helpers ────────────────────────────────────────────────
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// ─── Cookie Helpers ─────────────────────────────────────────────
export async function setAuthCookie(userId, email = null) {
  const token = await signToken({ userId, email });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return token;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value || null;
  } catch {
    return null;
  }
}

// ─── Get Current User ───────────────────────────────────────────
export async function getCurrentUser() {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload?.userId && !payload?.email) return null;

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project')) {
      return null;
    }

    let user = null;

    // 1. Try finding user by ID (UUID)
    if (payload.userId && !payload.userId.startsWith('oauth-')) {
      const { data: userById } = await supabase
        .from('users')
        .select('id, email, full_name, phone, address, district, avatar, points, role, created_at')
        .eq('id', payload.userId)
        .single();
      if (userById) user = userById;
    }

    // 2. Fallback by email if userId query did not find user
    if (!user && payload.email) {
      const { data: userByEmail } = await supabase
        .from('users')
        .select('id, email, full_name, phone, address, district, avatar, points, role, created_at')
        .eq('email', payload.email.toLowerCase())
        .single();
      if (userByEmail) user = userByEmail;
    }

    return user;
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}
