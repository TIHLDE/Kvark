import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { updateFineMutation } from '~/api/queries/groups';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// TODO: Previously used useUpdateGroupFineDefense from ~/hooks/Group.
// Using updateFineMutation as a workaround to update the defense field.

type FineDefenseProps = {
  groupSlug: string;
  fineId: string;
  defense?: string;
};

const formSchema = z.object({
  defense: z.string().min(1, 'Et forsvar er pakrevd'),
});

const FineDefense = ({ groupSlug, fineId, defense }: FineDefenseProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updateFineDefense = useMutation(updateFineMutation);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defense: defense || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    updateFineDefense.mutate(
      { groupSlug, fineId, data: { defense: values.defense } as never },
      {
        onSuccess: () => {
          toast.success('Forsvar av boten ble oppdatert');
          setIsOpen(false);
        },
        onError: (e) => {
          toast.error(e.message);
        },
      },
    );

  const OpenButton = (
    <Button className='w-full' variant='outline'>
      <Shield className='w-5 h-5 mr-2' />
      {defense ? 'Endre forsvar' : 'Legg til forsvar'}
    </Button>
  );

  return (
    <ResponsiveDialog
      description='Skriv inn et forsvar for boten'
      onOpenChange={setIsOpen}
      open={isOpen}
      title={defense ? 'Endre forsvar' : 'Legg til forsvar'}
      trigger={OpenButton}>
      <Form {...form}>
        <form className='space-y-6 px-2 pb-6' onSubmit={form.handleSubmit(onSubmit)}>
          <MarkdownEditor form={form} label='Forsvar' name='defense' required />

          <Button className='w-full' type='submit'>
            {updateFineDefense.isPending ? 'Lagrer...' : 'Lagre'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default FineDefense;
