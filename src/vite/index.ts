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
        const reqUrl = req.url || ''

        const queryIndex = reqUrl.indexOf('?')
        const queryString = queryIndex !== -1 ? reqUrl.slice(queryIndex + 1) : ''
        const params = new URLSearchParams(queryString)
        const id = params.get('id')

        if (!id) {
          const list = getMarkdownList(docsPath)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(list))
          return
        }

        const content = getMarkdownFile(docsPath, id)
        if (content === null) {
          res.statusCode = 404
          res.end('Not Found')
          return
        }
        res.setHeader('Content-Type', 'text/markdown')
        res.end(content)
      })
    },
  }
}
