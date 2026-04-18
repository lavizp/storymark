
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';

interface CodeBlockProps {
  language?: string;
  code: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, filename, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group w-full h-full flex flex-col">
      <div className="flex justify-end p-2 absolute top-0 right-0 z-10 bg-gradient-to-l from-[var(--card-bg)] to-transparent">
        <button
          onClick={handleCopy}
          className="hover:text-[var(--text-main)] text-[var(--text-dim)] transition-colors flex items-center gap-1.5 font-sans font-medium text-[12px] px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-[var(--accent)]" /> : <Copy size={14} />}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>
      </div>
      <div className="text-[13px] font-mono text-[#d1d5db] overflow-x-auto w-full pt-1" style={{ color: '#d1d5db' }}>
        <pre className="!bg-transparent !p-0 m-0 leading-[1.5] text-[#d1d5db]">
          <code className={`language-${language}`} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#d1d5db' }}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
