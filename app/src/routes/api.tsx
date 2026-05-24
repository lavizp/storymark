import { Navbar } from '#/components/navbar'
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
import { getMarkdownList, getMarkdownFile } from '@lavizp/storymark/core'

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
      <Navbar activePath="/api" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-[720px] mx-auto">
          <div className="prose-custom">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="font-serif text-3xl md:text-[40px] mb-6 leading-tight" {...props} />,
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
