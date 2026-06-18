import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (pathname === "/admin/login") {
    if (isLoggedIn) {
      return Response.redirect(new URL("/admin", req.url));
    }
    return;
  }

  if (pathname.startsWith("/admin") && !isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
