import { Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { getStudyyearAsClass } from 'utils';

import { PriorityPool } from 'types';
import { GroupType } from 'types/Enums';

import { useUser } from 'hooks/User';

import Paper from 'components/layout/Paper';
import { ShowMoreText } from 'components/miscellaneous/UserInformation';

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
    <Stack gap={0.5}>
      {priorityPools.map((pool, index) => (
        <Stack alignItems='center' component={Paper} direction='row' gap={1} key={index} sx={{ position: 'relative', py: 0.5, px: 1, borderRadius: 0.5 }}>
          <Typography variant='body2'>{getGroupsString(pool.groups)}</Typography>
        </Stack>
      ))}
      <ShowMoreText sx={{ mt: 1 }} variant='caption'>
        <b>Hvem er prioritert?</b>
        {`
Boksene ovenfor viser dette arrangementets prioriteringsgrupper. Du er prioritert om du er medlem av alle gruppene i én av prioriteringsgruppene. Rekkefølgen til gruppene har ingenting å si.

Hvis du er prioritert og har plass på arrangementet, kan du ikke miste plassen. Hvis du ikke er prioritert og får plass til arrangementet, kan du miste plassen din om en annen som er prioritert melder seg på.

Med "-kullet" menes året du startet på studiet. ${user ? `Du er for eksempel en del av ${user.studyyear.group?.name}-kullet.` : ''}`}
      </ShowMoreText>
    </Stack>
  );
};

export default EventPriorityPools;
