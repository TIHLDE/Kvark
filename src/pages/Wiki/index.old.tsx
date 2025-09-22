import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import ShareButton from '~/components/miscellaneous/ShareButton';
import Page from '~/components/navigation/Page';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { useGroups } from '~/hooks/Group';
import { useWikiPage } from '~/hooks/Wiki';
import { cn } from '~/lib/utils';
import GroupItem from '~/pages/Groups/overview/GroupItem';
import WikiAdmin from '~/pages/Wiki/components/WikiAdmin';
import WikiNavigator from '~/pages/Wiki/components/WikiNavigator';
import Index from '~/pages/Wiki/specials/Index';
import { Slash } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router';

import WikiSearch from './components/WikiSearch';

const Wiki = () => {
  const location = useLocation();
  const levels = useMemo(() => location.pathname.split('/').filter((x) => x.trim() !== ''), [location.pathname]);
  const path = useMemo(() => (levels.slice(1).length ? `${levels.slice(1).join('/')}/` : ''), [levels]);
  const { data, error, isLoading } = useWikiPage(path);
  const { data: groups = [] } = useGroups();
  const group = useMemo(() => groups.find((group) => group.slug === levels[levels.length - 1]), [levels, groups]);

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
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/${levels.slice(0, index + 1).join('/')}`}>{level.replace(/-/gi, ' ')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            </React.Fragment>
          ))}
          <BreadcrumbItem>{data?.title.toLowerCase()}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='grid gap-6 lg:grid-cols-[.4fr_1fr] items-start mt-2'>
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
            <div className={cn('grid gap-4', data.image && 'lg:grid-cols[1fr,350px]')}>
              {Boolean(data.content.trim().length) && (
                <div className='p-4 rounded-md border bg-card'>
                  <MarkdownRenderer value={data.content} />
                </div>
              )}
              {path === 'tihlde/undergrupper/index' && <Index />}
              {group && <GroupItem group={group} />}
              {data.image && (
                <img alt={data.image_alt || data.title} className='w-full max-h-[350px] object-cover rounded-md' loading='lazy' src={data.image} />
              )}
            </div>
          )
        )}
      </div>
    </Page>
  );
};

export default Wiki;
