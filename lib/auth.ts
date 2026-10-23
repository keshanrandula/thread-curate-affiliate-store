import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectToDatabase } from "./mongodb";
import AdminUser from "@/models/AdminUser";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "affiliate-shop-super-secret-jwt-key-2025-secure"
);
const COOKIE_NAME = "admin_session";

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(user: AdminSessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function setAdminSession(user: AdminSessionUser): Promise<void> {
  const token = await signAdminToken(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ user: AdminSessionUser | null; error?: string }> {
  try {
    await connectToDatabase();
    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    
    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@affiliate.com").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!admin) {
      // Default fallback for initial bootstrap if database hasn't been seeded yet
      if (email.toLowerCase().trim() === envAdminEmail && password === envAdminPassword) {
        return {
          user: {
            id: "bootstrap-admin-id",
            email: envAdminEmail,
            name: "Site Administrator",
            role: "admin",
          },
        };
      }
      return { user: null, error: "Invalid email or password" };
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return { user: null, error: "Invalid email or password" };
    }

    return {
      user: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name || "Admin",
        role: admin.role || "admin",
      },
    };
  } catch (err: any) {
    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@affiliate.com").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "admin123";
    // If DB connection fails, allow fallback bootstrap login so user is never locked out
    if (email.toLowerCase().trim() === envAdminEmail && password === envAdminPassword) {
      return {
        user: {
          id: "bootstrap-admin-id",
          email: envAdminEmail,
          name: "Site Administrator (Offline Mode)",
          role: "admin",
        },
      };
    }
    return { user: null, error: err.message || "Authentication failed" };
  }
}
