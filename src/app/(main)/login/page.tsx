import { LoginForm } from './login-form';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ mode?: string; ref?: string }> }) {
  const params = await searchParams;
  return (
    <LoginForm
      initialMode={params.mode === "signup" ? "signup" : "login"}
      referredBy={params.ref ?? null}
    />
  );
}
