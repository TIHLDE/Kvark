import { Input } from '~/components/ui/input';
import { parseAsString, useQueryState } from 'nuqs';

const EventParticipantSearch = () => {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({
      limitUrlUpdates: {
        method: 'debounce',
        timeMs: 500,
      },
    }),
  );

  return (
    <div className='space-y-2'>
      <h1 className='text-lg font-bold'>Søk: </h1>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Søk etter en deltager' />
    </div>
  );
};

export default EventParticipantSearch;
