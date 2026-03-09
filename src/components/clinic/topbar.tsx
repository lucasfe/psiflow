import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export async function Topbar() {
  const user = await currentUser();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <p className="text-sm font-medium text-foreground/70">
        Welcome back,{" "}
        <span className="font-semibold text-foreground">
          {user?.firstName ?? "there"}
        </span>
      </p>
      <UserButton />
    </header>
  );
}
