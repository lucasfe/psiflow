import { requirePatient } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePatient();
  return <>{children}</>;
}
