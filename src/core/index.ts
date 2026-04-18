import * as fs from 'fs'
import * as path from 'path'

export interface MarkdownFile {
  id: string
  title: string
  slug: string
}

export interface MarkdownListResult {
  id: string
  title: string
  slug: string
}

function formatTitle(filename: string): string {
  const nameWithoutExt = filename.replace(/\.md$/, '')
  return nameWithoutExt
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getMarkdownList(docsPath: string | string[]): MarkdownListResult[] {
  const docsPaths = Array.isArray(docsPath) ? docsPath : [docsPath]
  const results: MarkdownListResult[] = []

  for (const docsPathItem of docsPaths) {
    const resolvedPath = path.resolve(docsPathItem)
    const prefix = docsPathItem.replace(/^\.\//, '').replace(/[/\\]/g, '/')

    if (!fs.existsSync(resolvedPath)) {
      continue
    }

    const files = fs.readdirSync(resolvedPath)
    const markdownFiles = files.filter((file) => file.endsWith('.md'))

    for (const filename of markdownFiles) {
      const idWithoutExt = filename.replace(/\.md$/, '')
      const id = prefix ? `${prefix}/${idWithoutExt}` : idWithoutExt

      results.push({
        id,
        title: formatTitle(filename),
        slug: id,
      })
    }
  }

  return results
}

export function getMarkdownFile(docsPath: string | string[], id: string): string | null {
  const docsPaths = Array.isArray(docsPath) ? docsPath : [docsPath]

  for (const docsPathItem of docsPaths) {
    const resolvedPath = path.resolve(docsPathItem)
    const prefix = docsPathItem.replace(/^\.\//, '').replace(/[/\\]/g, '/')
    const escapedPrefix = prefix.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    const idWithoutPrefix = prefix ? id.replace(new RegExp(`^${escapedPrefix}/`), '') : id
    const filePath = path.join(resolvedPath, `${idWithoutPrefix}.md`)

    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8')
    }
  }

  return null
}