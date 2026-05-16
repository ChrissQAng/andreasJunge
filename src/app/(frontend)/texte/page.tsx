import { getPayload } from 'payload'
import config from '@/../src/payload.config'
import './texte.css'

export const dynamic = 'force-dynamic'

export default async function TextePage() {
  const payload = await getPayload({ config })
  const texts = await payload.findGlobal({ slug: 'texts' })

  return (
    <article className="texte container">
      <h1 className="texte__heading">Texte</h1>
      <div className="texte__content">
        {texts.content ? (
          <RichTextRenderer content={texts.content} />
        ) : (
          <p>Kein Inhalt vorhanden.</p>
        )}
      </div>
    </article>
  )
}

function RichTextRenderer({ content }: { content: Record<string, unknown> }) {
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
