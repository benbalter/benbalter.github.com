import { generateBrowserconfigXml } from '@/lib/metadata';

export const dynamic = 'force-static';

export async function GET() {
  const content = generateBrowserconfigXml();
  
  return new Response(content, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
