export const dynamic = 'force-static';

export async function GET() {
  // Use a revision string from environment variable, or fallback to build timestamp
  const buildRevision =
    process.env.BUILD_REVISION || new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

  const content = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png?v=${buildRevision}"/>
            <TileColor>#2d89ef</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
