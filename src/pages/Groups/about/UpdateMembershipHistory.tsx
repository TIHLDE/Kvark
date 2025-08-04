import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { LoadingSpinner } from '~/components/miscellaneous/loading-spinner';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useUpdateMembershipHistory } from '~/hooks/Membership';
import type { MembershipHistory } from '~/types';
import { MembershipType } from '~/types/Enums';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { PencilIcon } from 'lucide-react';

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

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
    },
    defaultValues: {
      membership_type: membership.membership_type,
      start_date: parseISO(membership.start_date),
      end_date: parseISO(membership.end_date),
    } as z.infer<typeof formSchema>,

    async onSubmit({ value }) {
      try {
        await updateMembershipHistory.mutateAsync({
          ...value,
          start_date: value.start_date.toJSON(),
          end_date: value.end_date.toJSON(),
        });
        toast.success('Det tidligere medlemskapet ble oppdatert');
        setIsOpen(false);
      } catch (e) {
        toast.error(e.detail);
      }
    },
  });

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <PencilIcon className='mr-2 w-5 h-5 stroke-[1.5px]' />
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
      <form className='space-y-4 px-2 py-4' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='start_date'>{(field) => <field.DateTimeField label='Startdato' required />}</form.AppField>

        <form.AppField name='end_date'>{(field) => <field.DateTimeField label='Sluttdato' required />}</form.AppField>

        <form.AppField name='membership_type'>
          {(field) => (
            <field.SelectField
              label='Medlemstype'
              placeholder='Velg medlemstype'
              required
              options={[
                { value: MembershipType.MEMBER, content: 'Medlem' },
                { value: MembershipType.LEADER, content: 'Leder' },
              ]}
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton loading={<LoadingSpinner>Oppdaterer</LoadingSpinner>}>Oppdater</form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default UpdateMembershipHistory;
