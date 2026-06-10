import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const enableSignup = flag({
  key: 'enableSignup',
  adapter: vercelAdapter(),
  defaultValue: false,
  description: 'Allow new users to sign up',
});
