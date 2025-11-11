import { createFileRoute, Link } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { getGroupsQueryOptions } from '~/hooks/Group';
import { getQueryClient } from '~/integrations/tanstack-query';
import GroupItem from '~/pages/Groups/overview/GroupItem';
import type { GroupList } from '~/types';
import { GroupType } from '~/types/Enums';
import URLS from '~/URLS';
import React from 'react';

function getGroupsOverview(groups: GroupList[]) {
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

export const Route = createFileRoute('/_MainLayout/grupper/')({
  async loader() {
    const groups = await getQueryClient().ensureQueryData(getGroupsQueryOptions());
    return getGroupsOverview(groups);
  },
  component: GroupsOverview,
});

function GroupsOverview() {
  return (
    <LocalLayout>
      <Overview />
    </LocalLayout>
  );
}

function Overview() {
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES } = Route.useLoaderData();
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
