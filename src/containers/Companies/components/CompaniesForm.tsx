import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CompaniesEmail } from 'types/Types';
import API from 'api/api';
import { useSnackbar } from 'api/hooks/Snackbar';
import addMonths from 'date-fns/addMonths';
import { EMAIL_REGEX } from 'constant';

// Material UI Components
import { Divider, Stack } from '@material-ui/core';

// Project components
import Paper from 'components/layout/Paper';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import BoolArray from 'components/inputs/BoolArray';
import { useGoogleAnalytics } from 'api/hooks/Utils';

const CompaniesForm = () => {
  const { event } = useGoogleAnalytics();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { register, control, handleSubmit, formState, getValues, reset, setError } = useForm<CompaniesEmail>();

  const submitForm = async (data: CompaniesEmail) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await API.emailForm(data);
      event('submit-form', 'companies', `Company: ${data.info.bedrift}`);
      showSnackbar(response.detail, 'success');
      reset({ info: { bedrift: '', kontaktperson: '', epost: '' }, comment: '' } as CompaniesEmail);
    } catch (e) {
      setError('info.bedrift', { message: e.detail || 'Noe gikk galt' });
    } finally {
      setIsLoading(false);
    }
  };

  const getSemester = (semester: number) => {
    const date = addMonths(new Date(), 1);
    let dateMonth = date.getMonth() + semester * 6;
    let dateYear = date.getFullYear();
    while (dateMonth > 11) {
      dateMonth -= 12;
      dateYear++;
    }
    const returnMonth = dateMonth > 5 ? 'Høst' : 'Vår';
    return `${returnMonth} ${dateYear}`;
  };

  const semesters = useMemo(() => [...Array(4).keys()].map(getSemester), []);
  const types = ['Bedriftspresentasjon', 'Kurs/Workshop', 'Bedriftsbesøk', 'Annonse', 'Insta-takeover', 'Annet'];

  return (
    <Paper>
      <form onSubmit={handleSubmit(submitForm)}>
        <TextField disabled={isLoading} formState={formState} label='Bedrift' {...register('info.bedrift', { required: 'Feltet er påkrevd' })} required />
        <TextField
          disabled={isLoading}
          formState={formState}
          label='Kontaktperson'
          {...register('info.kontaktperson', { required: 'Feltet er påkrevd' })}
          required
        />
        <TextField
          disabled={isLoading}
          formState={formState}
          label='Epost'
          {...register('info.epost', {
            required: 'Feltet er påkrevd',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Ugyldig e-post',
            },
          })}
          required
          type='email'
        />
        <Divider />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ p: 2 }}>
          <BoolArray
            control={control}
            formState={formState}
            getValues={getValues}
            label='Semester'
            name='time'
            options={semesters.map((s) => ({ value: s, label: s }))}
            type='checkbox'
          />
          <BoolArray
            control={control}
            formState={formState}
            getValues={getValues}
            label='Arrangementer'
            name='type'
            options={types.map((t) => ({ value: t, label: t }))}
            type='checkbox'
          />
        </Stack>
        <Divider />
        <TextField disabled={isLoading} formState={formState} label='Kommentar' multiline {...register('comment')} rows={3} />
        <SubmitButton disabled={isLoading} formState={formState}>
          Send inn
        </SubmitButton>
      </form>
    </Paper>
  );
};

export default CompaniesForm;
