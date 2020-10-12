import React from 'react';
import classNames from 'classnames';

// External Imports
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';

type MarkdownRendererProps = {
  className?: string;
  value: string;
};

function MarkdownRenderer({ className, value }: MarkdownRendererProps) {
  return (
    <div className={classNames(className, 'renderer')}>
      <ReactMarkdown plugins={[breaks]} source={value || ''} />
    </div>
  );
}

export default MarkdownRenderer;
