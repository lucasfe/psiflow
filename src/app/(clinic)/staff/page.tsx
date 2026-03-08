import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Role } from "@/generated/prisma/enums";

const roleVariant: Record<Role, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  CLINICIAN: "secondary",
  RECEPTIONIST: "outline",
};

export default async function StaffPage() {
  const staff = await db.staffMember.findMany({
    where: { active: true },
    orderBy: { firstName: "asc" },
    include: {
      _count: { select: { appointments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Staff</h1>
        <p className="text-sm text-muted-foreground">{staff.length} active members</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full">
            No staff members yet. Invite users via Clerk dashboard and assign a role.
          </p>
        )}
        {staff.map((member) => (
          <div key={member.id} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {member.firstName[0]}{member.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{member.firstName} {member.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={roleVariant[member.role]}>{member.role}</Badge>
              {member.role === Role.CLINICIAN && (
                <span className="text-xs text-muted-foreground">
                  {member._count.appointments} appointments
                </span>
              )}
            </div>
            {member.specialty && (
              <p className="text-xs text-muted-foreground">{member.specialty}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
