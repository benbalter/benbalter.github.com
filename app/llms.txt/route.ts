import { generateLlmsTxt, createMetadataRouteHandler } from '@/lib/metadata';

export const { dynamic, GET } = createMetadataRouteHandler(generateLlmsTxt);
