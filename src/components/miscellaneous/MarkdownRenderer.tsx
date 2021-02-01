/* eslint-disable react/display-name */
import { createElement, useMemo, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { useEventById } from 'api/hooks/Event';
import { useJobPostById } from 'api/hooks/JobPost';
import { useNewsById } from 'api/hooks/News';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// Project components
import Expansion from 'components/layout/Expand';
import ListItem from 'components/miscellaneous/ListItem';

const useStyles = makeStyles((theme) => ({
  blockquote: {
    margin: theme.spacing(0, 2, 1),
    padding: theme.spacing(2, 3, 1),
    borderLeft: `${theme.spacing(1)}px solid ${theme.palette.primary.main}`,
  },
  code: {
    color: theme.palette.text.primary,
    background: theme.palette.action.selected,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    overflowX: 'auto',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  inlineCode: {
    padding: theme.spacing(0.5, 1),
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.action.selected,
  },
  list: {
    listStylePosition: 'inside',
    marginLeft: theme.spacing(2),
  },
  content: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    overflowWrap: 'break-word',
  },
  expansion: {
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.smoke,
  },
}));

export type MarkdownRendererProps = {
  value: string;
};

const MarkdownRenderer = ({ value }: MarkdownRendererProps) => {
  const classes = useStyles();

  type ComponentProps = {
    id: number;
  };

  const Event = ({ id }: ComponentProps) => {
    const [data] = useEventById(id);
    return data ? <ListItem className={classes.content} event={data} largeImg /> : null; // TODO: Use ListItemLoading
  };
  const JobPost = ({ id }: ComponentProps) => {
    const [data] = useJobPostById(id);
    return data ? <ListItem className={classes.content} jobpost={data} largeImg /> : null; // TODO: Use ListItemLoading
  };
  const News = ({ id }: ComponentProps) => {
    const [data] = useNewsById(id);
    return data ? <ListItem className={classes.content} largeImg news={data} /> : null; // TODO: Use ListItemLoading
  };

  enum LanguageTypes {
    EXPANDLIST = 'expandlist',
    EXPAND = 'expand',
    EVENT = 'event',
    JOBPOST = 'jobpost',
    NEWS = 'news',
  }

  type CodeBlockProps = {
    language: LanguageTypes | string;
    value: string;
  };
  const CodeBlock = ({ language, value }: CodeBlockProps) => {
    if (language === LanguageTypes.EXPANDLIST) {
      return (
        <div className={classes.content}>
          <ReactMarkdown renderers={renderers}>{value}</ReactMarkdown>
        </div>
      );
    } else if (language === LanguageTypes.EXPAND) {
      const header = value.split('::')[0] || '';
      const children = value.split('::')[1] || '';
      return (
        <Expansion className={classes.expansion} flat header={header}>
          <ReactMarkdown renderers={renderers}>{children}</ReactMarkdown>
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
    return createElement('pre', { className: classes.code }, createElement('code', {}, value));
  };

  const renderers = useMemo(
    () => ({
      blockquote: ({ children }: { children: ReactNode[] }) => createElement('blockquote', { className: classes.blockquote }, children),
      code: CodeBlock,
      heading: ({ level, children }: { level: number; children: ReactNode[] }) =>
        createElement(Typography, { variant: level === 1 ? 'h2' : 'h3', className: classes.content }, children),
      inlineCode: ({ value }: { value: string }) => createElement('code', { className: classes.inlineCode }, value),
      list: ({ children, ordered }: { children: ReactNode[]; ordered: boolean }) => createElement(ordered ? 'ol' : 'ul', { className: classes.list }, children),
      paragraph: ({ children }: { children: ReactNode[] }) => createElement(Typography, { variant: 'body1', className: classes.content }, children),
      thematicBreak: () => <Divider className={classes.divider} />,
    }),
    [],
  );

  return <ReactMarkdown renderers={renderers}>{value}</ReactMarkdown>;
};

export default MarkdownRenderer;
