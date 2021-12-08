import { useState } from 'react';
import constate from 'constate';
import { GroupFine } from 'types';

const useFines = () => {
  const [finesFilter, setFinesFilter] = useState<{ approved?: boolean; payed?: boolean }>({ payed: false });
  const [checkedFines, setCheckedFines] = useState<Array<GroupFine['id']>>([]);

  const toggleCheckedFine = (fineId: GroupFine['id']) =>
    setCheckedFines((prev) => (prev.includes(fineId) ? prev.filter((fine) => fine !== fineId) : [...prev, fineId]));

  return { finesFilter, toggleCheckedFine, setFinesFilter, checkedFines, clearCheckedFines: () => setCheckedFines([]) };
};

export const [FinesProvider, useFinesFilter, useSetFinesFilter, useCheckedFines, useToggleCheckedFine, useClearCheckedFines] = constate(
  useFines,
  (value) => value.finesFilter,
  (value) => value.setFinesFilter,
  (value) => value.checkedFines,
  (value) => value.toggleCheckedFine,
  (value) => value.clearCheckedFines,
);
