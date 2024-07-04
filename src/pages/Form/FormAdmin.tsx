import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { EventFormType, FormResourceType } from 'types/Enums';

import { useFormById } from 'hooks/Form';

import Http404 from 'pages/Http404';

import FormAdminComponent from 'components/forms/FormAdmin';
import Page from 'components/navigation/Page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';

const FormPage = () => {
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
};

export default FormPage;
