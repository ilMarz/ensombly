import { LoginForm } from './login-form';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ mode?: string; ref?: string }> }) {
  const params = await searchParams;
  return (
    <LoginForm
      initialMode={params.mode === "signup" ? "signup" : "login"}
      referredBy={params.ref ?? null}
    />
  );
}
