import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from 'components/inputs/Input';
import { Form } from 'components/ui/form';

import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useDebounce } from 'hooks/Utils';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  search: z.string().optional(),
});

const EventParticipantSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { search: '' },
  });

  const debouncedSearch = useDebounce(form.watch('search'), 500);

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
    <div className='space-y-4'>
      <Form {...form}>
        <form className='space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-2'>
          <FormInput form={form} label='Søk' name='search' />
        </form>
      </Form>
    </div>
  );
};

export default EventParticipantSearch;
