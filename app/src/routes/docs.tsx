import { createFileRoute } from '@tanstack/react-router'
import { FileText, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `Welcome to storymark. In this guide, we'll walk through setting up your next documentation site effortlessly.

## Quick Start

\`\`\`bash
npm install storymark
\`\`\`

Then configure your API handler and add the UI to your app.`,
  },
  {
    id: 'installation',
    title: 'Installation',
    content: `Install the package and its peer dependencies:

\`\`\`bash
npm install storymark
npm install react react-dom react-markdown
\`\`\`

## Peer Dependencies

- react: >=18.0.0
- react-dom: >=18.0.0
- react-markdown: >=9.0.0`,
  },
  {
    id: 'api',
    title: 'API Reference',
    content: `Import the core functions to work with markdown files programmatically:

\`\`\`ts
import { getMarkdownList, getMarkdownFile } from 'storymark/core'

const files = getMarkdownList('./docs')
// [{ id: 'getting-started', title: 'Getting Started', slug: 'getting-started' }]

const content = getMarkdownFile('./docs', 'getting-started')
// '# Hello\\n\\nThis is markdown content.'
\`\`\``,
  },
  {
    id: 'vite',
    title: 'Vite Setup',
    content: `Configure the Vite plugin in your config:

\`\`\`ts
// vite.config.ts
import { defineConfig } from 'vite'
import { storymarkPlugin } from 'storymark/vite'

export default defineConfig({
  plugins: [
    storymarkPlugin({ docsPath: './docs' })
  ],
})
\`\`\`

Then add the UI component:

\`\`\`tsx
import { StorymarkUI } from 'storymark/ui'

function App() {
  return <StorymarkUI />
}
\`\`\``,
  },
  {
    id: 'nextjs',
    title: 'Next.js Setup',
    content: `Create an API route for the handler:

\`\`\`ts
// app/api/storymark/route.ts
import { createStorymarkHandler } from 'storymark/next'

export const GET = createStorymarkHandler({ docsPath: './docs' })
\`\`\`

Add the UI to your docs page:

\`\`\`tsx
// app/docs/page.tsx
import { StorymarkUI } from 'storymark/ui'

export default function DocsPage() {
  return <StorymarkUI />
}
\`\`\``,
  },
]

function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const activeContent = sections.find((s) => s.id === activeSection)

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] flex flex-col w-full overflow-x-hidden">
      {/* Navigation */}
      <nav className="z-50 bg-[var(--bg)] border-b border-[var(--border)] px-12 flex items-center justify-between h-[80px] shrink-0">
        <div className="font-serif italic font-bold tracking-[-0.5px] text-[24px]">
          storymark
        </div>
        <div className="flex gap-8 uppercase tracking-[0.1em] text-[14px]">
          <a href="/" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            Home
          </a>
          <a href="/docs" className="text-[var(--text-main)] transition-colors">
            Docs
          </a>
          <a href="/api" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            API
          </a>
          <a href="/vite" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            Vite
          </a>
          <a href="/nextjs" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            Next.js
          </a>
          <a href="https://github.com/lavizp/storymark" target="_blank" rel="noopener noreferrer" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            GitHub
          </a>
        </div>
      </nav>

      {/* Docs Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] bg-[#0a0a0c] border-r border-[var(--border)] p-6 flex flex-col shrink-0 overflow-y-auto">
          <div className="text-[11px] font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-4">
            Documentation
          </div>
          <div className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-2 text-[13px] px-3 py-2 rounded text-left transition-colors
                  ${activeSection === section.id
                    ? 'text-[var(--accent)] bg-[rgba(56,189,248,0.1)]'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[rgba(255,255,255,0.03)]'
                  }
                `}
              >
                <FileText size={14} className="shrink-0 opacity-70" />
                {section.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-[720px] mx-auto">
            {activeContent && (
              <>
                <h1 className="font-serif text-[40px] mb-6 leading-tight">
                  {activeContent.title}
                </h1>
                <div className="h-[1px] bg-[var(--border)] w-full mb-8" />
                <div className="prose-custom">
                  <ReactMarkdown
                    components={{
                      h2: ({node, ...props}) => <h2 className="text-[20px] font-semibold mt-8 mb-4 text-white" {...props} />,
                      p: ({node, ...props}) => <p className="text-[15px] text-[var(--text-dim)] leading-[1.7] mb-4" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-[#0a0a0c] border border-[var(--border)] rounded-lg p-4 overflow-x-auto my-4" {...props} />,
                      code: (props) => {
                        const {children, className, node, ...rest} = props
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <code className={`text-[13px] font-mono text-[#98c379] ${className || ''}`} {...rest}>
                            {children}
                          </code>
                        ) : (
                          <code className="bg-[#0a0a0c] px-2 py-0.5 rounded text-[var(--accent)] font-mono text-[14px]" {...rest}>
                            {children}
                          </code>
                        )
                      },
                      ul: ({node, ...props}) => <ul className="list-disc pl-6 text-[15px] text-[var(--text-dim)] leading-[1.7] mb-4" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />
                    }}
                  >
                    {activeContent.content}
                  </ReactMarkdown>
                </div>

                {/* Next section hint */}
                <div className="mt-12 pt-8 border-t border-[var(--border)] flex justify-between items-center">
                  <span className="text-[13px] text-[var(--text-dim)]">
                    Next section
                  </span>
                  <button
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection)
                      if (idx < sections.length - 1) {
                        setActiveSection(sections[idx + 1].id)
                      }
                    }}
                    className="flex items-center gap-2 text-[var(--accent)] hover:opacity-80 transition-opacity text-[14px]"
                  >
                    {sections.findIndex((s) => s.id === activeSection) < sections.length - 1
                      ? sections[sections.findIndex((s) => s.id === activeSection) + 1].title
                      : 'Getting Started'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}