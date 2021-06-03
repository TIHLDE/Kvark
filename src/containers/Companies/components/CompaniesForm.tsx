import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CompaniesEmail } from 'types/Types';
import { useMisc } from 'api/hooks/Misc';
import useSnackbar from 'api/hooks/Snackbar';
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
  const { postEmail } = useMisc();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, errors, reset, setError } = useForm<CompaniesEmail>();

  const submitForm = async (data: CompaniesEmail) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await postEmail(data);
      showSnackbar(response.detail, 'success');
      reset({ info: { bedrift: '', kontaktperson: '', epost: '' }, comment: '' } as CompaniesEmail);
    } catch (e) {
      setError('bedrift', { message: e.detail || 'Noe gikk galt' });
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
        <TextField
          disabled={isLoading}
          errors={errors}
          label='Bedrift'
          name='info.bedrift'
          register={register}
          required
          rules={{ required: 'Feltet er påkrevd' }}
        />
        <TextField
          disabled={isLoading}
          errors={errors}
          label='Kontaktperson'
          name='info.kontaktperson'
          register={register}
          required
          rules={{ required: 'Feltet er påkrevd' }}
        />
        <TextField
          disabled={isLoading}
          errors={errors}
          label='Epost'
          name='info.epost'
          register={register}
          required
          rules={{
            required: 'Feltet er påkrevd',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Ugyldig e-post',
            },
          }}
          type='email'
        />
        <Divider />
        <div className={classes.content}>
          <FormControl component='fieldset' disabled={isLoading} fullWidth margin='normal'>
            <FormLabel className={classes.label} component='legend'>
              Semester
            </FormLabel>
            <input name='time' ref={register} type='hidden' value='time' />
            <FormGroup>
              {semesters.map((semester) => (
                <FormControlLabel control={<Checkbox inputRef={register} name='time' value={semester} />} key={semester} label={semester} />
              ))}
            </FormGroup>
          </FormControl>
          <FormControl component='fieldset' disabled={isLoading} fullWidth margin='normal'>
            <FormLabel className={classes.label} component='legend'>
              Arrangementer
            </FormLabel>
            <input name='type' ref={register} type='hidden' value='type' />
            <FormGroup>
              {types.map((type) => (
                <FormControlLabel control={<Checkbox inputRef={register} name='type' value={type} />} key={type} label={type} />
              ))}
            </FormGroup>
          </FormControl>
        </div>
        <Divider />
        <TextField disabled={isLoading} errors={errors} label='Kommentar' multiline name='comment' register={register} rows={3} />
        <SubmitButton disabled={isLoading} errors={errors}>
          Send inn
        </SubmitButton>
      </form>
    </Paper>
  );
};

export default CompaniesForm;
