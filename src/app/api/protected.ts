// src/pages/api/protected.ts   (pages router) OR src/app/api/protected/route.ts (app router)
import { getServerSession } from "next-auth/next"; // <-- v4 only
import { authOptions } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // …your protected logic
  res.status(200).json({ message: "Success", user: session.user });
}