import type { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "printflow_token";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type ResponseCookies = NextResponse["cookies"];

export function setAuthCookie(cookies: ResponseCookies, token: string): void {
  cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: ONE_WEEK_IN_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearAuthCookie(cookies: ResponseCookies): void {
  cookies.delete(AUTH_COOKIE_NAME);
}
