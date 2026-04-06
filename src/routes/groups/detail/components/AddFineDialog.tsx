import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import FormInput from '~/components/inputs/Input';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import { FormSelect } from '~/components/inputs/Select';
import { FormImageUpload } from '~/components/inputs/Upload';
import { MultiUserSearch } from '~/components/inputs/UserSearch';
import MarkdownRenderer from '~/components/miscellaneous/MarkdownRenderer';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { createFineMutation } from '~/api/queries/groups';
import type { Group } from '~/types';
import { formatLawHeader } from '~/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// TODO: Re-add group laws query — previously used useGroupLaws from ~/hooks/Group.
// The new query layer (~/api/queries/groups) does not yet have a group laws endpoint.
// For now, laws are not loaded.

export type AddFineDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  description: z.string({
    error: (issue) => (issue.input === undefined ? 'Du ma velge en lov' : undefined),
  }),
  amount: z.string(),
  reason: z.string(),
  user: z.array(z.string()).refine((v) => v.length > 0, {
    error: 'Du ma velge minst en person',
  }),
  image: z.string().optional(),
});

const AddFineDialog = ({ groupSlug }: AddFineDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // TODO: Replace with laws query when available
  const laws: { id: string; description: string; amount: number; title: string; paragraph: number }[] = [];
  const isLoading = false;
  const createFine = useMutation(createFineMutation);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: laws?.filter((l) => Boolean(l.description))[0]?.id,
      amount: laws?.filter((l) => Boolean(l.description))[0]?.amount.toString() || '1',
      user: [],
      reason: '',
      image: '',
    },
  });

  const selectedLawId = form.watch('description');

  // Replaced useEffect: the amount is set when the law selection changes via onChange
  const selectedLaw = laws.find((law) => law.id === selectedLawId);
  if (selectedLaw && form.getValues('amount') !== selectedLaw.amount.toString()) {
    form.setValue('amount', selectedLaw.amount.toString());
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const law = laws?.find((law) => law.id === values.description);
    if (!law) {
      toast.error('Du ma velge en lov');
      return;
    }
    const description = formatLawHeader(law);

    createFine.mutate(
      {
        groupSlug,
        data: {
          ...values,
          description,
          image: values.image || null,
          amount: parseInt(values.amount),
        } as never,
      },
      {
        onSuccess: () => {
          toast.success('Boten ble opprettet');
          form.reset();
          setDialogOpen(false);
        },
        onError: (e) => {
          toast.error(e.message);
        },
      },
    );
  };

  const selectableLawExists = Boolean(laws?.filter((law) => Boolean(law.description)).length);

  // Replaced useMediaQuery with Tailwind responsive classes
  const OpenButton = (
    <Button className='fixed bottom-20 right-4 lg:bottom-4 lg:px-3 lg:py-2' size='icon'>
      <Plus className='h-4 w-4 lg:mr-1' />
      <span className='hidden lg:inline'>Ny bot</span>
    </Button>
  );

  return (
    <ResponsiveDialog description='Opprett en ny bot for et lovbrudd' onOpenChange={setDialogOpen} open={dialogOpen} title='Ny bot' trigger={OpenButton}>
      {!selectableLawExists && !isLoading && (
        <h1 className='text-center'>Det er ingen lover i lovverket, du kan ikke gi bot for a ha brutt en lov som ikke finnes.</h1>
      )}
      {laws.length > 0 && (
        <ScrollArea className='h-[60vh]'>
          <Form {...form}>
            <form className='space-y-4 pb-6' onSubmit={form.handleSubmit(onSubmit)}>
              <MultiUserSearch
                description='Du kan velge flere personer'
                form={form}
                inGroup={groupSlug}
                label='Hvem har begatt et lovbrudd?'
                name='user'
                required
              />

              <div className='rounded-md p-4 border space-y-2'>
                <FormSelect
                  form={form}
                  label='Lovbrudd'
                  name='description'
                  options={laws.map((law) => ({
                    label: formatLawHeader(law),
                    value: law.id,
                    isHeader: Boolean(!law.description),
                  }))}
                  required
                />
                <MarkdownRenderer value={laws.find((law) => law.id === form.getValues('description'))?.description ?? ''} />
              </div>

              <FormInput form={form} label='Forslag til antall boter' name='amount' required type='number' />

              <MarkdownEditor form={form} label='Begrunnelse' name='reason' required />

              <FormImageUpload form={form} label='Bildebevis (Valgfritt)' name='image' />

              <Button className='w-full' disabled={createFine.isPending} type='submit'>
                {createFine.isPending ? 'Oppretter bot...' : 'Opprett bot'}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      )}
    </ResponsiveDialog>
  );
};

export default AddFineDialog;
