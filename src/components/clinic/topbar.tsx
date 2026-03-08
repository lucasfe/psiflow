import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export async function Topbar() {
  const user = await currentUser();

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <p className="text-sm text-muted-foreground">
        {user?.firstName} {user?.lastName}
      </p>
      <UserButton />
    </header>
  );
}
