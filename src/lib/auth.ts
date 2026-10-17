import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("JWT_SECRET no está definido");
  return s || "dev-only-secret";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(adminId: number, email: string): string {
  return jwt.sign({ id: adminId, email }, getSecret(), { expiresIn: "24h" });
}

export function verifyToken(token: string): { id: number; email: string } | null {
  try {
    return jwt.verify(token, getSecret()) as { id: number; email: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  const valid = await verifyPassword(password, admin.password);
  if (!valid) return null;
  return generateToken(admin.id, admin.email);
}
