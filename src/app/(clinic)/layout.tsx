import { requireStaff } from "@/lib/auth";
import { Sidebar } from "@/components/clinic/sidebar";
import { Topbar } from "@/components/clinic/topbar";

export default async function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaff();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
