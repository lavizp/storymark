import * as fs from 'fs'
import * as path from 'path'

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

function getMarkdownList(docsPath: string): MarkdownListResult[] {
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

function getMarkdownFile(docsPath: string, id: string): string | null {
  const resolvedPath = path.resolve(docsPath)
  const filePath = path.join(resolvedPath, `${id}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath, 'utf-8')
}

export interface StorymarkHandlerOptions {
  docsPath: string
  disableInProduction?: boolean
}

export function createStorymarkHandler(options: StorymarkHandlerOptions) {
  const { docsPath, disableInProduction = false } = options

  return async function storymarkHandler(
    request: Request
  ): Promise<Response> {
    const isProduction = process.env.NODE_ENV === 'production'

    if (disableInProduction || isProduction) {
      return new Response('Forbidden', { status: 403 })
    }

    const url = new URL(request.url)
    const pathParts = url.pathname.split('/').filter(Boolean)

    const isBaseEndpoint = pathParts.length === 1 && pathParts[0] === 'api' && url.pathname.endsWith('/api/storymark')

    if (isBaseEndpoint || url.pathname === '/api/storymark') {
      const list = getMarkdownList(docsPath)
      return new Response(JSON.stringify(list), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (pathParts.includes('storymark')) {
      const idIndex = pathParts.indexOf('storymark') + 1
      const id = pathParts[idIndex]

      if (id) {
        const content = getMarkdownFile(docsPath, id)
        if (content === null) {
          return new Response('Not Found', { status: 404 })
        }
        return new Response(content, {
          status: 200,
          headers: { 'Content-Type': 'text/markdown' },
        })
      }
    }

    return new Response('Not Found', { status: 404 })
  }
}