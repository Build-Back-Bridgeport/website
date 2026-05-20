type JsonLdValue = Record<string, unknown>

interface JsonLdProps {
  data: JsonLdValue | JsonLdValue[]
}

export function JsonLd({ data }: JsonLdProps) {
  const graphs = Array.isArray(data) ? data : [data]

  return (
    <>
      {graphs.map((graph, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      ))}
    </>
  )
}
