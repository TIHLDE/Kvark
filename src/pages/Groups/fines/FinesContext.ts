import { atom, useAtom } from 'jotai';
import type { GroupFine } from '~/types';

const finesFilterAtom = atom<{ approved?: boolean; payed?: boolean }>({ payed: false });
const checkedFinesAtom = atom<GroupFine['id'][]>([]);

export const useFinesFilter = () => useAtom(finesFilterAtom);
export const useCheckedFines = () => useAtom(checkedFinesAtom);
export const useToggleCheckedFine = () => {
  const [, setCheckedFines] = useCheckedFines();
  return (fineId: GroupFine['id']) => setCheckedFines((prev) => (prev.includes(fineId) ? prev.filter((fine) => fine !== fineId) : [...prev, fineId]));
};
export const useClearCheckedFines = () => {
  const [, setCheckedFines] = useCheckedFines();
  return () => setCheckedFines([]);
};
