import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getStrikeReasonAsText } from 'utils';
import { z } from 'zod';

import { Event, User } from 'types';
import { StrikeReason } from 'types/Enums';

import { useCreateStrike } from 'hooks/Strike';

import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Textarea } from 'components/ui/textarea';

export type StrikeCreateDialogProps = {
  userId: User['user_id'];
  eventId: Event['id'];
};

const formSchema = z
  .object({
    strike_size: z.number().int().positive(),
    strike_enum: z.union([z.nativeEnum(StrikeReason), z.literal('custom')]),
    description: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.strike_enum === 'custom' && !values.description) {
      ctx.addIssue({ path: ['description'], message: 'En begrunnelse er påkrevd', code: 'custom' });
    }
  });

const StrikeCreateDialog = ({ userId, eventId }: StrikeCreateDialogProps) => {
  const createStrike = useCreateStrike();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { strike_size: 1, strike_enum: StrikeReason.LATE },
  });

  const selectedEnum = form.watch('strike_enum');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const baseStrikeInfo = { user_id: userId, event_id: eventId };
    createStrike.mutate(
      {
        ...(values.strike_enum === 'custom' ? {} : { enum: values.strike_enum }),
        description: values.description || '',
        strike_size: Number(values.strike_size),
        ...baseStrikeInfo,
      },
      {
        onSuccess: () => {
          toast.success('Prikken ble opprettet');
          form.reset();
          setOpen(false);
        },
        onError: (e) => {
          form.setError('strike_enum', { message: e.detail });
        },
      },
    );
  };

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
      <Form {...form}>
        <form className='px-2 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='strike_enum'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Begrunnelse</FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a verified email to display' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(StrikeReason) as Array<StrikeReason>).map((strikeEnum) => (
                      <SelectItem key={strikeEnum} value={strikeEnum}>
                        {getStrikeReasonAsText(strikeEnum)}
                      </SelectItem>
                    ))}
                    <SelectItem value='custom'>Egendefinert begrunnelse</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedEnum === 'custom' && (
            <>
              <FormField
                control={form.control}
                name='strike_size'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antall prikker</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='0' type='number' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Begrunnelse</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='Skriv her' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button className='w-full' disabled={createStrike.isLoading} type='submit'>
            {createStrike.isLoading ? 'Oppretter prikk...' : 'Opprett prikk'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default StrikeCreateDialog;
