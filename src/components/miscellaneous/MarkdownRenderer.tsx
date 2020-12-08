/* eslint-disable react/display-name */
import React, { createElement } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// External Imports
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles((theme) => ({
  blockquote: {
    margin: theme.spacing(0, 2, 1),
    padding: theme.spacing(2, 3, 1),
    borderLeft: `${theme.spacing(1)}px solid ${theme.palette.colors.tihlde.main}`,
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
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}));

export type MarkdownRendererProps = {
  value: string;
};

function MarkdownRenderer({ value }: MarkdownRendererProps) {
  const classes = useStyles();
  const getHeadingLevel = (level: number) => {
    switch (level) {
      case 1:
        return 'h2';
      default:
        return 'h3';
    }
  };
  const renderers = {
    blockquote: (props: { level: number; children: React.ReactNode[] }) => createElement('blockquote', { className: classes.blockquote }, props.children),
    code: (props: { value: string }) => createElement('pre', { className: classes.code }, createElement('code', {}, props.value)),
    heading: (props: { level: number; children: React.ReactNode[] }) =>
      createElement(Typography, { variant: getHeadingLevel(props.level), className: classes.text }, props.children),
    inlineCode: (props: { value: string }) => createElement('code', { className: classes.inlineCode }, props.value),
    list: (props: { children: React.ReactNode[]; ordered: boolean }) => createElement(props.ordered ? 'ol' : 'ul', { className: classes.list }, props.children),
    paragraph: (props: { children: React.ReactNode[] }) => createElement(Typography, { variant: 'body1', className: classes.text }, props.children),
    thematicBreak: () => <Divider className={classes.divider} />,
  };

  return <ReactMarkdown renderers={renderers}>{value}</ReactMarkdown>;
}

export default MarkdownRenderer;
