import { Divider, Skeleton, styled, Typography } from '@mui/material';
import { createElement, lazy, ReactNode, Suspense, useMemo } from 'react';

import { Event, JobPost, News } from 'types';

import { useEventById } from 'hooks/Event';
import { useJobPostById } from 'hooks/JobPost';
import { useNewsById } from 'hooks/News';

import Expand from 'components/layout/Expand';
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import JobPostListItem, { JobPostListItemLoading } from 'components/miscellaneous/JobPostListItem';
import Linkify from 'components/miscellaneous/Linkify';
import NewsListItem, { NewsListItemLoading } from 'components/miscellaneous/NewsListItem';

const ReactMarkdown = lazy(() => import('react-markdown'));

export const Ol = styled('ol')(({ theme }) => ({
  listStylePosition: 'inside',
  marginLeft: theme.spacing(1),
}));
export const Ul = styled('ul')(({ theme }) => ({
  listStylePosition: 'inside',
  marginLeft: theme.spacing(1),
}));
export const Li = styled('li')(({ theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  wordBreak: 'break-word',
}));

export const InlineCode = styled('code')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.action.selected,
}));

export const Heading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
}));

export const ExpandList = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const Pre = styled('pre')(({ theme }) => ({
  color: theme.palette.text.primary,
  background: theme.palette.action.selected,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  overflowX: 'auto',
}));

export const Blockquote = styled('blockquote')(({ theme }) => ({
  margin: theme.spacing(0, 2, 1),
  padding: theme.spacing(2, 3, 1),
  borderLeft: `${theme.spacing(1)} solid ${theme.palette.primary.main}`,
}));

export const Image = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  objectFit: 'contain',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
}));

export const EventCard = ({ id }: { id: Event['id'] }) => {
  const { data } = useEventById(id);
  return data ? <EventListItem event={data} sx={{ mb: 1 }} /> : <EventListItemLoading sx={{ mb: 1 }} />;
};
export const JobPostCard = ({ id }: { id: JobPost['id'] }) => {
  const { data } = useJobPostById(id);
  return data ? <JobPostListItem jobPost={data} sx={{ mb: 1 }} /> : <JobPostListItemLoading sx={{ mb: 1 }} />;
};
export const NewsCard = ({ id }: { id: News['id'] }) => {
  const { data } = useNewsById(id);
  return data ? <NewsListItem news={data} sx={{ mb: 1 }} /> : <NewsListItemLoading sx={{ mb: 1 }} />;
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
  children: string[];
};

export const CodeBlock = ({ inline = false, className: language, children }: CodeBlockProps) => {
  const value = children[0];
  if (inline) {
    return <InlineCode>{value}</InlineCode>;
  } else if (language === LanguageTypes.EXPANDLIST) {
    return (
      <ExpandList>
        <ReactMarkdown components={components}>{value}</ReactMarkdown>
      </ExpandList>
    );
  } else if (language === LanguageTypes.EXPAND) {
    const header = value.split('::')[0] || '';
    const val = value.split('::')[1] || '';
    return (
      <Expand flat header={header}>
        <ReactMarkdown components={components}>{val}</ReactMarkdown>
      </Expand>
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
  return <Pre>{value}</Pre>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: any = {
  blockquote: ({ children }: { children: ReactNode[] }) => <Blockquote>{children}</Blockquote>,
  code: CodeBlock,
  pre: ({ children }: { children: ReactNode[] }) => children,
  h1: ({ children }: { children: ReactNode[] }) => <Heading variant='h2'>{children}</Heading>,
  h2: ({ children }: { children: ReactNode[] }) => <Heading variant='h3'>{children}</Heading>,
  h3: ({ children }: { children: ReactNode[] }) => <Heading variant='h3'>{children}</Heading>,
  ol: ({ children }: { children: ReactNode[]; ordered: boolean }) => <Ol>{children}</Ol>,
  ul: ({ children }: { children: ReactNode[]; ordered: boolean }) => <Ul>{children}</Ul>,
  li: ({ children, checked }: { children: ReactNode[]; checked: boolean }) =>
    createElement(Li, {}, checked ? createElement('input', { type: 'checkbox', checked, readOnly: true }) : null, children),
  p: ({ children }: { children: ReactNode[] }) => (
    <Linkify>
      <Heading variant='body1'>{children}</Heading>
    </Linkify>
  ),
  hr: () => <Divider sx={{ my: 1 }} />,
  img: ({ alt, src }: { alt: string; src: string }) => <Image alt={alt} loading='lazy' src={src} />,
};

export type MarkdownRendererProps = {
  value?: string;
};

const MarkdownRenderer = ({ value }: MarkdownRendererProps) => {
  const skeletonWidthArray = useMemo(() => Array.from({ length: (value?.length || 100) / 90 + 1 }).map(() => 50 + 40 * Math.random()), [value]);

  return (
    <Suspense
      fallback={
        <>
          {skeletonWidthArray.map((width, index) => (
            <Skeleton height={38} key={index} width={`${width}%`} />
          ))}
        </>
      }>
      <ReactMarkdown components={components}>{value || ''}</ReactMarkdown>
    </Suspense>
  );
};

export default MarkdownRenderer;
