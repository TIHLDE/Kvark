import DeleteIcon from '@mui/icons-material/DeleteRounded';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

import { GroupList, PriorityPoolMutate } from 'types';
import { GroupType } from 'types/Enums';

import { useGroupsByType } from 'hooks/Group';
import { useUser } from 'hooks/User';

export type EventEditPriorityPoolsProps = {
  priorityPools: Array<PriorityPoolMutate>;
  setPriorityPools: React.Dispatch<React.SetStateAction<PriorityPoolMutate[]>>;
};

const EventEditPriorityPools = ({ priorityPools, setPriorityPools }: EventEditPriorityPoolsProps) => {
  const { data: user } = useUser();
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS, STUDYGROUPS, STUDYYEARGROUPS, data = [] } = useGroupsByType();

  const handleChange = (event: SelectChangeEvent<PriorityPoolMutate['groups']>, index: number) => {
    const {
      target: { value },
    } = event;
    setPriorityPools((prev) => prev.map((pool, i) => (i === index ? { groups: typeof value === 'string' ? value.split(',') : value } : pool)));
  };

  const addPriorityPool = () => setPriorityPools((prev) => [...prev, { groups: [] }]);
  const removePriorityPool = (index: number) => setPriorityPools((prev) => prev.filter((_, i) => i !== index));

  type GroupOption = { type: 'header'; header: string } | { type: 'group'; group: GroupList };
  const groupOptions = useMemo<Array<GroupOption>>(() => {
    const array: Array<GroupOption> = [];
    if (BOARD_GROUPS.length) {
      array.push({ type: 'header', header: 'Hovedorgan' });
      BOARD_GROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (SUB_GROUPS.length) {
      array.push({ type: 'header', header: 'Undergrupper' });
      SUB_GROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (COMMITTEES.length) {
      array.push({ type: 'header', header: 'Komitéer' });
      COMMITTEES.forEach((group) => array.push({ type: 'group', group }));
    }
    if (INTERESTGROUPS.length) {
      array.push({ type: 'header', header: 'Interessegrupper' });
      INTERESTGROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (STUDYGROUPS.length) {
      array.push({ type: 'header', header: 'Studier' });
      STUDYGROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (STUDYYEARGROUPS.length) {
      array.push({ type: 'header', header: 'Kull' });
      STUDYYEARGROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    return array;
  }, [BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS, STUDYGROUPS, STUDYYEARGROUPS]);

  const getGroupName = (slug: GroupList['slug']) => {
    const group = data.find((group) => group.slug === slug);
    return group ? (group.type === GroupType.STUDYYEAR ? `${group.name}-kullet` : group.name) : 'Ukjent';
  };

  return (
    <Stack gap={2}>
      <Typography variant='body2'>
        {`Definer prioriteringsgrupper her. For at en bruker skal bli prioritert må den være medlem av <b>alle</b> gruppene i en av prioriteringsgruppene. Med "-kullet" menes året du startet på studiet. Du er en del av ${user?.studyyear.group?.name}-kullet.`}
      </Typography>
      {priorityPools.map((pool, index) => (
        <Stack direction='row' gap={1} key={index} sx={{ alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id={`select-priority-groups-${index}-label`}>Prioriteringsgruppe</InputLabel>
            <Select
              fullWidth
              id={`select-priority-groups-${index}`}
              input={<OutlinedInput fullWidth id={`select-priority-groups-${index}`} label='Prioriteringsgruppe' />}
              labelId={`select-priority-groups-${index}-label`}
              multiple
              onChange={(e) => handleChange(e, index)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={getGroupName(value)} />
                  ))}
                </Box>
              )}
              value={pool.groups}>
              {groupOptions.map((option) =>
                option.type === 'header' ? (
                  <ListSubheader key={option.header}>{option.header}</ListSubheader>
                ) : (
                  <MenuItem key={option.group.slug} value={option.group.slug}>
                    {option.group.name}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
          <Tooltip arrow title='Fjern prioriteringsgruppe'>
            <IconButton color='error' onClick={() => removePriorityPool(index)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
      <Button onClick={addPriorityPool} variant='contained'>
        Legg til prioriteringsgruppe
      </Button>
    </Stack>
  );
};

export default EventEditPriorityPools;
