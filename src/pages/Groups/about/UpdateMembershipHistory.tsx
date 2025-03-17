import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '~/components/inputs/DateTimePicker';
import { FormSelect } from '~/components/inputs/Select';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useUpdateMembershipHistory } from '~/hooks/Membership';
import type { MembershipHistory } from '~/types';
import { MembershipType } from '~/types/Enums';
import { parseISO } from 'date-fns';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type UpdateMembershipHistoryProps = {
  membership: MembershipHistory;
};

const formSchema = z
  .object({
    membership_type: z.nativeEnum(MembershipType),
    start_date: z.date(),
    end_date: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.start_date > data.end_date) {
      return ctx.addIssue({
        message: 'Sluttdato kan ikke være før startdato',
        path: ['end_date'],
        code: z.ZodIssueCode.custom,
      });
    }
  });

const UpdateMembershipHistory = ({ membership }: UpdateMembershipHistoryProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updateMembershipHistory = useUpdateMembershipHistory(membership.group.slug, membership.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membership_type: membership.membership_type,
      start_date: parseISO(membership.start_date),
      end_date: parseISO(membership.end_date),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMembershipHistory.mutate(
      {
        ...values,
        start_date: values.start_date.toJSON(),
        end_date: values.end_date.toJSON(),
      },
      {
        onSuccess: () => {
          toast.success('Det tidligere medlemskapet ble oppdatert');
          setIsOpen(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
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
      trigger={OpenButton}
    >
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

          <Button className='w-full'>{updateMembershipHistory.isLoading ? 'Oppdaterer...' : 'Oppdater'}</Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default UpdateMembershipHistory;
