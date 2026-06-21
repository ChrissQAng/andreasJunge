import type { GlobalConfig } from 'payload'

export const Biography: GlobalConfig = {
  slug: 'biography',
  label: 'Biography',
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Inhalt',
      required: true,
    },
  ],
}
