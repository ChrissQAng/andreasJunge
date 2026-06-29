import type { CollectionConfig } from 'payload'

export const Exhibitions: CollectionConfig = {
  slug: 'exhibitions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'period', 'location'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'period',
      type: 'text',
      required: true,
      label: 'Zeitraum',
      admin: {
        placeholder: 'z. B. 12.03.–05.05.2025',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Ort',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Externer Link',
      admin: {
        placeholder: 'https://...',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Bild (optional)',
    },
    {
      name: 'showInSlideshow',
      type: 'checkbox',
      label: 'Bildintegration Diashow',
      defaultValue: false,
      admin: {
        description: 'Bild dieser Ausstellung in die Diashow auf der Startseite integrieren',
      },
    },
  ],
}
