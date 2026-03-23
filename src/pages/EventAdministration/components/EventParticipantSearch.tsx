import { useNavigate, useSearch } from '@tanstack/react-router';
import { Input } from '~/components/ui/input';
import { useDebounce } from '~/hooks/Utils';
import { useEffect, useState } from 'react';

export default function EventParticipantSearch() {
  const { search: defaultSearch } = useSearch({
    from: '/_MainLayout/admin/arrangementer/{-$eventId}',
  });

  const [localSearch, setLocalSearch] = useState(defaultSearch);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setLocalSearch(defaultSearch);
  }, [defaultSearch]);

  useEffect(() => {
    navigate({ from: '/_MainLayout/admin/arrangementer/{-$eventId}', search: (prev) => ({ ...prev, search: debouncedSearch }), replace: true });
  }, [debouncedSearch, navigate]);

  return (
    <div className='space-y-2'>
      <h1 className='text-lg font-bold'>Søk: </h1>
      <Input value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder='Søk etter en deltager' />
    </div>
  );
}
