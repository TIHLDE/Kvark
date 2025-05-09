import API from '~/api/api';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useIsAuthenticated } from '~/hooks/User';
import GroupItem from '~/pages/Groups/overview/GroupItem';
import type { GroupList } from '~/types';
import { GroupType } from '~/types/Enums';
import URLS from '~/URLS';
import React from 'react';
import { Link } from 'react-router';

import type { Route } from './+types/index';

async function getGroupsOverview() {
  const groups = await API.getGroups({ overview: true });

  const BOARD_GROUPS = groups.filter((group) => group.type === GroupType.BOARD) ?? [];
  const SUB_GROUPS = groups.filter((group) => group.type === GroupType.SUBGROUP) ?? [];
  const COMMITTEES = groups.filter((group) => group.type === GroupType.COMMITTEE) ?? [];
  const OTHER_GROUPS =
    groups.filter((group) => [GroupType.BOARD, GroupType.SUBGROUP, GroupType.COMMITTEE, GroupType.INTERESTGROUP].every((t) => group.type !== t)) ?? [];

  return {
    BOARD_GROUPS,
    SUB_GROUPS,
    COMMITTEES,
    OTHER_GROUPS,
  };
}

let OverviewCache: { expire: Date; data: Awaited<ReturnType<typeof getGroupsOverview>> } | undefined;

export async function clientLoader() {
  if (OverviewCache && OverviewCache.expire > new Date()) {
    return Promise.resolve(OverviewCache.data);
  }

  const groups = await getGroupsOverview();
  OverviewCache = { expire: new Date(Date.now() + 60 * 1000 * 60), data: groups };

  return groups;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <h1 className='text-center text-muted-foreground mt-4'>{(error as { detail: string }).detail}</h1>;
}

export default function GripsOverview({ loaderData }: Route.ComponentProps) {
  const isAuthenticated = useIsAuthenticated();
  return (
    <LocalLayout>
      <Overview groups={loaderData} isAuthenticated={isAuthenticated} />
    </LocalLayout>
  );
}

function Overview({ isAuthenticated, groups }: { isAuthenticated: boolean; groups: Awaited<ReturnType<typeof getGroupsOverview>> }) {
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, OTHER_GROUPS } = groups;
  type CollectionProps = {
    groups: Array<GroupList>;
    title: string;
  };

  const Collection = ({ groups, title }: CollectionProps) => (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>{title}</h1>
      <div className='grid md:grid-cols-2 gap-4'>
        {groups.map((group, index) => (
          <GroupItem group={group} key={index} />
        ))}
      </div>
    </div>
  );
  return (
    <>
      {Boolean(BOARD_GROUPS.length) && <Collection groups={BOARD_GROUPS} title='Hovedorgan' />}
      {Boolean(SUB_GROUPS.length) && <Collection groups={SUB_GROUPS} title='Undergrupper' />}
      {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komitéer' />}
      {isAuthenticated && Boolean(OTHER_GROUPS.length) && <Collection groups={OTHER_GROUPS} title='Andre grupper' />}
    </>
  );
}

function LocalLayout({ children }: React.PropsWithChildren) {
  return (
    <Page className='max-w-6xl mx-auto'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Gruppeoversikt</CardTitle>
          <Button asChild>
            <Link to={URLS.groups.interest}>Interessegrupper</Link>
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>{children}</CardContent>
      </Card>
    </Page>
  );
}
