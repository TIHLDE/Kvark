import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import URLS, { WIKI_URLS } from 'URLS';
import { useWikiPage } from 'hooks/Wiki';
import { useGroup } from 'hooks/Group';
import { WikiPage } from 'types';
import { Groups } from 'types/Enums';
import { Typography, Breadcrumbs, Skeleton, Stack, styled } from '@mui/material';

// Project Components
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import GroupItem from 'pages/Groups/overview/GroupItem';
import WikiAdmin from 'pages/Wiki/components/WikiAdmin';
import WikiNavigator from 'pages/Wiki/components/WikiNavigator';
import WikiSearch from 'pages/Wiki/components/WikiSearch';
import ShareButton from 'components/miscellaneous/ShareButton';
import Index from 'pages/Wiki/specials/Index';

const Root = styled('div')(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spacing(2),
  gridTemplateColumns: '300px 1fr',
  margin: theme.spacing(1, 0, 2),
  alignItems: 'self-start',
  [theme.breakpoints.down('lg')]: {
    gridGap: theme.spacing(1),
    gridTemplateColumns: '1fr',
  },
}));

const Content = styled('div', { shouldForwardProp: (prop) => prop !== 'data' })<{ data?: WikiPage }>(({ theme, data }) => ({
  display: 'grid',
  gridGap: theme.spacing(2),
  gridTemplateColumns: data?.image ? '1fr 350px' : '1fr',
  alignItems: 'self-start',
  [theme.breakpoints.down('xl')]: {
    gridTemplateColumns: '1fr',
  },
  [theme.breakpoints.down('lg')]: {
    gridGap: theme.spacing(1),
  },
}));

const Image = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: 350,
  objectFit: 'cover',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const Wiki = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const levels = useMemo(() => location.pathname.split('/').filter((x) => x.trim() !== ''), [location.pathname]);
  const path = useMemo(() => (levels.slice(1).length ? `${levels.slice(1).join('/')}/` : ''), [levels]);
  const { data, error, isLoading } = useWikiPage(path);

  const possibleGroupSlug = useMemo(() => {
    const lastElementInLevels = levels.slice(-1)[0];
    return Object.values(Groups)
      .map((group) => (group as string).toLowerCase())
      .includes(lastElementInLevels)
      ? lastElementInLevels
      : null;
  }, [levels]);

  const { data: group } = useGroup(possibleGroupSlug || '-', { enabled: Boolean(possibleGroupSlug) });

  useEffect(() => {
    if (data && location.pathname !== data.path) {
      navigate(`${URLS.wiki}${data.path}`, { replace: true });
    }
  }, [navigate, location.pathname, data]);

  return (
    <Page
      banner={
        <Banner title={isLoading ? <Skeleton width={300} /> : error ? 'Noe gikk galt' : data?.title}>
          <WikiSearch />
        </Banner>
      }
      options={{ title: data ? data.title : 'Laster side...' }}>
      <Breadcrumbs aria-label='Posisjon i wiki' maxItems={4}>
        {levels.slice(0, levels.length - 1).map((level, i) => (
          <Typography component={Link} key={i} sx={{ textDecoration: 'none', textTransform: 'capitalize' }} to={`/${levels.slice(0, i + 1).join('/')}`}>
            {level.replace(/-/gi, ' ')}
          </Typography>
        ))}
        <Typography>{data?.title}</Typography>
      </Breadcrumbs>
      <Root>
        <Stack gap={1}>
          <WikiNavigator />
          {data && (
            <>
              <ShareButton fullWidth shareId={data.path} shareType='pages' title={data.title} />
              <WikiAdmin page={data} />
            </>
          )}
        </Stack>
        {isLoading ? (
          <Paper>
            <Skeleton height={50} variant='text' width='40%' />
            <Skeleton height={30} variant='text' />
            <Skeleton height={30} variant='text' />
          </Paper>
        ) : error ? (
          <Paper>
            <Typography>{error.detail}</Typography>
          </Paper>
        ) : (
          data !== undefined && (
            <Content data={data}>
              <Stack gap={{ xs: 1, lg: 2 }}>
                {Boolean(data.content.trim().length) && (
                  <Paper>
                    <MarkdownRenderer value={data.content} />
                  </Paper>
                )}
                {path === WIKI_URLS.ABOUT_INDEX && <Index />}
                {group && <GroupItem group={group} />}
              </Stack>
              {data.image && <Image alt={data.image_alt || data.title} loading='lazy' src={data.image} />}
            </Content>
          )
        )}
      </Root>
    </Page>
  );
};

export default Wiki;
