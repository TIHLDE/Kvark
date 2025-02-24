import { atom, useAtom } from 'jotai';

const redirectUrlAtom = atom<string | undefined>(undefined);

export const useRedirectUrl = () => useAtom(redirectUrlAtom);
