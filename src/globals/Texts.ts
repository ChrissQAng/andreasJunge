import type { GlobalConfig } from 'payload'

export const Texts: GlobalConfig = {
  slug: 'texts',
  label: 'Texte',
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
