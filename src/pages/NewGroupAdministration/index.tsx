import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from 'components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';

const schema = z.object({
  groupName: z.string().min(1, 'Gruppenavn er påkrevd'),
  slug: z.string().min(1, 'Slug er påkrevd'),
  groupType: z.enum(['board', 'subGroup', 'committee', 'interestGroup'], { message: 'Gruppetype er påkrevd' }),
});

export default function NewGroupAdministration() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  return (
    <div className='max-w-5xl mx-auto pt-24 flex flex-col gap-2 px-2'>
      <h1 className='text-4xl font-bold'>Opprett ny gruppe</h1>
      <p className='text-muted-foreground mb-8'>Velg gruppetype og opprett en ny gruppe.</p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormItem className='mb-5'>
            <FormLabel>Gruppenavn</FormLabel>
            <Input placeholder='Gruppenavn' {...register('groupName')} />
            {errors.groupName && <p className='text-red-500'>{errors.groupName.message as string}</p>}
          </FormItem>
          <FormItem style={{ marginBottom: '20px' }}>
            <FormLabel>Slug</FormLabel>
            <Input placeholder='Slug' {...register('slug')} />
            {errors.slug && <p className='text-red-500'>{errors.slug.message as string}</p>}
            <p className='text-muted-foreground mb-8 text-sm'>
              En slug er en kort tekststreng som brukes i URL-adresser for å identifisere en spesifikk ressurs på en webside
            </p>
          </FormItem>
          <FormField
            control={form.control}
            name='groupType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gruppetype</FormLabel>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='text-muted-foreground'>
                      <SelectValue placeholder='Velg gruppetype...' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='board'>Styre</SelectItem>
                    <SelectItem value='subGroup'>Undergruppe</SelectItem>
                    <SelectItem value='committee'>Komité</SelectItem>
                    <SelectItem value='interestGroup'>Interesse Gruppe</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className='mt-5'>
            <Button type='submit' variant='default'>
              Opprett Gruppe
            </Button>
          </FormItem>
        </form>
      </Form>
    </div>
  );
}
