import type { CollectionAfterDeleteHook, CollectionConfig, FieldHook, Where } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const CATEGORIES = ['Tücher', 'Papierarbeiten', 'Klingenschnitte'] as const
const SUBCATEGORIES = ['RAF', 'Auschwitz', 'Diverse'] as const

// Auto-assign sequenceNumber on create; block updates via access control
const assignSequenceNumber: FieldHook = async ({ value, operation, req, siblingData }) => {
  if (operation !== 'create') return value

  const category = siblingData?.category as string | undefined
  const subcategory = siblingData?.subcategory as string | undefined

  if (!category) return value

  // Find the highest existing sequenceNumber within same category+subcategory
  const where: Where = subcategory
    ? { and: [{ category: { equals: category } }, { subcategory: { equals: subcategory } }] }
    : { and: [{ category: { equals: category } }, { subcategory: { exists: false } }] }

  const existing = await req.payload.find({
    collection: 'artworks',
    where,
    sort: '-sequenceNumber',
    limit: 1,
    depth: 0,
  })

  const highest = existing.docs[0]?.sequenceNumber ?? 0
  return (highest as number) + 1
}

// When an artwork is deleted, also delete its linked media image (incl. file on disk).
// Errors (e.g. image already removed) are swallowed so the artwork deletion still succeeds.
const deleteLinkedImage: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const imageId =
    doc?.image && typeof doc.image === 'object' ? doc.image.id : doc?.image

  if (!imageId) return

  try {
    await req.payload.delete({ collection: 'media', id: imageId, req })
  } catch (error) {
    req.payload.logger.error(
      `Konnte verknüpftes Bild (id: ${imageId}) zu gelöschtem Artwork nicht löschen: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

export const Artworks: CollectionConfig = {
  slug: 'artworks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'subcategory', 'sequenceNumber'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    afterDelete: [deleteLinkedImage],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Kategorie',
      options: CATEGORIES.map((c) => ({ label: c, value: c })),
    },
    {
      name: 'subcategory',
      type: 'select',
      label: 'Unterkategorie',
      options: SUBCATEGORIES.map((s) => ({ label: s, value: s })),
      admin: {
        condition: (data) => data?.category === 'Tücher',
        description: 'Nur für Kategorie "Tücher" relevant',
      },
    },
    {
      name: 'sequenceNumber',
      type: 'number',
      label: 'Laufende Nummer',
      required: true,
      admin: {
        readOnly: true,
        description:
          'Wird automatisch vergeben und kann nicht verändert werden.',
      },
      access: {
        update: () => false,
      },
      hooks: {
        beforeChange: [assignSequenceNumber],
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Bild',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschreibung (Detailseite)',
      editor: lexicalEditor(),
      admin: {
        description: 'Beschreibungstext für die Detailseite. Standard: 3 Zeilen, bei Papierarbeiten: 4 Zeilen.',
      },
    },
  ],
}
