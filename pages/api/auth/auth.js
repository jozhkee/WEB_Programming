import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "../../src/db"; 
import { users } from "../../../src/db/schema"; 

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find user by email
        const user = await db.select().from(users).where(users.email.eq(credentials.email)).limit(1);
        if (!user || user.length === 0) return null; // No user found

        // Check if password matches
        const isValidPassword = await bcrypt.compare(credentials.password, user[0].password);
        if (!isValidPassword) return null;

        // Return user data
        return { id: user[0].id, email: user[0].email };
      },
    }),
  ],
  session: {
    strategy: "jwt", // We can use JWT or cookies to track the session
  },
  pages: {
    signIn: "/auth/signin", // Optional: Custom sign-in page
    error: "/auth/error",   // Optional: Custom error page
  },
});
