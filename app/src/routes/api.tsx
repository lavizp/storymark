import { createFileRoute } from '@tanstack/react-router'
import { FileText, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export const Route = createFileRoute('/api')({
  component: ApiPage,
})

const content = `
# API Reference

Import the core functions to work with markdown files programmatically:

\`\`\`ts
import { getMarkdownList, getMarkdownFile } from 'storymark/core'

const files = getMarkdownList('./docs')
// [{ id: 'getting-started', title: 'Getting Started', slug: 'getting-started' }]

const content = getMarkdownFile('./docs', 'getting-started')
// '# Hello\\n\\nThis is markdown content.'
\`\`\`

## Core Types

\`\`\`ts
export interface StorymarkFile {
  id: string;
  title: string;
  slug: string;
  content?: string;
}
\`\`\`
`

function ApiPage() {
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
          <a href="/docs" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            Docs
          </a>
          <a href="/api" className="text-[var(--text-main)] transition-colors">
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

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-[720px] mx-auto">
          <div className="prose-custom">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="font-serif text-[40px] mb-6 leading-tight" {...props} />,
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
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  )
}
