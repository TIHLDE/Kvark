import { useEventById } from 'hooks/Event';
import { FormType } from 'types/Enums';

// Material-UI
import { styled, Typography, LinearProgress, Stack, Button } from '@mui/material';

// Project
import Expand from 'components/layout/Expand';
import FormAnswers from 'components/forms/FormAnswers';
import FormStatistics from 'components/forms/FormStatistics';
import FormEditor from 'components/forms/FormEditor';
import { useFormById } from 'hooks/Form';
import { useEffect } from 'react';

export type FormProps = {
  formId: string | undefined;
  goToForm: (newForm: string | null) => void;
};

const Expansion = styled(Expand)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.smoke,
}));

const FormAdmin = ({ goToForm, formId }: FormProps) => {
  const { data: form, isError, isLoading } = useFormById(formId || '-');

  useEffect(() => {
    !isError || goToForm(null);
  }, [isError]);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!formId) {
    return (
      <Button fullWidth variant='outlined'>
        Opprett skjema
      </Button>
    );
  }

  return (
    <Stack gap={2}>
      <div>
        <Typography variant='h3'>Spørsmål ved påmelding</Typography>
        <Typography variant='caption'>
          Deltagere som melder seg på dette arrangementet vil måtte svare på disse spørsmålene først. Deltagerne kan la være å svare på spørsmål som ikke er
          &quot;Påkrevd&quot;.
        </Typography>
        {form && (
          <>
            <Expansion flat header='Rediger spørsmål' sx={{ mt: 1 }}>
              <FormEditor form={form} />{' '}
            </Expansion>
            <Expansion flat header='Sammendrag av flervalgsspørsmål'>
              <FormStatistics formId={form.id} />
            </Expansion>
            <Expansion flat header='Alle svar'>
              <FormAnswers formId={form.id} />
            </Expansion>
          </>
        )}
      </div>
    </Stack>
  );
};

export default FormAdmin;
