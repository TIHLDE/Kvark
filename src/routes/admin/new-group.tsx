import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import FormInput from '~/components/inputs/Input';
import { FormSelect } from '~/components/inputs/Select';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form } from '~/components/ui/form';
import { createGroupMutation } from '~/api/queries/groups';
import type { GroupCreate } from '~/types';
import { GroupType } from '~/types/Enums';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// TODO: Re-add auth protection — previously used authClientWithRedirect() / userHasWritePermission(PermissionApp.GROUP)

const schema = z.object({
  name: z.string({
    error: 'Gruppenavn er pakrevd',
  }),
  slug: z.string({
    error: 'Gruppeslug er pakrevd',
  }),
  type: z.enum(GroupType, {
    error: 'Gruppetype er pakrevd',
  }),
});

export const Route = createFileRoute('/_MainLayout/admin/ny-gruppe')({
  component: NewGroupAdministration,
});

function NewGroupAdministration() {
  const createGroup = useMutation(createGroupMutation);

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

    createGroup.mutate(
      { data: data as never },
      {
        onSuccess: () => {
          toast.success('Gruppen ble opprettet');
          form.reset();
        },
        onError: (e) => {
          const detail = (e as unknown as { detail: Record<string, string> }).detail;
          if (detail && typeof detail === 'object') {
            Object.keys(detail).forEach((key: string) => {
              if (key in data) {
                const errorKey = key as keyof GroupCreate;
                form.setError(errorKey, { message: detail[key] });
              }
            });
          }
          toast.error('Det er en eller flere feil i skjemaet');
        },
      },
    );
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
                description='En slug er en kort tekststreng som brukes i URL-adresser for a identifisere en spesifikk ressurs pa en webside'
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
                  { value: GroupType.COMMITTEE, label: 'Komite' },
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
