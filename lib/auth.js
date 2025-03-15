import { serialize } from "cookie";

export async function setLoginSession(res, user) {
  const session = { id: user.id, email: user.email }; // Store user info in session

  const cookie = serialize("auth_token", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}
