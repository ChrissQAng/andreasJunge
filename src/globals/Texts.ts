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
          type: 'textarea',
          label: 'Text',
          required: true,
        },
      ],
    },
  ],
}
