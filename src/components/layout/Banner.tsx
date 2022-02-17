import { alpha, Box, Button, Stack, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';

import Container from 'components/layout/Container';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';

export const BannerButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  borderColor: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  '&:hover': {
    borderColor: alpha(theme.palette.getContrastText(theme.palette.colors.gradient.main.top), 0.8),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  fontSize: theme.typography.pxToRem(66),
  [theme.breakpoints.down('lg')]: {
    fontSize: theme.typography.pxToRem(50),
    padding: theme.spacing(0, 2),
    overflowWrap: 'break-word',
    '@supports not (overflow-wrap: anywhere)': {
      hyphens: 'auto',
    },
  },
  [theme.breakpoints.down('md')]: {
    fontSize: theme.typography.pxToRem(40),
  },
}));

const Text = styled('div')(({ theme }) => ({
  '& p,a': {
    color: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  },
  paddingTop: theme.spacing(2),
  maxWidth: 600,
  width: '50vw',
  [theme.breakpoints.down('lg')]: {
    fontSize: 16,
    padding: theme.spacing(2, 2, 0),
    width: '100%',
  },
}));

const Line = styled('div')(({ theme }) => ({
  height: 4,
  backgroundColor: theme.palette.getContrastText(theme.palette.colors.gradient.main.top),
  borderRadius: theme.shape.borderRadius,
  width: 90,
  [theme.breakpoints.down('lg')]: {
    width: 50,
  },
}));

const Content = styled('div')(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spacing(1),
  minWidth: 350,
  height: 'fit-content',
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    minWidth: 200,
    padding: theme.spacing(0, 2),
  },
}));

const Svg = styled('svg')(() => ({
  marginTop: -1,
  display: 'block',
}));

const SvgPath = styled('path')(({ theme }) => ({
  fill: theme.palette.colors.gradient.main.top,
  fillOpacity: 1,
}));

export type BannerProps = {
  title?: string | ReactNode;
  text?: string;
  children?: ReactNode;
  background?: string;
};

const Banner = ({ title, text, children }: BannerProps) => (
  <Box sx={{ pb: 1, whiteSpace: 'break-spaces', position: 'relative', width: '100%', overflow: 'hidden' }}>
    <Box sx={{ background: (theme) => theme.palette.colors.gradient.main.top, pt: { xs: 8, lg: 10 }, pb: 0.25 }}>
      <Container maxWidth='xl'>
        <Stack direction={{ xs: 'column', lg: 'row' }} gap={2} justifyContent='space-between' sx={{ pb: { xs: 1, lg: 0 } }}>
          <div>
            {title && (
              <Title variant='h1'>
                {title}
                <Line />
              </Title>
            )}
            {text && Boolean(text.trim().length) && (
              <Text>
                <MarkdownRenderer value={text} />
              </Text>
            )}
          </div>
          {children && <Content>{children}</Content>}
        </Stack>
      </Container>
    </Box>
    <Svg viewBox='0 20 500 15' xmlns='http://www.w3.org/2000/svg'>
      <SvgPath d='M 0 25 C 251 52 268 10 500 25 L 500 0 L 0 0 Z' />
    </Svg>
  </Box>
);

export default Banner;
