import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { getFormByIdQuery } from '~/api/queries/forms';
import FormAdminComponent from '~/components/forms/FormAdmin';
import Page from '~/components/navigation/Page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

// TODO: Re-add auth protection — previously used authClientWithRedirect()
// TODO: Re-add permission check — previously checked userHasWritePermission(auth.permissions, PermissionApp.GROUPFORM)

export const Route = createFileRoute('/_MainLayout/sporreskjema/admin/$id')({
  component: FormAdminPage,
});

function FormAdminPage() {
  const { id } = Route.useParams();
  const { data: form } = useSuspenseQuery(getFormByIdQuery(id));

  const isEvaluation = form.resource_type === 'EventForm' && 'type' in form && (form as Record<string, unknown>).type === 'evaluation';
  const title = isEvaluation ? 'Evaluering' : form.title;

  return (
    <Page className='max-w-5xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Administrer skjema</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormAdminComponent formId={id} />
        </CardContent>
      </Card>
    </Page>
  );
}
