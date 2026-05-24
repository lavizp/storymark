import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activePath?: string;
}

export function Navbar({ activePath }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
    { name: 'API', path: '/api' },
    { name: 'Vite', path: '/vite' },
    { name: 'Next.js', path: '/nextjs' },
  ];

  return (
    <nav className="z-50 bg-[var(--bg)] border-b border-[var(--border)] px-6 md:px-12 flex items-center justify-between h-[80px] shrink-0 relative">
      <div className="font-serif italic font-bold tracking-[-0.5px] text-[24px]">
        <a href="/">storymark</a>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 uppercase tracking-[0.1em] text-[14px]">
        {navLinks.map((link) => {
          if (link.path === '/' && activePath === '/') return null; // Don't show Home on Home
          return (
            <a
              key={link.path}
              href={link.path}
              className={`transition-colors ${
                activePath === link.path
                  ? 'text-[var(--text-main)]'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
              }`}
            >
              {link.name}
            </a>
          );
        })}
        <a
          href="https://github.com/lavizp/storymark"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
        >
          GitHub
        </a>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-[var(--text-dim)] hover:text-[var(--text-main)]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-[var(--bg)] border-b border-[var(--border)] flex flex-col p-6 gap-6 md:hidden z-50">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`uppercase tracking-[0.1em] text-[14px] ${
                activePath === link.path
                  ? 'text-[var(--text-main)]'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://github.com/lavizp/storymark"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase tracking-[0.1em] text-[14px] text-[var(--text-dim)] hover:text-[var(--text-main)]"
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
