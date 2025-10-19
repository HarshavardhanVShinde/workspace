import React from 'react'

export type StructuredDataProps = {
  data: Record<string, any>
}

export default function StructuredData({ data }: StructuredDataProps) {
  if (!data) return null
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}