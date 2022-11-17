import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { EventFormType, FormResourceType } from 'types/Enums';

import { useFormById } from 'hooks/Form';

import Http404 from 'pages/Http404';

import FormAdminComponent from 'components/forms/FormAdmin';
import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

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
    <Page banner={<PrimaryTopBox />} options={{ title: `${form?.title || 'Laster spørreskjema...'} - Spørreskjema` }}>
      <Paper
        sx={{
          maxWidth: (theme) => theme.breakpoints.values.md,
          margin: 'auto',
          position: 'relative',
          left: 0,
          right: 0,
          top: -60,
        }}>
        <Stack direction='column' gap={2}>
          <Typography textAlign='center' variant='h2'>
            Administrer skjema
          </Typography>
          <Typography fontWeight={600} textAlign='center'>
            {title}
          </Typography>
          {form && id ? (
            <FormAdminComponent formId={id} />
          ) : (
            <Typography align='center' variant='h2'>
              Laster spørreskjema...
            </Typography>
          )}
        </Stack>
      </Paper>
    </Page>
  );
};

export default FormPage;
