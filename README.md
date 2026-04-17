# storymark

Storybook for Markdown files - a React-based UI with backend adapters for Next.js and Vite.

## Installation

```bash
npm install storymark
```

Peer dependencies required:

```bash
npm install react react-dom react-markdown
```

## Usage

### Next.js

1. Create an API route:

```ts
// app/api/storymark/route.ts
import { createStorymarkHandler } from 'storymark/next'

export const GET = createStorymarkHandler({ docsPath: './docs' })
```

2. Add the UI to a page:

```tsx
// app/admin/docs/page.tsx
import { StorymarkUI } from 'storymark/ui'

export default function DocsPage() {
  return <StorymarkUI />
}
```

### Vite

1. Configure the plugin:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { storymarkPlugin } from 'storymark/vite'

export default defineConfig({
  plugins: [
    storymarkPlugin({ docsPath: './docs' })
  ],
})
```

2. Add the UI to your app:

```tsx
// src/App.tsx
import { StorymarkUI } from 'storymark/ui'

function App() {
  return <StorymarkUI />
}
```

## API

### Core (`storymark/core`)

```ts
import { getMarkdownList, getMarkdownFile } from 'storymark/core'

const files = getMarkdownList('./docs')
// [{ id: 'getting-started', title: 'Getting Started', slug: 'getting-started' }]

const content = getMarkdownFile('./docs', 'getting-started')
// '# Hello\n\nThis is markdown content.'
```

### UI (`storymark/ui`)

```tsx
import { StorymarkUI } from 'storymark/ui'

<StorymarkUI
  apiEndpoint="/api/storymark"
  basePath="/admin/docs"
/>
```

### Next.js (`storymark/next`)

```ts
import { createStorymarkHandler } from 'storymark/next'

createStorymarkHandler({
  docsPath: './docs',
  disableInProduction: false,
})
```

### Vite (`storymark/vite`)

```ts
import { storymarkPlugin } from 'storymark/vite'

storymarkPlugin({
  docsPath: './docs',
  disableInProduction: false,
})
```

## License

MIT