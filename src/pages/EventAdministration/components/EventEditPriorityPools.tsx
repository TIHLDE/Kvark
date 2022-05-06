import { Button, FormGroup, FormLabel, Stack } from '@mui/material';

import { PriorityPoolMutate } from 'types';
export type EventEditPriorityPoolsProps = {
  priorityPools: Array<PriorityPoolMutate>;
  setPriorityPools: (newPriorityPools: Array<PriorityPoolMutate>) => void;
};

const EventEditPriorityPools = ({ priorityPools, setPriorityPools }: EventEditPriorityPoolsProps) => {
  return <Stack>Prioriter</Stack>;
};

export default EventEditPriorityPools;
