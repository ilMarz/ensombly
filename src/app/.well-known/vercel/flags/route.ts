import { getProviderData } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';
import * as flags from '@/lib/flags';

export async function GET() {
  const data = await getProviderData(flags, vercelAdapter());
  return Response.json(data);
}
