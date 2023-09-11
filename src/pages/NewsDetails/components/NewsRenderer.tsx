import { Button, Skeleton, Stack, styled, Typography } from '@mui/material';
import parseISO from 'date-fns/parseISO';
import { usePalette } from 'react-palette';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { News } from 'types';
import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';

import Container from 'components/layout/Container';
import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import ShareButton from 'components/miscellaneous/ShareButton';

const TopContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'bgColor' })<{ bgColor?: React.CSSProperties['backgroundColor'] }>(
  ({ theme, bgColor }) => ({
    color: theme.palette.common.white,
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(20),
    background: bgColor || theme.palette.colors.gradient.main.top,
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
  const { data: palette } = usePalette(data?.image || '');

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
          <AspectRatioImg alt={data.image_alt || data.title} borderRadius src={data.image} />
          {!preview && (
            <HavePermission apps={[PermissionApp.NEWS]}>
              <Button component={Link} fullWidth to={`${URLS.newsAdmin}${data.id}/`} variant='outlined'>
                Endre nyhet
              </Button>
            </HavePermission>
          )}
          <Stack alignItems='center' direction='row' justifyContent='space-between'>
            <Typography variant='body2'>
              Publisert: {formatDate(parseISO(data.created_at), { time: false })}
              {data.creator && (
                <>
                  <br />
                  Forfatter:{' '}
                  <Link to={`${URLS.profile}${data.creator.user_id}/`}>
                    {data.creator.first_name} {data.creator.last_name}
                  </Link>
                </>
              )}
            </Typography>
          </Stack>
          <Paper>
            <MarkdownRenderer value={data.body} />
          </Paper>
        </Stack>
        <Stack alignItems='flex-end' sx={{ marginTop: 2 }}>
            <ShareButton shareId={data.id} shareType='news' title={data.title} />
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
        <AspectRatioLoading borderRadius />
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
