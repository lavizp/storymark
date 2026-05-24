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

function walkDir(dirPath: string, basePath: string): string[] {
  const results: string[] = []

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      const subResults = walkDir(fullPath, basePath)
      results.push(...subResults)
    } else if (entry.name.endsWith('.md')) {
      const relativePath = path.relative(basePath, fullPath)
      results.push(relativePath.replace(/\\/g, '/'))
    }
  }

  return results
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

    const relativePaths = walkDir(resolvedPath, resolvedPath)

    for (const relativePath of relativePaths) {
      const idWithoutExt = relativePath.replace(/\.md$/, '')
      const id = prefix ? `${prefix}/${idWithoutExt}` : idWithoutExt

      results.push({
        id,
        title: formatTitle(path.basename(relativePath)),
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