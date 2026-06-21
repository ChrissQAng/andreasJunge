import { getPayload } from 'payload'
import config from '@/../src/payload.config'
import './texte.css'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ kategorie?: string }>
}

export default async function TextePage({ searchParams }: Props) {
  const { kategorie } = await searchParams
  const payload = await getPayload({ config })
  const texts = await payload.findGlobal({ slug: 'texts' })

  const categories = texts.categories ?? []
  const active = kategorie
    ? categories.find((c) => c.title === kategorie)
    : null

  return (
    <div className="texte container">
      <h1 className="texte__heading">Texte</h1>

      {active ? (
        <article className="texte__content">
          <a href="/texte" className="texte__back">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Texte
          </a>
          <h2 className="texte__category-heading">{active.title}</h2>
          <div className="texte__body">
            <RichTextRenderer content={active.content as Record<string, unknown>} />
          </div>
        </article>
      ) : categories.length > 0 ? (
        <ul className="texte__categories">
          {categories.map((cat) => (
            <li key={cat.id ?? cat.title}>
              <a
                href={`/texte?kategorie=${encodeURIComponent(cat.title)}`}
                className="texte__category-link"
              >
                <span className="texte__category-label">{cat.title}</span>
                <svg
                  className="texte__category-arrow"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="texte__empty">Kein Inhalt vorhanden.</p>
      )}
    </div>
  )
}

function RichTextRenderer({ content }: { content: Record<string, unknown> }) {
  // Lexical rich text: render top-level paragraph/heading nodes
  const root = content as {
    root?: { children?: Array<{ type: string; children?: Array<{ text?: string }> }> }
  }
  if (!root?.root?.children) return null

  return (
    <>
      {root.root.children.map((node, i) => {
        const text = node.children?.map((child) => child.text ?? '').join('') ?? ''
        if (node.type === 'heading') return <h3 key={i}>{text}</h3>
        if (node.type === 'paragraph') return <p key={i}>{text}</p>
        return null
      })}
    </>
  )
}
