import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { GroupFineCreate, UserBase } from 'types';

import { useUserMembershipsWithFines } from 'hooks/User';

import UserSearch from 'components/inputs/UserSearch';
import { Form } from 'components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Skeleton } from 'components/ui/skeleton';
import { Combobox } from 'components/ui/multi-select';

type FormValues = Omit<GroupFineCreate, 'user'> & {
  user: Array<UserBase>;
};

const ShortCutFineForm = () => {
  const [group, setGroup] = useState<string | null>(null);

  const { data, isLoading } = useUserMembershipsWithFines();
  const memberships = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  const form = useForm<FormValues>({
    defaultValues: {
      description: '',
      amount: 1,
    },
  });

  const submit = (data: FormValues) => {};

  if (isLoading) {
    return (
      <div className='space-y-8'>
        <Skeleton className='w-full h-[40px] rounded-md' />
        <Skeleton className='w-full h-[120px] rounded-md' />
        <Skeleton className='w-full h-[40px] rounded-md' />
      </div>
    );
  }

  return (
    <>
    <Form {...form}>
      <form className='space-y-8' onSubmit={form.handleSubmit(submit)}>
        <Select onValueChange={(value) => setGroup(value)}>
          <SelectTrigger>
            <SelectValue placeholder='Velg en gruppe' />
          </SelectTrigger>
          <SelectContent>
            {memberships.map((membership, index) => (
              <SelectItem key={index} value={membership.group.slug}>
                {membership.group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!group && <h1 className='text-center text-muted-foreground'>Velg en gruppe for å fortsette</h1>}

        {group && (
          <UserSearch
            control={form.control}
            formState={form.formState}
            helperText='Du kan velge flere personer'
            inGroup={group}
            label='Hvem har begått et lovbrudd?'
            multiple
            name='user'
          />
        )}
      </form>
    </Form>
    <Combobox options={[{label: '2', value: '2'}]} multiple clearable />
    </>
  );
};

export default ShortCutFineForm;
