import { getAuthUser } from "@/lib/auth";

export default async function PortalPage() {
  const user = await getAuthUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Portal</h1>
      <p className="text-muted-foreground mt-1">
        Welcome, {user.firstName}
      </p>
    </div>
  );
}
