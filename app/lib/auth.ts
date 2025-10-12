import { prismaClient } from "@/app/lib/db";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
      })
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (!user.email) {
        return false;
      }
      try {
        await prismaClient.user.create({
          data: {
            email: user.email,
            provider:"Google"
          }
        })
      } catch (e) {
        console.log(e);
      }
      return true;
    }
  }
}