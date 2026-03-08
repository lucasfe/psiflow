import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default async function PatientsPage() {
  const patients = await db.patient.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { appointments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground">{patients.length} active patients</p>
        </div>
        <Link
          href="/patients/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add Patient
        </Link>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Appointments</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Portal</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No patients yet.
                </td>
              </tr>
            )}
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/patients/${patient.id}`} className="flex items-center gap-3 hover:underline">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{patient.firstName} {patient.lastName}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{patient.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{patient.phone ?? "—"}</td>
                <td className="px-4 py-3">{patient._count.appointments}</td>
                <td className="px-4 py-3">
                  {patient.clerkId ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Not invited</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
