import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { useDebounce } from 'hooks/Utils';

import { Input } from 'components/ui/input';

const EventParticipantSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string | undefined>(searchParams.get('search')?.toString());

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      if (debouncedSearch === '') {
        searchParams.delete('search');
      } else {
        searchParams.set('search', debouncedSearch);
      }
      setSearchParams(searchParams);
    }
  }, [debouncedSearch, setSearchParams]);

  return (
    <div className='space-y-2'>
      <h1 className='text-lg font-bold'>Søk: </h1>
      <Input onChange={(e) => setSearchInput(e.target.value)} placeholder='Søk etter en deltager' />
    </div>
  );
};

export default EventParticipantSearch;
