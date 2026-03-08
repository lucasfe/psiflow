"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function NoRolePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl font-semibold">Account not configured</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Your account doesn&apos;t have a role assigned yet. Please contact your administrator.
      </p>
      <SignOutButton redirectUrl="/sign-in">
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}
