import { GroupList } from 'types';

import { useGroupsByType } from 'hooks/Group';
import { useIsAuthenticated } from 'hooks/User';

import GroupItem, { GroupItemLoading } from 'pages/Groups/overview/GroupItem';

import { CardContent, CardHeader, CardTitle } from 'components/ui/card';

const GroupsOverview = () => {
  const isAuthenticated = useIsAuthenticated();
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS, OTHER_GROUPS, error, isLoading } = useGroupsByType({ overview: true });

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
      <CardHeader>
        <CardTitle>Gruppeoversikt</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoading && (
          <div className='grid md:grid-cols-2 gap-4'>
            {Array.from({ length: 12 }).map((_, index) => (
              <GroupItemLoading key={index} />
            ))}
          </div>
        )}
        {error && <h1 className='text-center text-muted-foreground mt-4'>{error.detail}</h1>}
        {Boolean(BOARD_GROUPS.length) && <Collection groups={BOARD_GROUPS} title='Hovedorgan' />}
        {Boolean(SUB_GROUPS.length) && <Collection groups={SUB_GROUPS} title='Undergrupper' />}
        {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komitéer' />}
        {Boolean(INTERESTGROUPS.length) && <Collection groups={INTERESTGROUPS} title='Interessegrupper' />}
        {isAuthenticated && Boolean(OTHER_GROUPS.length) && <Collection groups={OTHER_GROUPS} title='Andre grupper' />}
      </CardContent>
    </>
  );
};

export default GroupsOverview;
