import type { GlobalConfig } from 'payload'

export const Biography: GlobalConfig = {
  slug: 'biography',
  label: 'Biographie',
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
