import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type UserRole = "ADMIN" | "CLINICIAN" | "RECEPTIONIST" | "PATIENT";

export async function getRole(): Promise<UserRole | null> {
  const { sessionClaims } = await auth();
  return ((sessionClaims?.metadata as { role?: UserRole })?.role) ?? null;
}

export async function requireRole(...roles: UserRole[]) {
  const role = await getRole();
  if (!role || !roles.includes(role)) {
    redirect("/");
  }
  return role;
}

export async function requireStaff() {
  return requireRole("ADMIN", "CLINICIAN", "RECEPTIONIST");
}

export async function requirePatient() {
  return requireRole("PATIENT");
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function getAuthUser() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return user;
}
