import { zodResolver } from '@hookform/resolvers/zod';
import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import FormInput from '~/components/inputs/Input';
import { FormSelect } from '~/components/inputs/Select';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form } from '~/components/ui/form';
import { useCreateGroup } from '~/hooks/Group';
import type { GroupCreate } from '~/types';
import { GroupType, PermissionApp } from '~/types/Enums';
import { useForm } from 'react-hook-form';
import { href, redirect } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Route } from './+types';

const schema = z.object({
  name: z.string({
    error: 'Gruppenavn er påkrevd',
  }),
  slug: z.string({
    error: 'Gruppeslug er påkrevd',
  }),
  type: z.enum(GroupType, {
    error: 'Gruppetype er påkrevd',
  }),
});

export async function clientLoader({ request }: Route.ClientActionArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.GROUP)) {
    return redirect(href('/'));
  }
}

export default function NewGroupAdministration() {
  const createGroup = useCreateGroup();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', type: GroupType.BOARD },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    const data: GroupCreate = {
      name: values.name,
      slug: values.slug.toLowerCase(),
      type: values.type,
    };

    createGroup.mutate(data, {
      onSuccess: () => {
        toast.success('Gruppen ble opprettet');
        form.reset();
      },
      onError: (e) => {
        Object.keys(e.detail).forEach((key: string) => {
          if (key in data) {
            const errorKey = key as keyof GroupCreate;
            const errorMessage = (e.detail as unknown as Record<string, string | undefined>)[key];
            form.setError(errorKey, { message: errorMessage });
          }
        });
        toast.error('Det er en eller flere feil i skjemaet');
      },
    });
  };

  return (
    <div className='max-w-5xl mx-auto pt-24 px-2'>
      <Card>
        <CardHeader>
          <CardTitle>Opprett ny gruppe</CardTitle>
          <CardDescription>Velg gruppetype og opprett en ny gruppe.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput form={form} label='Gruppenavn' name='name' required />
              <FormInput
                description='En slug er en kort tekststreng som brukes i URL-adresser for å identifisere en spesifikk ressurs på en webside'
                form={form}
                label='Slug'
                name='slug'
                required
              />
              <FormSelect
                form={form}
                label='Gruppetype'
                name='type'
                options={[
                  { value: GroupType.BOARD, label: 'Styre' },
                  { value: GroupType.SUBGROUP, label: 'Undergruppe' },
                  { value: GroupType.COMMITTEE, label: 'Komité' },
                  { value: GroupType.INTERESTGROUP, label: 'Interessegruppe' },
                ]}
                required
              />
              <Button type='submit' variant='default'>
                Opprett Gruppe
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
