import React from 'react'
import type { SiteSnapshot } from './transport'

/** Supply the customer's existing components. Never resolve component source from JSON. */
export function RenderSitePage({ snapshot, path, registry }: { snapshot: SiteSnapshot; path: string; registry: Record<string, React.ComponentType<{ values: Record<string, unknown>; locale: string }>> }) {
  const page = snapshot.pages.find(page => page.path === path)
  if (!page) throw new Error('Page not declared by site content')
  for (const contentModule of page.modules) if (!registry[contentModule.type]) throw new Error(`Unregistered site component: ${contentModule.type}`)
  return <div data-hq-content-version={snapshot.version}>{page.modules.map(contentModule => {
    const Component = registry[contentModule.type]
    return <Component key={contentModule.key} values={contentModule.values} locale={snapshot.locale} />
  })}</div>
}

