import { getProviderData } from 'flags/next';
import * as flags from '@/lib/flags';

export async function GET() {
  const data = await getProviderData(flags);
  return Response.json(data);
}
