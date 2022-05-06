import CheckIcon from '@mui/icons-material/CheckRounded';
import CrossIcon from '@mui/icons-material/CloseRounded';
import { Stack, styled, Tooltip, Typography } from '@mui/material';

import { PriorityPool } from 'types';
import { GroupType } from 'types/Enums';

import { useUser } from 'hooks/User';

import Paper from 'components/layout/Paper';
import { ShowMoreText, ShowMoreTooltip } from 'components/miscellaneous/UserInformation';

const Item = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0, 0.75),
  border: theme.palette.borderWidth + ' solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
}));

export type EventPriorityPoolsProps = {
  priorityPools: Array<PriorityPool>;
};

const EventPriorityPools = ({ priorityPools }: EventPriorityPoolsProps) => {
  const { data: user } = useUser();

  return (
    <Stack gap={0.5}>
      <Typography variant='body2'>Medlemmer i en av de følgende:</Typography>
      {priorityPools.map((pool, index) => (
        <Stack gap={0.5} key={index}>
          <Stack alignItems='center' direction='row' gap={1}>
            {pool.groups.filter((group) => !group.viewer_is_member).length === 0 ? (
              <Tooltip title='Du er prioritert ettersom du er medlem av alle disse gruppene!'>
                <CheckIcon sx={{ color: (theme) => theme.palette.success.main }} />
              </Tooltip>
            ) : (
              <Tooltip title='Du er ikke medlem av alle disse gruppene'>
                <CrossIcon sx={{ color: (theme) => theme.palette.error.main }} />
              </Tooltip>
            )}
            <Typography variant='body2'>
              {pool.groups.map((group) => (group.type === GroupType.STUDYYEAR ? `${group.name}-kullet` : group.name)).join(' og ')}
            </Typography>
          </Stack>
          {index !== priorityPools.length - 1 && (
            <Typography sx={{ ml: 5 }} variant='body2'>
              Eller
            </Typography>
          )}
        </Stack>
      ))}
      <ShowMoreText>
        {`Hvem er prioritert? For å være prioritert til dette arrangementet må du være medlem av alle gruppene i minst én av punktene med grupper over. Punktet er grønt hvis du er medlem av alle gruppene og dermed prioritert.

Hvis du er prioritert og har plass på arrangementet, kan du ikke miste denne. Hvis du ikke er prioritert og får plass til arrangementet, kan du risikere å miste plassen din om en annen som er prioritert melder seg på.

Med "-kullet" menes året du begynte på studiet. Du er en del av ${user?.studyyear.group?.name}-kullet.`}
      </ShowMoreText>
    </Stack>
  );
};

export default EventPriorityPools;
