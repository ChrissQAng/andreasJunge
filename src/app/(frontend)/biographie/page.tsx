import { getPayload } from 'payload'
import config from '@/../src/payload.config'
import './biographie.css'

export const dynamic = 'force-dynamic'

export default async function BiographiePage() {
  const payload = await getPayload({ config })
  const biography = await payload.findGlobal({ slug: 'biography' })

  return (
    <article className="biographie container">
      <h1 className="biographie__heading">Biographie</h1>
      <div className="biographie__content">
        {biography.content ? (
          <RichTextRenderer content={biography.content} />
        ) : (
          <p>Kein Inhalt vorhanden.</p>
        )}
      </div>
    </article>
  )
}

function RichTextRenderer({ content }: { content: Record<string, unknown> }) {
  // Lexical rich text: render top-level paragraph nodes as <p> tags
  const root = content as { root?: { children?: Array<{ type: string; children?: Array<{ text?: string }> }> } }
  if (!root?.root?.children) return null

  return (
    <>
      {root.root.children.map((node, i) => {
        const text = node.children?.map((child) => child.text ?? '').join('') ?? ''
        if (node.type === 'paragraph') return <p key={i}>{text}</p>
        if (node.type === 'heading') return <h2 key={i}>{text}</h2>
        return null
      })}
    </>
  )
}
