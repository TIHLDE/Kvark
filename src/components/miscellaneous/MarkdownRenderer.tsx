import React from 'react';
import classNames from 'classnames';

// External Imports
import ReactMarkdown from 'react-markdown';

type MarkdownRendererProps = {
  className?: string;
  value: string;
};

function MarkdownRenderer({ className, value }: MarkdownRendererProps) {
  return (
    <div className={classNames(className, 'renderer')}>
      <ReactMarkdown>{value || ''}</ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
