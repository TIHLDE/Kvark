import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import FormAdminComponent from '~/components/forms/FormAdmin';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useFormById } from '~/hooks/Form';
import Http404 from '~/pages/Http404';
import { EventFormType, FormResourceType, PermissionApp } from '~/types/Enums';
import { useMemo } from 'react';
import { href, redirect, useParams } from 'react-router';

import { Route } from './+types/FormAdmin';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const auth = await authClientWithRedirect(request);

  if (!userHasWritePermission(auth.permissions, PermissionApp.GROUPFORM)) {
    return redirect(href('/'));
  }
}

export default function FormPage() {
  const { id } = useParams<'id'>();
  const { data: form, isError } = useFormById(id || '-');

  const title = useMemo(
    () => (form ? (form.resource_type === FormResourceType.EVENT_FORM && form.type === EventFormType.EVALUATION ? 'Evaluering' : form.title) : ''),
    [form],
  );

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page className='max-w-5xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Administrer skjema</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent>{form && id ? <FormAdminComponent formId={id} /> : <h1 className='text-center'>Laster spørreskjema...</h1>}</CardContent>
      </Card>
    </Page>
  );
}
