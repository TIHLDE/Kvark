import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input } from '~/components/ui/input';
import { useDebounce } from '~/hooks/Utils';

const EventParticipantSearch = () => {
  const [searchInput, setSearchInput] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({
      throttleMs: 500,
    }),
  );

  return (
    <div className='space-y-2'>
      <h1 className='text-lg font-bold'>Søk: </h1>
      <Input onChange={(e) => setSearchInput(e.target.value)} placeholder='Søk etter en deltager' />
    </div>
  );
};

export default EventParticipantSearch;
