import { getMarkdownList, getMarkdownFile } from '../core/index'

export interface StorymarkHandlerOptions {
  docsPath: string | string[]
  disableInProduction?: boolean
}

export function createStorymarkHandler(options: StorymarkHandlerOptions) {
  const docsPath = Array.isArray(options.docsPath)
    ? options.docsPath
    : [options.docsPath]
  const { disableInProduction = false } = options

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