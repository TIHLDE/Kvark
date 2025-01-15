import { createElement, lazy, ReactNode, Suspense, useMemo } from 'react';
import rehypeRaw from 'rehype-raw';

import { Event, EventList, JobPost, News } from 'types';

import { useEventById } from 'hooks/Event';
import { useJobPostById } from 'hooks/JobPost';
import { useNewsById } from 'hooks/News';

import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import JobPostListItem, { JobPostListItemLoading } from 'components/miscellaneous/JobPostListItem';
import NewsListItem, { NewsListItemLoading } from 'components/miscellaneous/NewsListItem';
import Expandable from 'components/ui/expandable';
import { Separator } from 'components/ui/separator';
import { Skeleton } from 'components/ui/skeleton';

const ReactMarkdown = lazy(() => import('react-markdown'));

export const EventCard = ({ id }: { id: Event['id'] }) => {
  const { data } = useEventById(id);
  return data ? <EventListItem event={data as unknown as EventList} size='medium' /> : <EventListItemLoading />;
};

export const JobPostCard = ({ id }: { id: JobPost['id'] }) => {
  const { data } = useJobPostById(id);
  return data ? <JobPostListItem jobPost={data} /> : <JobPostListItemLoading />;
};

export const NewsCard = ({ id }: { id: News['id'] }) => {
  const { data } = useNewsById(id);
  return data ? <NewsListItem news={data} /> : <NewsListItemLoading />;
};

export enum LanguageTypes {
  EXPANDLIST = 'language-expandlist',
  EXPAND = 'language-expand',
  EVENT = 'language-event',
  JOBPOST = 'language-jobpost',
  NEWS = 'language-news',
}

export type CodeBlockProps = {
  inline?: boolean;
  className?: LanguageTypes | string;
  children: ReactNode; // Endret fra string[] til ReactNode
};

export const CodeBlock = ({ inline = false, className: language, children }: CodeBlockProps) => {
  const value = typeof children === 'string' ? children : String(children);
  console.log('CHILDREN: ', value);
  console.log('LANGUAGE: ', language);
  if (inline) {
    return <code className='bg-card p-1 rounded-md'>{value}</code>;
  } else if (language === LanguageTypes.EXPANDLIST) {
    return (
      <div className='mb-2'>
        <ReactMarkdown components={components}>{value}</ReactMarkdown>
      </div>
    );
  } else if (language === LanguageTypes.EXPAND) {
    const header = value.split('::')[0] || '';
    const val = value.split('::')[1] || '';
    return (
      <Expandable title={header}>
        <ReactMarkdown components={components}>{val}</ReactMarkdown>
      </Expandable>
    );
  } else if (language === LanguageTypes.EVENT || language === LanguageTypes.JOBPOST || language === LanguageTypes.NEWS) {
    const id = Number(value);
    if (!Number.isInteger(id)) {
      return null;
    } else if (language === LanguageTypes.EVENT) {
      return <EventCard id={id} />;
    } else if (language === LanguageTypes.JOBPOST) {
      return <JobPostCard id={id} />;
    } else if (language === LanguageTypes.NEWS) {
      return <NewsCard id={id} />;
    }
  }
  return <pre className='bg-card rounded-md p-2 overflow-x-auto'>{value}</pre>;
};

const components: any = {
  blockquote: ({ children }: { children: ReactNode[] }) => <blockquote className='p-2 pl-4 ml-4 my-2 border-l-4 border-l-primary'>{children}</blockquote>,
  code: CodeBlock,
  pre: ({ children }: { children: ReactNode[] }) => children,
  h1: ({ children }: { children: ReactNode[] }) => <h1 className='text-3xl font-bold'>{children}</h1>,
  h2: ({ children }: { children: ReactNode[] }) => <h1 className='text-2xl font-bold'>{children}</h1>,
  h3: ({ children }: { children: ReactNode[] }) => <h1 className='text-2xl font-bold'>{children}</h1>,
  ol: ({ children }: { children: ReactNode[]; ordered: boolean }) => <ol className='ml-2 list-inside list-decimal'>{children}</ol>,
  ul: ({ children }: { children: ReactNode[]; ordered: boolean }) => <ul className='ml-2 list-inside list-disc'>{children}</ul>,
  li: ({ children, checked }: { children: ReactNode[]; checked: boolean }) =>
    createElement('li', {}, checked ? createElement('input', { type: 'checkbox', checked, readOnly: true }) : null, children),
  p: ({ children }: { children: ReactNode[] }) => <p>{children}</p>,
  a: ({ children, href }: { children: ReactNode[]; href: string }) => (
    <a className='underline text-blue-500 dark:text-indigo-300' href={href}>
      {children}
    </a>
  ),
  hr: () => <Separator className='my-2' />,
  img: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} className='object-contain max-w-full h-auto rounded-md' loading='lazy' src={src} />,
};

export type MarkdownRendererProps = {
  value?: string;
  className?: string;
};

const MarkdownRenderer = ({ value, className }: MarkdownRendererProps) => {
  const skeletonWidthArray = useMemo(() => Array.from({ length: (value?.length || 100) / 90 + 1 }).map(() => 50 + 40 * Math.random()), [value]);

  return (
    <Suspense
      fallback={
        <div className='space-y-2'>
          {skeletonWidthArray.map((width, index) => (
            <Skeleton className={`h-[38px] w-[${width}%]`} key={index} />
          ))}
        </div>
      }>
      <ReactMarkdown
        className={className}
        components={components}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins={[rehypeRaw] as any}>
        {value || ''}
      </ReactMarkdown>
    </Suspense>
  );
};

export default MarkdownRenderer;
