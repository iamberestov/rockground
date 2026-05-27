/**
 * Registry of user-exported prototyping components.
 * When you export a grid from the prototyping page, it generates a file
 * in src/prototyping/generated/ and this registry auto-discovers them.
 *
 * To register an exported component manually, add an entry here:
 *
 *   import MyComponent from './MyComponent'
 *   registry.push({ slug: 'my-component', name: 'My Component', component: MyComponent })
 */

import { lazy } from 'react'

export interface RegistryEntry {
  slug: string
  name: string
  /** Optional description */
  desc?: string
  /** Import the component lazily so it's code-split */
  import: () => Promise<{ default: React.ComponentType }>
}

export const registry: RegistryEntry[] = []

/**
 * Get component by slug — returns the lazy component and metadata
 */
export function getEntry(slug: string): RegistryEntry | undefined {
  return registry.find(e => e.slug === slug)
}

export function getAllEntries(): RegistryEntry[] {
  return registry
}

// Registry components here:
registry.push({ slug: 'example-component', name: 'ExampleComponent', import: () => import('./ExampleComponent') })