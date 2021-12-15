/* eslint-disable react/display-name */
import { createElement, useMemo, ReactNode, lazy, Suspense } from 'react';
import { useEventById } from 'hooks/Event';
import { useJobPostById } from 'hooks/JobPost';
import { useNewsById } from 'hooks/News';

// Material UI
import { styled, Divider, Typography, Skeleton } from '@mui/material';

// Project components
import Expand from 'components/layout/Expand';
import JobPostListItem, { JobPostListItemLoading } from 'components/miscellaneous/JobPostListItem';
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import NewsListItem, { NewsListItemLoading } from 'components/miscellaneous/NewsListItem';
import Linkify from 'components/miscellaneous/Linkify';

const ReactMarkdown = lazy(() => import('react-markdown'));

const Ol = styled('ol')(({ theme }) => ({
  listStylePosition: 'inside',
  marginLeft: theme.spacing(1),
}));
const Ul = styled('ul')(({ theme }) => ({
  listStylePosition: 'inside',
  marginLeft: theme.spacing(1),
}));
const Li = styled('li')(({ theme }) => ({
  fontSize: theme.typography.body1.fontSize,
  wordBreak: 'break-word',
}));

const InlineCode = styled('code')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.action.selected,
}));

const Expansion = styled(Expand)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const Heading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  '@supports not (overflow-wrap: anywhere)': {
    hyphens: 'auto',
  },
}));

const ExpandList = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const Pre = styled('pre')(({ theme }) => ({
  color: theme.palette.text.primary,
  background: theme.palette.action.selected,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  overflowX: 'auto',
}));

const Blockquote = styled('blockquote')(({ theme }) => ({
  margin: theme.spacing(0, 2, 1),
  padding: theme.spacing(2, 3, 1),
  borderLeft: `${theme.spacing(1)} solid ${theme.palette.primary.main}`,
}));

const Image = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  objectFit: 'contain',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
}));

export type MarkdownRendererProps = {
  value?: string;
};

const MarkdownRenderer = ({ value }: MarkdownRendererProps) => {
  type ComponentProps = {
    id: number;
  };

  const Event = ({ id }: ComponentProps) => {
    const { data } = useEventById(id);
    return data ? <EventListItem event={data} sx={{ mb: 1 }} /> : <EventListItemLoading sx={{ mb: 1 }} />;
  };
  const JobPost = ({ id }: ComponentProps) => {
    const { data } = useJobPostById(id);
    return data ? <JobPostListItem jobpost={data} sx={{ mb: 1 }} /> : <JobPostListItemLoading sx={{ mb: 1 }} />;
  };
  const News = ({ id }: ComponentProps) => {
    const { data } = useNewsById(id);
    return data ? <NewsListItem news={data} sx={{ mb: 1 }} /> : <NewsListItemLoading sx={{ mb: 1 }} />;
  };

  enum LanguageTypes {
    EXPANDLIST = 'language-expandlist',
    EXPAND = 'language-expand',
    EVENT = 'language-event',
    JOBPOST = 'language-jobpost',
    NEWS = 'language-news',
  }

  type CodeBlockProps = {
    inline: boolean;
    className: LanguageTypes | string;
    children: string[];
  };
  const CodeBlock = ({ inline, className: language, children }: CodeBlockProps) => {
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
        <Expansion flat header={header}>
          <ReactMarkdown components={components}>{val}</ReactMarkdown>
        </Expansion>
      );
    } else if (language === LanguageTypes.EVENT || language === LanguageTypes.JOBPOST || language === LanguageTypes.NEWS) {
      const id = Number(value);
      if (!Number.isInteger(id)) {
        return null;
      } else if (language === LanguageTypes.EVENT) {
        return <Event id={id} />;
      } else if (language === LanguageTypes.JOBPOST) {
        return <JobPost id={id} />;
      } else if (language === LanguageTypes.NEWS) {
        return <News id={id} />;
      }
    }
    return (
      <Pre>
        <code>{value}</code>
      </Pre>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const components = useMemo<any>(
    () => ({
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
    }),
    [],
  );
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
