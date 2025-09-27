import { useStore } from '@tanstack/react-form';
import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateGroupFine, useGroupLaws } from '~/hooks/Group';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import type { Group, GroupFineCreate, RequestResponse } from '~/types';
import { formatLawHeader } from '~/utils';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddFineDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  lawId: z.string({ required_error: 'Du må velge en lov' }),
  amount: z
    .string()
    .min(1, { message: 'Beløpet kan ikke være tomt' })
    .refine((v) => !Number.isNaN(Number(v)), { message: 'Beløpet må være et gyldig tall' }),
  reason: z.string(),
  user: z.array(z.string()).refine((v) => v.length > 0, { message: 'Du må velge minst en person' }),
  image: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const AddFineDialog = ({ groupSlug }: AddFineDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { data: laws, isLoading } = useGroupLaws(groupSlug, { enabled: dialogOpen });
  const createFine = useCreateGroupFine(groupSlug);

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      lawId: '',
      amount: '1',
      user: [] as string[],
      reason: '',
      image: '',
    } as FormValues,
    async onSubmit({ value }) {
      const law = laws?.find((law) => String(law.id) === value.lawId);
      if (!law) {
        toast.error('Du må velge en lov');
        return;
      }
      const description = formatLawHeader(law);
      const data: GroupFineCreate = {
        ...value,
        description,
        image: value.image || null,
        amount: parseInt(value.amount),
      };
      await toast.promise(
        createFine.mutateAsync(data, {
          onSuccess: () => {
            toast.success('Boten ble opprettet');
            form.reset();
            setDialogOpen(false);
          },
        }),
        {
          loading: 'Oppretter bot...',
          success: 'Boten ble opprettet',
          error: (e) => `Kunne ikke opprette boten: ${(e as RequestResponse).detail ?? 'Noe gikk galt'}`,
        },
      );
    },
  });

  const selectedLawId = useStore(form.store, (state) => state.values.lawId);
  const selectedLaw = useMemo(() => {
    return laws?.find((law) => String(law.id) === selectedLawId);
  }, [laws, selectedLawId]);

  useEffect(() => {
    if (selectedLawId && laws) {
      const law = laws.find((law) => String(law.id) === selectedLawId);
      if (law) {
        form.setFieldValue('amount', law.amount.toString());
      }
    }
  }, [selectedLawId, laws, form]);

  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const selectableLawExists = Boolean(laws?.filter((law) => Boolean(law.description)).length);

  return (
    <ResponsiveDialog
      description='Opprett en ny bot for et lovbrudd'
      onOpenChange={setDialogOpen}
      open={dialogOpen}
      title='Ny bot'
      trigger={
        <Button className='fixed bottom-20 lg:bottom-4 right-4' size={isDesktop ? 'sm' : 'icon'}>
          <Plus className='lg:mr-1 h-4 w-4' />
          {isDesktop && 'Ny bot'}
        </Button>
      }>
      {!selectableLawExists && !isLoading && (
        <h1 className='text-center'>Det er ingen lover i lovverket, du kan ikke gi bot for å ha brutt en lov som ikke finnes.</h1>
      )}
      {laws && (
        <ScrollArea className='h-[60vh]'>
          <form className='space-y-4 pb-6' onSubmit={handleFormSubmit(form)}>
            <form.AppField name='user'>{(field) => <field.UserField label='Hvem har begått et lovbrudd?' multiple required />}</form.AppField>

            <div className='rounded-md p-4 border space-y-2'>
              <form.AppField name='lawId'>
                {(field) => (
                  <field.SelectField
                    label='Lovbrudd'
                    options={laws.map((law) => ({
                      content: formatLawHeader(law),
                      value: String(law.id),
                    }))}
                    required
                    placeholder='Velg en lov'
                  />
                )}
              </form.AppField>
              <MarkdownRenderer value={selectedLaw?.description ?? ''} />
            </div>

            <form.AppField name='amount'>
              {(field) => <field.InputField label='Forslag til antall bøter' placeholder='Skriv her...' type='number' required />}
            </form.AppField>

            <form.AppField name='reason'>{(field) => <field.TextareaField label='Begrunnelse' required />}</form.AppField>

            <form.AppField name='image'>{(field) => <field.ImageUploadField label='Bildebevis (Valgfritt)' />}</form.AppField>

            <form.AppForm>
              <form.SubmitButton className='w-full' disabled={createFine.isPending} type='submit'>
                {createFine.isPending ? 'Oppretter bot...' : 'Opprett bot'}
              </form.SubmitButton>
            </form.AppForm>
          </form>
        </ScrollArea>
      )}
    </ResponsiveDialog>
  );
};

export default AddFineDialog;
