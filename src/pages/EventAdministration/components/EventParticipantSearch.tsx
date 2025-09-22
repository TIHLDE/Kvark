import { Input } from '~/components/ui/input';
import { useDebounce } from '~/hooks/Utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

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
