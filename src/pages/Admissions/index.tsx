import { GroupList } from 'types';

import { useGroupsByType } from 'hooks/Group';

import Page from 'components/navigation/Page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';

import GroupAdmission, { GroupAdmissionLoading } from './components/GroupAdmission';

const Admissions = () => {
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, error, isLoading } = useGroupsByType({ overview: true });

  type CollectionProps = {
    groups: Array<GroupList>;
    title: string;
  };

  const Collection = ({ groups, title }: CollectionProps) => (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>{title}</h1>
      <div className='space-y-2'>
        {groups.map((group, index) => (
          <GroupAdmission group={group} key={index} />
        ))}
      </div>
    </div>
  );

  return (
    <Page className='max-w-5xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Opptak til verv</CardTitle>
          <CardDescription>Her kan du søke på verv hos de ulike gruppene i TIHLDE</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {isLoading && (
            <div className='space-y-4'>
              {Array.from({ length: 12 }).map((_, index) => (
                <GroupAdmissionLoading key={index} />
              ))}
            </div>
          )}
          {error && <h1 className='text-center text-muted-foreground mt-4'>{error.detail}</h1>}
          {Boolean(BOARD_GROUPS.length) && <Collection groups={BOARD_GROUPS} title='Hovedorgan' />}
          {Boolean(SUB_GROUPS.length) && <Collection groups={SUB_GROUPS} title='Undergrupper' />}
          {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komitéer' />}
        </CardContent>
      </Card>
    </Page>
  );
};

export default Admissions;
