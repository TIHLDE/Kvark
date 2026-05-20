import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '~/components/inputs/DateTimePicker';
import { FormSelect } from '~/components/inputs/Select';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import type { MembershipHistory } from '~/types';
import { MembershipType } from '~/types/Enums';
import { parseISO } from 'date-fns';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// TODO: Re-add update membership history — previously used useUpdateMembershipHistory from ~/hooks/Membership.
// The new query layer (~/api/queries/groups) does not yet have a membership history update endpoint.

type UpdateMembershipHistoryProps = {
  membership: MembershipHistory;
};

const formSchema = z
  .object({
    membership_type: z.enum(MembershipType),
    start_date: z.date(),
    end_date: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.start_date > data.end_date) {
      return ctx.addIssue({
        message: 'Sluttdato kan ikke vaere for startdato',
        path: ['end_date'],
        code: 'custom',
      });
    }
  });

const UpdateMembershipHistory = ({ membership }: UpdateMembershipHistoryProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membership_type: membership.membership_type,
      start_date: parseISO(membership.start_date),
      end_date: parseISO(membership.end_date),
    },
  });

  const onSubmit = (_values: z.infer<typeof formSchema>) => {
    // TODO: Implement when membership history mutation is available
    toast.error('Oppdatering av medlemshistorikk er ikke implementert enda');
    setIsOpen(false);
  };

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Pencil className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Oppdater medlemskap
    </Button>
  );

  return (
    <ResponsiveDialog
      className='w-full max-w-2xl'
      description='Oppdater medlemskapet til brukeren.'
      onOpenChange={setIsOpen}
      open={isOpen}
      title='Oppdater medlemskap'
      trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-4 px-2 py-4' onSubmit={form.handleSubmit(onSubmit)}>
          <DateTimePicker form={form} label='Startdato' name='start_date' required />

          <DateTimePicker form={form} label='Sluttdato' name='end_date' required />

          <FormSelect
            form={form}
            label='Medlemstype'
            name='membership_type'
            options={[
              { value: MembershipType.MEMBER, label: 'Medlem' },
              { value: MembershipType.LEADER, label: 'Leder' },
            ]}
            placeholder='Velg medlemstype'
            required
          />

          <Button className='w-full'>Oppdater</Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default UpdateMembershipHistory;
