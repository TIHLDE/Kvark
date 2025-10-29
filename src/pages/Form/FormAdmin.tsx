import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { authClientWithRedirect, userHasWritePermission } from '~/api/auth';
import FormAdminComponent from '~/components/forms/FormAdmin';
import Page from '~/components/navigation/Page';
import Http404 from '~/components/shells/Http404';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useFormById } from '~/hooks/Form';
import { EventFormType, FormResourceType, PermissionApp } from '~/types/Enums';
import { useMemo } from 'react';

export const Route = createFileRoute('/_MainLayout/sporreskjema/admin/$id')({
  async beforeLoad({ location }) {
    const auth = await authClientWithRedirect(location.href);

    if (!userHasWritePermission(auth.permissions, PermissionApp.GROUPFORM)) {
      throw redirect({ to: '/' });
    }
  },
  component: FormPage,
});

function FormPage() {
  const { id } = useParams({ strict: false });
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
