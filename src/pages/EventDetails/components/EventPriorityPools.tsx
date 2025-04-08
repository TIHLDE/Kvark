import { useCallback } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { useUser } from '~/hooks/User';
import type { PriorityPool } from '~/types';
import { GroupType } from '~/types/Enums';
import { getStudyyearAsClass } from '~/utils';

export type EventPriorityPoolsProps = {
  priorityPools: Array<PriorityPool>;
};

const EventPriorityPools = ({ priorityPools }: EventPriorityPoolsProps) => {
  const { data: user } = useUser();

  const getGroupsString = useCallback((groups: PriorityPool['groups']) => {
    const study = groups.filter((group) => group.type === GroupType.STUDY);
    const studyyear = groups.filter((group) => group.type === GroupType.STUDYYEAR);
    if (study.length === 1 && studyyear.length === 1) {
      const otherGroups = groups.filter((group) => group.type !== GroupType.STUDYYEAR && group.type !== GroupType.STUDY).map((group) => group.name);
      return [`${study[0].name} - ${getStudyyearAsClass(studyyear[0], study[0])}`, ...otherGroups].join(' og ');
    }
    return groups.map((group) => (group.type === GroupType.STUDYYEAR ? `${group.name}-kullet` : group.name)).join(' og ');
  }, []);

  return (
    <div className='space-y-2'>
      {priorityPools.map((pool, index) => (
        <Card className='rounded-sm' key={index}>
          <CardContent className='py-1 px-2'>
            <h1 className='text-xs'>{getGroupsString(pool.groups)}</h1>
          </CardContent>
        </Card>
      ))}
      <Expandable title='Hvordan fungerer prioritering?'>
        <p className='text-sm text-muted-foreground'>
          {`
            Boksene ovenfor viser dette arrangementets prioriteringsgrupper. Du er prioritert om du er medlem av alle gruppene i én av prioriteringsgruppene. Rekkefølgen til gruppene har ingenting å si.

            Hvis du er prioritert og har plass på arrangementet, kan du ikke miste plassen. Hvis du ikke er prioritert og får plass til arrangementet, kan du miste plassen din om en annen som er prioritert melder seg på.

            Med "-kullet" menes året du startet på studiet. ${user ? `Du er for eksempel en del av ${user.studyyear.group?.name}-kullet.` : ''}`}
        </p>
      </Expandable>
    </div>
  );
};

export default EventPriorityPools;
