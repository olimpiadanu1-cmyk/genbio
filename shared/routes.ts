import { z } from 'zod';
import { insertExampleSchema, examples, generateBioSchema, checkBioSchema, checkBioResponseSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  examples: {
    random: {
      method: 'GET' as const,
      path: '/api/examples/random',
      responses: {
        200: z.custom<typeof examples.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/examples',
      responses: {
        200: z.array(z.custom<typeof examples.$inferSelect>()),
      },
    },
  },
  biography: {
    check: {
      method: 'POST' as const,
      path: '/api/biography/check',
      input: checkBioSchema,
      responses: {
        200: checkBioResponseSchema,
        400: errorSchemas.validation,
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/biography/generate',
      input: generateBioSchema,
      responses: {
        200: z.object({ content: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
