import { requireStaff } from "@/lib/auth";

export default async function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaff();
  return <>{children}</>;
}
