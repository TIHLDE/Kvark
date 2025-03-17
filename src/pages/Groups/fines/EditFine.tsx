import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useUpdateGroupFine } from '~/hooks/Group';
import type { GroupFine } from '~/types';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type EditFineProps = {
  groupSlug: string;
  fine: GroupFine;
};

const formSchema = z.object({
  reason: z.string().min(1, { message: 'Beskrivelsen kan ikke være tom' }),
  amount: z.string(),
});

const EditFine = ({ groupSlug, fine }: EditFineProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const editFine = useUpdateGroupFine(groupSlug, fine.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: fine.reason || '',
      amount: fine.amount.toString() || '',
    },
  });

  const onUpdate = (values: z.infer<typeof formSchema>) => {
    const data = {
      reason: values.reason,
      amount: Number.parseInt(values.amount),
    };
    editFine.mutate(data, {
      onSuccess: () => {
        toast.success('Boten ble oppdatert');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Pencil className='mr-2 w-5 h-5' />
      Rediger bot
    </Button>
  );

  return (
    <ResponsiveDialog description='Her kan du redigere boten' onOpenChange={setIsOpen} open={isOpen} title='Rediger bot' trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onUpdate)}>
          <MarkdownEditor form={form} label='Beskrivelse' name='reason' required />

          <FormInput disabled={fine.approved || fine.payed} form={form} label='Beløp' name='amount' required type='number' />

          <Button className='w-full' disabled={editFine.isLoading} type='submit'>
            {editFine.isLoading ? 'Oppdaterer...' : 'Oppdater'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default EditFine;
