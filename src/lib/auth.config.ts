import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isOnLogin = nextUrl.pathname === "/login";
      const isInvite = nextUrl.pathname.startsWith("/invite/");

      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      // Allow invite pages for unauthenticated users
      if (isInvite) return true;

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
