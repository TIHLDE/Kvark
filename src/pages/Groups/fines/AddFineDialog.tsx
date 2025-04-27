import { zodResolver } from '@hookform/resolvers/zod';
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
import { useCreateGroupFine, useGroupLaws } from '~/hooks/Group';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import type { Group, GroupFineCreate } from '~/types';
import { formatLawHeader } from '~/utils';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddFineDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  description: z.string({ required_error: 'Du må velge en lov' }),
  amount: z.string(),
  reason: z.string(),
  user: z.array(z.string()).refine((v) => v.length > 0, { message: 'Du må velge minst en person' }),
  image: z.string().optional(),
});

const AddFineDialog = ({ groupSlug }: AddFineDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { data: laws, isLoading } = useGroupLaws(groupSlug, { enabled: dialogOpen });
  const createFine = useCreateGroupFine(groupSlug);

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

  useEffect(() => {
    if (selectedLawId && laws) {
      const law = laws.find((law) => law.id === selectedLawId);
      if (law) {
        form.setValue('amount', law.amount.toString());
      }
    }
  }, [selectedLawId, laws]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const law = laws?.find((law) => law.id === values.description);
    if (!law) {
      toast.error('Du må velge en lov');
      return;
    }
    const description = formatLawHeader(law);

    const data: GroupFineCreate = {
      ...values,
      description,
      image: values.image || null,
      amount: parseInt(values.amount),
    };

    createFine.mutate(data, {
      onSuccess: () => {
        toast.success('Boten ble opprettet');
        form.reset();
        setDialogOpen(false);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const selectableLawExists = Boolean(laws?.filter((law) => Boolean(law.description)).length);

  const OpenButton = (
    <Button className='fixed bottom-20 lg:bottom-4 right-4' size={isDesktop ? 'sm' : 'icon'}>
      <Plus className='lg:mr-1 h-4 w-4' />
      {isDesktop && 'Ny bot'}
    </Button>
  );

  return (
    <ResponsiveDialog description='Opprett en ny bot for et lovbrudd' onOpenChange={setDialogOpen} open={dialogOpen} title='Ny bot' trigger={OpenButton}>
      {!selectableLawExists && !isLoading && (
        <h1 className='text-center'>Det er ingen lover i lovverket, du kan ikke gi bot for å ha brutt en lov som ikke finnes.</h1>
      )}
      {laws && (
        <ScrollArea className='h-[60vh]'>
          <Form {...form}>
            <form className='space-y-4 pb-6' onSubmit={form.handleSubmit(onSubmit)}>
              <MultiUserSearch
                description='Du kan velge flere personer'
                form={form}
                inGroup={groupSlug}
                label='Hvem har begått et lovbrudd?'
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

              <FormInput form={form} label='Forslag til antall bøter' name='amount' required type='number' />

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
