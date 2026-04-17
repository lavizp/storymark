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

export function getMarkdownList(docsPath: string): MarkdownListResult[] {
  const resolvedPath = path.resolve(docsPath)

  if (!fs.existsSync(resolvedPath)) {
    return []
  }

  const files = fs.readdirSync(resolvedPath)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  return markdownFiles.map((filename) => {
    const id = filename.replace(/\.md$/, '')
    return {
      id,
      title: formatTitle(filename),
      slug: id,
    }
  })
}

export function getMarkdownFile(docsPath: string, id: string): string | null {
  const resolvedPath = path.resolve(docsPath)
  const filePath = path.join(resolvedPath, `${id}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath, 'utf-8')
}