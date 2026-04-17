import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export interface StorymarkFile {
  id: string
  title: string
  slug: string
}

export interface StorymarkUIProps {
  apiEndpoint?: string
  basePath?: string
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '280px',
    borderRight: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
    fontWeight: 600,
    fontSize: '14px',
    color: '#333',
  },
  sidebarList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  sidebarItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #e0e0e0',
    transition: 'background-color 0.15s ease',
  },
  sidebarItemActive: {
    backgroundColor: '#e3e3e3',
    borderLeft: '3px solid #1976d2',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px 48px',
    backgroundColor: '#fff',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#666',
    fontSize: '16px',
  },
  markdown: {
    maxWidth: '800px',
    lineHeight: 1.6,
  },
  markdownH1: {
    fontSize: '2em',
    fontWeight: 600,
    marginBottom: '0.5em',
    paddingBottom: '0.3em',
    borderBottom: '1px solid #e0e0e0',
  },
  markdownH2: {
    fontSize: '1.5em',
    fontWeight: 600,
    marginTop: '1.5em',
    marginBottom: '0.5em',
  },
  markdownH3: {
    fontSize: '1.25em',
    fontWeight: 600,
    marginTop: '1.25em',
    marginBottom: '0.5em',
  },
  markdownP: {
    marginBottom: '1em',
  },
  markdownCode: {
    backgroundColor: '#f5f5f5',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.9em',
  },
  markdownPre: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '8px',
    overflowX: 'auto',
  },
  markdownPreCode: {
    fontFamily: 'monospace',
    fontSize: '0.9em',
  },
  markdownUl: {
    paddingLeft: '24px',
    marginBottom: '1em',
  },
  markdownOl: {
    paddingLeft: '24px',
    marginBottom: '1em',
  },
  markdownLi: {
    marginBottom: '0.5em',
  },
  markdownBlockquote: {
    borderLeft: '4px solid #1976d2',
    paddingLeft: '16px',
    marginLeft: 0,
    color: '#666',
  },
  markdownA: {
    color: '#1976d2',
    textDecoration: 'none',
  },
  markdownAHover: {
    textDecoration: 'underline',
  },
}

export function StorymarkUI({ apiEndpoint = '/api/storymark', basePath = '/admin/docs' }: StorymarkUIProps) {
  const [files, setFiles] = useState<StorymarkFile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      setActiveId(hash)
    }
  }, [])

  useEffect(() => {
    async function fetchList() {
      try {
        const res = await fetch(apiEndpoint)
        if (res.ok) {
          const data = await res.json()
          setFiles(data)
        }
      } catch (err) {
        console.error('Failed to fetch markdown list:', err)
      }
    }
    fetchList()
  }, [apiEndpoint])

  useEffect(() => {
    if (!activeId) return

    async function fetchContent() {
      setLoading(true)
      try {
        const res = await fetch(`${apiEndpoint}/${activeId}`)
        if (res.ok) {
          const text = await res.text()
          setContent(text)
        }
      } catch (err) {
        console.error('Failed to fetch markdown content:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [apiEndpoint, activeId])

  const handleItemClick = (id: string) => {
    setActiveId(id)
    window.location.hash = id
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Documents</div>
        <ul style={styles.sidebarList}>
          {files.map((file) => (
            <li
              key={file.id}
              style={{
                ...styles.sidebarItem,
                ...(activeId === file.id ? styles.sidebarItemActive : {}),
              }}
              onClick={() => handleItemClick(file.id)}
              onMouseEnter={(e) => {
                if (activeId !== file.id) {
                  e.currentTarget.style.backgroundColor = '#eaeaea'
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== file.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {file.title}
            </li>
          ))}
        </ul>
      </aside>
      <main style={styles.main}>
        {!activeId ? (
          <div style={styles.empty}>Select a document from the sidebar</div>
        ) : loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : (
          <div style={styles.markdown}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 style={styles.markdownH1}>{children}</h1>,
                h2: ({ children }) => <h2 style={styles.markdownH2}>{children}</h2>,
                h3: ({ children }) => <h3 style={styles.markdownH3}>{children}</h3>,
                p: ({ children }) => <p style={styles.markdownP}>{children}</p>,
                code: ({ className, children }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock ? (
                    <pre style={styles.markdownPre}>
                      <code style={styles.markdownPreCode}>{children}</code>
                    </pre>
                  ) : (
                    <code style={styles.markdownCode}>{children}</code>
                  )
                },
                ul: ({ children }) => <ul style={styles.markdownUl}>{children}</ul>,
                ol: ({ children }) => <ol style={styles.markdownOl}>{children}</ol>,
                li: ({ children }) => <li style={styles.markdownLi}>{children}</li>,
                blockquote: ({ children }) => <blockquote style={styles.markdownBlockquote}>{children}</blockquote>,
                a: ({ href, children }) => (
                  <a href={href} style={styles.markdownA}>
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </main>
    </div>
  )
}