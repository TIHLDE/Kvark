import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CompaniesEmail } from 'types/Types';
import API from 'api/api';
import { useSnackbar } from 'api/hooks/Snackbar';
import addMonths from 'date-fns/addMonths';
import { EMAIL_REGEX } from 'constant';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Project components
import Paper from 'components/layout/Paper';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(2),
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
      padding: theme.spacing(1),
      gridGap: theme.spacing(1),
    },
  },
  label: {
    color: theme.palette.text.primary,
  },
}));

const CompaniesForm = () => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState, reset, setError } = useForm<CompaniesEmail>();

  const submitForm = async (data: CompaniesEmail) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await API.emailForm(data);
      window.gtag('event', 'submit-form', {
        event_category: 'companies',
        event_label: `Company: ${data.info.bedrift}`,
      });
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
        <div className={classes.content}>
          <FormControl component='fieldset' disabled={isLoading} fullWidth margin='normal'>
            <FormLabel className={classes.label} component='legend'>
              Semester
            </FormLabel>
            <input {...register('time')} type='hidden' value='time' />
            <FormGroup>
              {semesters.map((semester) => {
                const semesterRef = register('time');
                return (
                  <FormControlLabel
                    control={<Checkbox inputRef={semesterRef.ref} name={semesterRef.name} value={semester} />}
                    key={semester}
                    label={semester}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
          <FormControl component='fieldset' disabled={isLoading} fullWidth margin='normal'>
            <FormLabel className={classes.label} component='legend'>
              Arrangementer
            </FormLabel>
            <input {...register('type')} type='hidden' value='type' />
            <FormGroup>
              {types.map((type) => {
                const typeRef = register('type');
                return <FormControlLabel control={<Checkbox inputRef={typeRef.ref} name={typeRef.name} value={type} />} key={type} label={type} />;
              })}
            </FormGroup>
          </FormControl>
        </div>
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
