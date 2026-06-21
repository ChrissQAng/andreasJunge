import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Texts: GlobalConfig = {
  slug: 'texts',
  label: 'Texts',
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'categories',
      type: 'array',
      label: 'Textkategorien',
      labels: {
        singular: 'Kategorie',
        plural: 'Kategorien',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel (Name der Unterkategorie)',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Text',
          editor: lexicalEditor(),
          required: true,
        },
      ],
    },
  ],
}
