import { CodeBlock } from '#/components/code-blocks';
import { Tabs } from '#/components/tabs';
import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, FileText, Folder } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export const Route = createFileRoute('/')({ component: App })
const nextjsSetup = `// app/api/storymark/route.ts
import { createStorymarkHandler } from 'storymark/next'

export const GET = createStorymarkHandler({ docsPath: './docs' })

// app/admin/docs/page.tsx
import { StorymarkUI } from 'storymark/ui'

export default function DocsPage() {
  return <StorymarkUI />
}`;

const viteSetup = `// vite.config.ts
import { defineConfig } from 'vite'
import { storymarkPlugin } from 'storymark/vite'

export default defineConfig({
  plugins: [
    storymarkPlugin({ docsPath: './docs' })
  ],
})

// src/App.tsx
import { StorymarkUI } from 'storymark/ui'

function App() {
  return <StorymarkUI />
}`;

const multipleFolders = `// Next.js: api/storymark/route.ts
export const GET = createStorymarkHandler({
  docsPath: ['./docs', './guides', './faq']
})

// Vite: vite.config.ts
storymarkPlugin({
  docsPath: ['./docs', './guides', './faq']
})`;

const coreApi = `import { getMarkdownList, getMarkdownFile } from 'storymark/core'

const files = getMarkdownList('./docs')
// [{ id: 'getting-started', title: 'Getting Started', slug: 'getting-started' }]

const content = getMarkdownFile('./docs', 'getting-started')
// '# Hello\\n\\nThis is markdown content.'`;
function App() {
  const [copiedNpm, setCopiedNpm] = useState(false);

  const handleCopyNpm = () => {
    navigator.clipboard.writeText('npm install storymark');
    setCopiedNpm(true);
    setTimeout(() => setCopiedNpm(false), 2000);
  };
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] flex flex-col w-full h-[100vh] overflow-x-hidden">
      {/* Navigation */}
      <nav className="z-50 bg-[var(--bg)] border-b border-[var(--border)] px-12 flex items-center justify-between h-[80px] shrink-0">
        <div className="font-serif italic font-bold tracking-[-0.5px] text-[24px]">
          storymark
        </div>
        <div className="flex gap-8 uppercase tracking-[0.1em] text-[14px]">
          <a href="#" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            Docs
          </a>
          <a href="#" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            API
          </a>
          <a href="#" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            Vite
          </a>
          <a href="#" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            Next.js
          </a>
          <a href="#" className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 p-12 grid lg:grid-cols-[3.5fr_5fr] gap-8 items-center max-w-[1150px] mx-auto w-full">
        <div className="flex flex-col">
          <h1 className="font-serif text-[64px] font-normal leading-[1.1] mb-6">
            Modern Storybook for Markdown.
          </h1>

          <p className="text-[18px] text-[var(--text-dim)] max-w-[440px] leading-[1.6] mb-8">
            The developer-friendly sandbox for documenting components and guides. Built for React, powered by Next.js and Vite.
          </p>

          <div className="flex gap-4 items-center">
            <button className="bg-[var(--text-main)] text-[var(--bg)] px-[28px] py-[12px] rounded font-semibold text-[14px] hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded px-[20px] py-[10px] flex items-center justify-between gap-4">
              <code className="font-mono text-[13px] text-[var(--accent)]">npm install storymark</code>
              <button
                onClick={handleCopyNpm}
                className="text-[var(--text-dim)] hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedNpm ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <div className="bg-[var(--card-bg)] rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-[var(--border)] overflow-hidden h-[420px] flex flex-col">
            <div className="h-[32px] bg-[#1e1e24] flex items-center px-[12px] justify-between shrink-0 border-b border-[var(--border)]">
              <div className="flex items-center gap-[6px]">
                <div className="w-2 h-2 rounded-full bg-[var(--border)]"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--border)]"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--border)]"></div>
              </div>
              <div className="bg-[#141418] rounded px-20 py-0.5 text-[10px] text-[var(--text-dim)] font-mono flex items-center">
                localhost:3000/docs
              </div>
              <div className="w-10"></div> {/* Spacer for symmetry */}
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-[140px] bg-[#0a0a0c] border-r border-[var(--border)] p-3 flex flex-col gap-3">
                <div className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-0.5">
                  Documentation
                </div>
                <div className="flex flex-col gap-1">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex items-center gap-1.5 text-[12px] text-[var(--accent)] bg-[rgba(56,189,248,0.1)] px-1.5 py-1.5 rounded cursor-pointer"
                  >
                    <FileText size={13} shrink-0 /> Getting Started
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="flex items-center gap-1.5 text-[12px] text-[var(--text-dim)] px-1.5 py-1.5 rounded"
                  >
                    <FileText size={13} shrink-0 /> Installation
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col gap-0.5 mt-1 text-[12px] text-[var(--text-dim)]"
                  >
                    <div className="flex items-center gap-1.5 px-1.5 py-1 font-medium">
                      <Folder size={13} className="opacity-70 shrink-0" /> Components
                    </div>
                    <div className="flex flex-col gap-0.5 pl-5">
                      <div className="py-1 relative">
                        <span className="w-[1px] h-full bg-[var(--border)] absolute left-[-6px] top-0"></span>
                        Button
                      </div>
                      <div className="py-1 relative">
                        <span className="w-[1px] h-full bg-[var(--border)] absolute left-[-6px] top-0"></span>
                        Card
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 p-8 bg-[var(--card-bg)] overflow-hidden relative">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="max-w-[400px]"
                >
                  <h2 className="font-serif text-2xl mb-4 text-white">Getting Started</h2>
                  <p className="text-[13px] text-[var(--text-dim)] mb-6 leading-[1.6]">
                    Welcome to storymark. In this guide, we'll walk through setting up your next documentation site effortlessly.
                  </p>

                  <div className="h-[1px] bg-[var(--border)] w-full mb-6 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="absolute top-0 left-0 h-full bg-[var(--accent)] opacity-20"
                    />
                  </div>

                  <h3 className="text-sm font-semibold mb-3 text-white">Initialization</h3>
                  <div className="bg-[#0a0a0c] border border-[var(--border)] rounded flex p-3">
                    <code className="text-[12px] font-mono text-[#98c379]">
                      <span className="text-[#c678dd]">export const</span> <span className="text-[#61afef]">GET</span> = <span className="text-[#61afef]">createStorymarkHandler</span>()
                    </code>
                  </div>

                  {/* Skeleton loaders for extra content */}
                  <div className="mt-8 flex flex-col gap-3 opacity-50">
                    <motion.div initial={{ width: "0%" }} animate={{ width: "80%" }} transition={{ delay: 0.9, duration: 0.6 }} className="h-2 bg-[var(--text-dim)] rounded-full"></motion.div>
                    <motion.div initial={{ width: "0%" }} animate={{ width: "60%" }} transition={{ delay: 1.0, duration: 0.6 }} className="h-2 bg-[var(--text-dim)] rounded-full"></motion.div>
                    <motion.div initial={{ width: "0%" }} animate={{ width: "90%" }} transition={{ delay: 1.1, duration: 0.6 }} className="h-2 bg-[var(--text-dim)] rounded-full"></motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Features Bento Grid */}
        <div className="grid md:grid-cols-3 gap-6 col-span-2 lg:col-span-2 mt-6 max-w-[1150px] mx-auto w-full px-12 shrink-0">
          {/* Feature 1 */}
          <div className="card-panel p-6">
            <h3 className="text-[14px] uppercase tracking-[0.1em] text-[var(--accent)] mb-3">
              Universal Adapters
            </h3>
            <p className="text-[14px] text-[var(--text-dim)] leading-[1.5]">
              Native handlers for Next.js App Router and Vite. Deploy your documentation in minutes, not hours.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-panel p-6">
            <h3 className="text-[14px] uppercase tracking-[0.1em] text-[var(--accent)] mb-3">
              Multi-Folder Support
            </h3>
            <p className="text-[14px] text-[var(--text-dim)] leading-[1.5]">
              Aggregate Markdown from disparate directories into a unified, searchable sidebar UI.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-panel p-6">
            <h3 className="text-[14px] uppercase tracking-[0.1em] text-[var(--accent)] mb-3">
              React Native Feel
            </h3>
            <p className="text-[14px] text-[var(--text-dim)] leading-[1.5]">
              Built with React-Markdown and accessible primitives. Fully themeable to match your design system.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-12 py-[24px] text-[12px] text-[#4b5563] border-t border-[var(--border)] flex justify-between max-w-[1150px] mx-auto w-full shrink-0">
        <span>Licensed under MIT</span>
        <span>Compatible with React 18+ and Next.js 13+</span>
      </footer>
    </div>
  )
}

