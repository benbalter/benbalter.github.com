import { generateHumansTxt } from '@/lib/metadata';

export const dynamic = 'force-static';

export async function GET() {
  const content = generateHumansTxt();
  
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
