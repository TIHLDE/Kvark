import CheckIcon from '@mui/icons-material/CheckRounded';
import { Stack, Tooltip, Typography } from '@mui/material';

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

  return (
    <Stack gap={0.5}>
      {priorityPools.map((pool, index) => (
        <Stack alignItems='center' component={Paper} direction='row' gap={1} key={index} sx={{ position: 'relative', py: 0.5, px: 1, pl: 4 }}>
          {pool.groups.filter((group) => !group.viewer_is_member).length === 0 && (
            <Tooltip arrow title='Du er prioritert gjennom denne prioriteringsgruppen!'>
              <CheckIcon
                aria-label='Du er prioritert gjennom denne prioriteringsgruppen!'
                sx={{ position: 'absolute', left: ({ spacing }) => spacing(1), fontSize: '1.2rem', color: (theme) => theme.palette.success.main }}
              />
            </Tooltip>
          )}
          <Typography variant='body2'>
            {pool.groups.map((group) => (group.type === GroupType.STUDYYEAR ? `${group.name}-kullet` : group.name)).join(' og ')}
          </Typography>
        </Stack>
      ))}
      <ShowMoreText sx={{ mt: 1 }}>
        <b>Hvem er prioritert?</b>
        {`
Boksene ovenfor viser dette arrangementets prioriteringsgrupper. Du er prioritert om du er medlem av alle gruppene i én av prioriteringsgruppene. Rekkefølgen til gruppene har ingenting å si. Ikonet til venstre viser om du er medlem av alle gruppene i prioriteringsgruppen, og dermed også prioritert.

Hvis du er prioritert og har plass på arrangementet, kan du ikke miste plassen. Hvis du ikke er prioritert og får plass til arrangementet, kan du miste plassen din om en annen som er prioritert melder seg på.

Med "-kullet" menes året du startet på studiet. ${user ? `Du er for eksempel en del av ${user.studyyear.group?.name}-kullet.` : ''}`}
      </ShowMoreText>
    </Stack>
  );
};

export default EventPriorityPools;
