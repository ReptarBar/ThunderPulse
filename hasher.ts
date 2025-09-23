import { createHash } from "node:crypto";

const SALT = process.env.SALT || "";

export function hashEmail(email: string): string {
  const norm = email.trim().toLowerCase();
  return createHash("sha256").update(SALT + "::" + norm).digest("hex");
}
