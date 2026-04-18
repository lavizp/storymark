import type { Plugin } from 'vite'
import { getMarkdownList, getMarkdownFile } from '../core/index'

export interface StorymarkPluginOptions {
  docsPath: string | string[]
  disableInProduction?: boolean
}

export function storymarkPlugin(options: StorymarkPluginOptions): Plugin {
  const docsPath = Array.isArray(options.docsPath)
    ? options.docsPath
    : [options.docsPath]
  const { disableInProduction = false } = options
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