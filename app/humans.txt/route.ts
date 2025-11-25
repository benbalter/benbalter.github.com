import { generateHumansTxt, createMetadataRouteHandler } from '@/lib/metadata';

export const { dynamic, GET } = createMetadataRouteHandler(generateHumansTxt);
