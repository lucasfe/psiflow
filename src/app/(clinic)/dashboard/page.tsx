import { getAuthUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getAuthUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        Welcome back, {user.firstName}
      </p>
    </div>
  );
}
