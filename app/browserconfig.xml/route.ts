import { generateBrowserconfigXml, createMetadataRouteHandler } from '@/lib/metadata';

export const { dynamic, GET } = createMetadataRouteHandler(generateBrowserconfigXml, 'application/xml');
