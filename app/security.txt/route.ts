import { generateSecurityTxt, createMetadataRouteHandler } from '@/lib/metadata';

export const { dynamic, GET } = createMetadataRouteHandler(generateSecurityTxt);
