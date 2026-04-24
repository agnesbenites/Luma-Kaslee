import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  // `session` will be `null` if the user is not signed in
  return (
    <section>
      {session ? (
        <p>Welcome back, {session.user?.name}!</p>
      ) : (
        <p>You need to sign in to see this page.</p>
      )}
    </section>
  );
}