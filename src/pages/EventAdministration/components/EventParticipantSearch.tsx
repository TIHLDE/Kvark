import { parseAsString, useQueryState } from 'nuqs';
import { Input } from '~/components/ui/input';

const EventParticipantSearch = () => {
  const [, setSearchInput] = useQueryState(
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
