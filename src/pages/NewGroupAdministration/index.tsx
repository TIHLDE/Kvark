import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useCreateGroup } from '~/hooks/Group';
import type { GroupCreate } from '~/types';
import { GroupType, PermissionApp } from '~/types/Enums';
import { href, redirect } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { Route } from './+types';

const schema = z.object({
  name: z.string({ message: 'Gruppenavn er påkrevd' }),
  slug: z.string({ message: 'Gruppeslug er påkrevd' }),
  type: z.nativeEnum(GroupType, { message: 'Gruppetype er påkrevd' }),
});

export async function clientLoader({ request }: Route.ClientActionArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.GROUP)) {
    return redirect(href('/'));
  }
}

export default function NewGroupAdministration() {
  const createGroup = useCreateGroup();

  const form = useAppForm({
    validators: { onBlur: schema },
    defaultValues: { name: '', slug: '', type: GroupType.BOARD },
    async onSubmit({ value }: { value: z.infer<typeof schema> }) {
      const data: GroupCreate = {
        name: value.name,
        slug: value.slug.toLowerCase(),
        type: value.type,
      };

      try {
        await createGroup.mutateAsync(data);
        toast.success('Gruppen ble opprettet');
        form.reset();
      } catch (e: unknown) {
        if (e instanceof Error) {
          return toast.error(e.message);
        }
        toast.error((e as { detail: string }).detail);
      }
    },
  });

  return (
    <div className='max-w-5xl mx-auto pt-24 px-2'>
      <Card>
        <CardHeader>
          <CardTitle>Opprett ny gruppe</CardTitle>
          <CardDescription>Velg gruppetype og opprett en ny gruppe.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={handleFormSubmit(form)}>
            <form.AppField name='name'>{(field) => <field.InputField label='Gruppenavn' required />}</form.AppField>
            <form.AppField name='slug'>
              {(field) => (
                <field.InputField
                  description='En slug er en kort tekststreng som brukes i URL-adresser for å identifisere en spesifikk ressurs på en webside'
                  label='Slug'
                  required
                />
              )}
            </form.AppField>
            <form.AppField name='type'>
              {(field) => (
                <field.SelectField
                  label='Gruppetype'
                  options={[
                    { value: GroupType.BOARD, content: 'Styre' },
                    { value: GroupType.SUBGROUP, content: 'Undergruppe' },
                    { value: GroupType.COMMITTEE, content: 'Komité' },
                    { value: GroupType.INTERESTGROUP, content: 'Interessegruppe' },
                  ]}
                  required
                />
              )}
            </form.AppField>

            <form.AppForm>
              <form.SubmitButton type='submit' variant='default'>
                Opprett Gruppe
              </form.SubmitButton>
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
