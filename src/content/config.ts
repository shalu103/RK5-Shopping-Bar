import { defineCollection, z } from 'astro:content';

const collectionsList = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().default('shirt'),
  }),
});

export const collections = {
  'collections_list': collectionsList,
};
