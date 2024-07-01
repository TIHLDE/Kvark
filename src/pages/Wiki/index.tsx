import { Stack, styled, Typography } from '@mui/material';
import { Slash } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import URLS, { WIKI_URLS } from 'URLS';

import { WikiPage } from 'types';

import { useGroups } from 'hooks/Group';
import { useWikiPage } from 'hooks/Wiki';

import GroupItem from 'pages/Groups/overview/GroupItem';
import WikiAdmin from 'pages/Wiki/components/WikiAdmin';
import WikiNavigator from 'pages/Wiki/components/WikiNavigator';
import Index from 'pages/Wiki/specials/Index';

import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import ShareButton from 'components/miscellaneous/ShareButton';
import Page from 'components/navigation/Page';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from 'components/ui/breadcrumb';
import { Card, CardContent } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';

import WikiSearch from './components/WikiSearch';

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
  const { data: groups = [] } = useGroups();
  const group = useMemo(() => groups.find((group) => group.slug === levels[levels.length - 1]), [levels, groups]);

  useEffect(() => {
    if (data && location.pathname !== data.path) {
      navigate(`${URLS.wiki}${data.path}`, { replace: true });
    }
  }, [navigate, location.pathname, data]);

  return (
    <Page>
      <div className='space-y-4 md:space-y-0 md:flex md:items-center md:justify-between pb-12'>
        <div className='space-y-2'>
          <h1 className='text-4xl md:text-5xl font-bold'>TIHLDE Wiki</h1>
          <p className='md:text-lg text-muted-foreground'>Her finner du all tilgjengelig informasjon om TIHLDE.</p>
        </div>

        <WikiSearch />
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          {levels.slice(0, levels.length - 1).map((level, index) => (
            <>
              <BreadcrumbItem key={index}>
                <BreadcrumbLink asChild>
                  <Link to={`/${levels.slice(0, index + 1).join('/')}`}>{level.replace(/-/gi, ' ')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            </>
          ))}
          <BreadcrumbItem>{data?.title.toLowerCase()}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid gap-6 lg:grid-cols-[.4fr_1fr]'>
        <div className='space-y-2'>
          <WikiNavigator />
          {data && (
            <>
              <ShareButton shareId={data.path} shareType='pages' title={data.title} />
              <WikiAdmin page={data} />
            </>
          )}
        </div>
        {isLoading ? (
          <Card className='h-[60vh]'>
            <CardContent className='p-4 space-y-6'>
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-44' />
              <div className='w-full flex items-center space-x-6'>
                <Skeleton className='w-full h-20' />
                <Skeleton className='w-full h-20' />
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className='h-[60vh]'>
            <CardContent className='p-4 flex items-center justify-center h-full'>
              <h1 className='text-xl font-bold'>{error.detail}</h1>
            </CardContent>
          </Card>
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
      </div>
    </Page>
  );
};

export default Wiki;
