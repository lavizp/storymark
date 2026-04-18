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

## Multiple Folders

Pass an array to `docsPath` to load markdown files from multiple directories:

```ts
// Next.js
export const GET = createStorymarkHandler({
  docsPath: ['./docs', './guides', './faq']
})

// Vite
storymarkPlugin({
  docsPath: ['./docs', './guides', './faq']
})
```

Each file's ID is prefixed with its folder path to avoid collisions:

```ts
// API response:
[
  { id: 'docs/getting-started', title: 'Getting Started', slug: 'docs/getting-started' },
  { id: 'docs/installation', title: 'Installation', slug: 'docs/installation' },
  { id: 'guides/api', title: 'Api', slug: 'guides/api' },
  { id: 'faq/questions', title: 'Questions', slug: 'faq/questions' }
]
```

Fetch a specific file by its full ID:

```ts
// GET /api/storymark/docs/getting-started
// GET /api/storymark/guides/api
```

## API

### Core (`storymark/core`)

```ts
import { getMarkdownList, getMarkdownFile } from 'storymark/core'

const files = getMarkdownList('./docs')
// [{ id: 'getting-started', title: 'Getting Started', slug: 'getting-started' }]

const content = getMarkdownFile('./docs', 'getting-started')
// '# Hello\n\nThis is markdown content.'

// Multiple folders
const allFiles = getMarkdownList(['./docs', './guides'])
const content = getMarkdownFile(['./docs', './guides'], 'guides/api')
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

// Multiple folders
createStorymarkHandler({
  docsPath: ['./docs', './guides'],
})
```

### Vite (`storymark/vite`)

```ts
import { storymarkPlugin } from 'storymark/vite'

storymarkPlugin({
  docsPath: './docs',
  disableInProduction: false,
})

// Multiple folders
storymarkPlugin({
  docsPath: ['./docs', './guides'],
})
```

## License

MIT