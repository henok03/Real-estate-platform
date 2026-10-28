import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { getAdminByEmail, getAdminById, updateAdminPassword,updateAdminEmail } from './db';
import type { AdminUser } from '@/types';

const COOKIE_NAME = 'aura_admin_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'aura_realestate_production_jwt_secret_key_1234567890'
);

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export async function createSession(admin: AdminUser): Promise<string> {
  const token = await new SignJWT({
    id: String(admin.id),
    email: admin.email,
    name: admin.full_name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token;
}

export async function getSessionAdmin(): Promise<Omit<AdminUser, 'password_hash'> | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.id) return null;

    const admin = await getAdminById(String(payload.id));
    if (!admin || !admin.is_active) return null;

    // Never expose password hash
    return {
      id: String(admin.id),
      email: admin.email,
      full_name: admin.full_name,
      is_active: admin.is_active,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function authenticateAdmin(
  email: string,
  plainPassword: string
): Promise<{ success: boolean; error?: string; admin?: AdminUser }> {
  if (!email || !plainPassword) {
    return { success: false, error: 'Email and password are required.' };
  }

  const admin = await getAdminByEmail(email);
  if (!admin) {
    return { success: false, error: 'Invalid email or password.' };
  }

  if (!admin.is_active) {
    return { success: false, error: 'Your account has been deactivated. Please contact support.' };
  }

  if (!admin.password_hash) {
    return { success: false, error: 'Authentication configuration error.' };
  }

  const match = await comparePassword(plainPassword, admin.password_hash);
  if (!match) {
    return { success: false, error: 'Invalid email or password.' };
  }

  await createSession(admin);
  return { success: true, admin };
}

export async function changeAdminPassword(
  adminId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters.' };
  }

  const admin = await getAdminById(adminId);
  if (!admin || !admin.password_hash) {
    return { success: false, error: 'Admin account not found.' };
  }

  const isMatch = await comparePassword(currentPassword, admin.password_hash);
  if (!isMatch) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const newHash = await hashPassword(newPassword);
  const updated = await updateAdminPassword(adminId, newHash);
  if (!updated) {
    return { success: false, error: 'Failed to update password in database.' };
  }

  return { success: true };
}

export async function changeAdminEmail(
  adminId: string,
  currentPassword: string,
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  const email = newEmail.trim().toLowerCase();

  if (!currentPassword || !email) {
    return { success: false, error: 'All fields are required.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Enter a valid email address.' };
  }

  const admin = await getAdminById(adminId);

  if (!admin || !admin.is_active || !admin.password_hash) {
    return { success: false, error: 'Admin account not found or inactive.' };
  }

  const matches = await comparePassword(
    currentPassword,
    admin.password_hash
  );

  if (!matches) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  if (admin.email.toLowerCase() === email) {
    return {
      success: false,
      error: 'The new email must be different from your current email.',
    };
  }

  const result = await updateAdminEmail(adminId, email);

  if (!result.success) {
    return {
      success: false,
      error: result.error || 'Email update failed.',
    };
  }

  return { success: true };
}
