import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateStrike } from '~/hooks/Strike';
import type { Event, User } from '~/types';
import { StrikeReason } from '~/types/Enums';
import { getStrikeReasonAsText } from '~/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export type StrikeCreateDialogProps = {
  userId: User['user_id'];
  eventId: Event['id'];
};

const StrikeCreateDialog = ({ userId, eventId }: StrikeCreateDialogProps) => {
  const createStrike = useCreateStrike();
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: { strike_size: 1, strike_enum: StrikeReason.LATE, description: '' },
    onSubmit({ value }: { value: { strike_size: number; strike_enum: StrikeReason | 'custom'; description?: string } }) {
      const baseStrikeInfo = { user_id: userId, event_id: eventId };
      // Manual validation matching schema intent
      if (value.strike_enum === 'custom' && !value.description) {
        toast.error('En begrunnelse er påkrevd');
        return;
      }
      createStrike.mutate(
        {
          ...(value.strike_enum === 'custom' ? {} : { enum: value.strike_enum }),
          description: value.description || '',
          strike_size: Number(value.strike_size),
          ...baseStrikeInfo,
        },
        {
          onSuccess: () => {
            toast.success('Prikken ble opprettet');
            setOpen(false);
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        },
      );
    },
  });

  const CREATE_DESCRIPTION = `Deltagere på arrangementer får automatisk prikk for følgende:
    - Avmelding etter avmeldingsfrist (umiddelbart)
    - Møtte ikke opp (kl. 12:00 dagen etter arrangementsslutt)
  `;

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      Opprett ny prikk
    </Button>
  );

  return (
    <ResponsiveDialog
      className='max-w-2xl w-full'
      description={CREATE_DESCRIPTION}
      onOpenChange={setOpen}
      open={open}
      title='Opprett prikk'
      trigger={OpenButton}>
      <form className='px-2 space-y-4' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='strike_enum'>
          {(field) => (
            <field.SelectField
              label='Begrunnelse'
              options={[
                ...(Object.keys(StrikeReason) as Array<StrikeReason>).map((strikeEnum) => ({
                  value: String(strikeEnum),
                  content: getStrikeReasonAsText(strikeEnum),
                })),
                { value: 'custom', content: 'Egendefinert begrunnelse' },
              ]}
            />
          )}
        </form.AppField>

        <form.Subscribe selector={(s) => s.values.strike_enum as string}>
          {(selectedEnum) =>
            selectedEnum === 'custom' ? (
              <>
                <form.AppField name='strike_size'>{(field) => <field.InputField label='Antall prikker' type='number' />}</form.AppField>

                <form.AppField name='description'>{(field) => <field.TextareaField label='Begrunnelse' />}</form.AppField>
              </>
            ) : null
          }
        </form.Subscribe>

        <form.AppForm>
          <form.SubmitButton className='w-full' disabled={createStrike.isPending} type='submit'>
            {createStrike.isPending ? 'Oppretter prikk...' : 'Opprett prikk'}
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default StrikeCreateDialog;
