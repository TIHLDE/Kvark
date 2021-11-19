import parseISO from 'date-fns/parseISO';
import { formatDate } from 'utils';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { usePalette } from 'react-palette';
import { News } from 'types';
import { PermissionApp } from 'types/Enums';
import { HavePermission } from 'hooks/User';
import { Typography, Button, Skeleton, Stack, styled } from '@mui/material';

// Project Components
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import Paper from 'components/layout/Paper';
import Container from 'components/layout/Container';
import ShareButton from 'components/miscellaneous/ShareButton';

const TopContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'bgColor' })<{ bgColor?: React.CSSProperties['backgroundColor'] }>(
  ({ theme, bgColor }) => ({
    color: theme.palette.common.white,
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(20),
    background: `linear-gradient(${bgColor || theme.palette.colors.gradient.main.top} 40%, transparent)`,
    transition: 'background 1s',
    [theme.breakpoints.down('lg')]: {
      paddingBottom: theme.spacing(15),
    },
  }),
);

export type NewsRendererProps = {
  data: News;
  preview?: boolean;
};
const NewsRenderer = ({ data, preview = false }: NewsRendererProps) => {
  // Find a dominant color in the image, uses a proxy to be able to retrieve images with CORS-policy until all images are stored in our own server
  const { data: palette } = usePalette(
    data?.image
      ? `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(data.image || '')}`
      : '',
  );

  return (
    <div>
      <TopContainer bgColor={palette.muted}>
        <Container maxWidth='lg' sx={{ px: { xs: 3, md: 5 } }}>
          <Typography sx={{ py: 1, wordWrap: 'break-word', fontSize: (theme) => ({ xs: '2.3rem', lg: theme.typography.h1.fontSize }) }} variant='h1'>
            {data.title}
          </Typography>
          <Typography gutterBottom variant='h3'>
            {data.header}
          </Typography>
        </Container>
      </TopContainer>
      <Container maxWidth='lg' sx={{ mt: { xs: -13, lg: -18 } }}>
        <Stack gap={1}>
          <AspectRatioImg alt={data.image_alt || data.title} src={data.image} sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px` }} />
          {!preview && (
            <HavePermission apps={[PermissionApp.NEWS]}>
              <Button component={Link} fullWidth to={`${URLS.newsAdmin}${data.id}/`} variant='outlined'>
                Endre nyhet
              </Button>
            </HavePermission>
          )}
          <Stack alignItems='center' direction='row' justifyContent='space-between'>
            <Typography variant='body2'>Publisert: {formatDate(parseISO(data.created_at), { time: false })}</Typography>
            <ShareButton shareId={data.id} shareType='news' title={data.title} />
          </Stack>
          <Paper>
            <MarkdownRenderer value={data.body} />
          </Paper>
        </Stack>
      </Container>
    </div>
  );
};

export default NewsRenderer;

export const NewsRendererLoading = () => (
  <div>
    <TopContainer>
      <Container maxWidth='lg' sx={{ px: { xs: 3, md: 5 } }}>
        <Skeleton height={80} width='60%' />
        <Skeleton height={40} width={250} />
      </Container>
    </TopContainer>
    <Container maxWidth='lg' sx={{ mt: { xs: -13, lg: -18 } }}>
      <Stack gap={1}>
        <AspectRatioLoading sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px` }} />
        <Skeleton height={40} width={250} />
        <Paper>
          <Skeleton width='80%' />
          <Skeleton width='85%' />
          <Skeleton width='75%' />
          <Skeleton width='90%' />
        </Paper>
      </Stack>
    </Container>
  </div>
);
