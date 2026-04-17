import * as fs from 'fs'
import * as path from 'path'
import type { Plugin } from 'vite'

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

export interface StorymarkPluginOptions {
  docsPath: string
  disableInProduction?: boolean
}

export function storymarkPlugin(options: StorymarkPluginOptions): Plugin {
  const { docsPath, disableInProduction = false } = options
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    name: 'vite-plugin-storymark',
    configureServer(server) {
      if (disableInProduction || isProduction) {
        return
      }

      server.middlewares.use('/api/storymark', (req, res, next) => {
        const url = req.url || ''

        if (url === '' || url === '/') {
          const list = getMarkdownList(docsPath)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(list))
          return
        }

        const id = url.slice(1)
        if (id) {
          const content = getMarkdownFile(docsPath, id)
          if (content === null) {
            res.statusCode = 404
            res.end('Not Found')
            return
          }
          res.setHeader('Content-Type', 'text/markdown')
          res.end(content)
          return
        }

        next()
      })
    },
  }
}