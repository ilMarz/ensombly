import { enableSignup } from '@/lib/flags';
import { LoginForm } from './login-form';

export default async function LoginPage() {
  const signupEnabled = Boolean(await enableSignup());
  return <LoginForm signupEnabled={signupEnabled} />;
}
