import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DebugPage() {
  const { sessionClaims } = await auth();
  const user = await currentUser();

  return (
    <pre className="p-8 text-sm">
      {JSON.stringify({ sessionClaims, publicMetadata: user?.publicMetadata }, null, 2)}
    </pre>
  );
}
