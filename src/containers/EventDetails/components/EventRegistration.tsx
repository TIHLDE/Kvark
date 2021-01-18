import { ComponentType, useState } from 'react';
import { Event, Registration, User, EventForm, TextFieldSubmission, SelectFieldSubmission } from 'types/Types';
import { FormType, FormFieldType } from 'types/Enums';
import URLS from 'URLS';
import { getUserStudyShort, shortDownString } from 'utils';
import { useEvent } from 'api/hooks/Event';
import { useSnackbar } from 'api/hooks/Snackbar';
import { useForm } from 'react-hook-form';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

// Icons
import PersonIcon from '@material-ui/icons/PersonOutlineRounded';
import MailIcon from '@material-ui/icons/MailOutlineRounded';
import AllergyIcon from '@material-ui/icons/FastfoodRounded';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';

// Project components
import Paper from 'components/layout/Paper';
import FormView from 'components/forms/FormView';

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoPaper: {
    margin: theme.spacing(1, 0),
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    height: 50,
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
  },
}));

type ListItemProps = {
  icon: ComponentType<{ className: string }>;
  text: string;
};

const ListItem = ({ icon: Icon, text }: ListItemProps) => {
  const classes = useStyles();
  return (
    <div className={classes.listItem}>
      <Icon className={classes.icon} />
      <Typography>{text}</Typography>
    </div>
  );
};

export type EventRegistrationProps = {
  event: Event;
  user: User;
  setRegistration: (registration: Registration) => void;
};

const EventRegistration = ({ event, user, setRegistration }: EventRegistrationProps) => {
  const classes = useStyles();
  const { createRegistration } = useEvent();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [allowPhoto, setAllowPhoto] = useState(true);
  const allergy = user.allergy ? shortDownString(user.allergy, 20) : 'Ingen';

  const form: EventForm = {
    title: 'Halla',
    type: FormType.SURVEY,
    hidden: false,
    event: event.id,
    id: 'form id',
    fields: [
      {
        title: 'Hva er stjernetegnet ditt?',
        type: FormFieldType.TEXT_ANSWER,
        required: true,
        id: 'field_1_id',
      },
      {
        id: 'field_2_id',
        title: 'Hvor gammel er du?',
        type: FormFieldType.SINGLE_SELECT,
        required: false,
        options: [
          {
            id: 'option_id_2.1',
            text: '20 eller yngre',
          },
          {
            id: 'option id 2.2',
            text: 'Over 20',
          },
        ],
      },
      {
        id: 'field_3_id',
        title: 'Hva vil du ha å spise?',
        type: FormFieldType.MULTIPLE_SELECT,
        required: true,
        options: [
          {
            id: 'option_id_3.1',
            text: 'Pizza',
          },
          {
            id: 'option_id_3.2',
            text: 'Sushi',
          },
        ],
      },
    ],
  };

  const { register, handleSubmit, errors, setError } = useForm();

  const submit = (data: { answers: Array<TextFieldSubmission | SelectFieldSubmission> }) => {
    setIsLoading(true);
    let errorsNo = 0;
    data.answers.forEach((answer, index) => {
      const field = form.fields.find((field) => field.id === answer.field);
      if (field && field.type === FormFieldType.MULTIPLE_SELECT && field.required) {
        const ans = answer as SelectFieldSubmission;
        if (!ans.selected_options.length) {
          setError(`answers[${index}].selected_options`, { type: 'manual', message: 'Du må velge ett eller flere alternativ' });
          errorsNo++;
        }
      }
    });
    if (errorsNo) {
      setIsLoading(false);
      return;
    }
    createRegistration(event.id, { allow_photo: allowPhoto, ...data })
      .then((registration) => {
        setRegistration(registration);
        showSnackbar('Påmeldingen var vellykket', 'success');
      })
      .catch((error) => {
        showSnackbar(error.detail, 'error');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className={classes.list}>
        <Typography>
          Vennligst se over at følgende opplysninger stemmer. Dine opplysninger vil bli delt med TIHLDE. Du kan endre informasjonen i profilen din, også etter
          påmelding!
        </Typography>
        <form className={classes.list} onSubmit={handleSubmit(submit)}>
          <Paper className={classes.infoPaper}>
            <ListItem icon={PersonIcon} text={'Navn: ' + user.first_name + ' ' + user.last_name} />
            <ListItem icon={MailIcon} text={'Epost: ' + user.email} />
            <ListItem icon={SchoolIcon} text={'Studieprogram: ' + getUserStudyShort(user.user_study)} />
            <ListItem icon={HomeIcon} text={'Klasse: ' + user.user_class} />
            <ListItem icon={AllergyIcon} text={'Allergier: ' + allergy} />
          </Paper>
          {Boolean(form.fields.length) && (
            <Paper className={classes.infoPaper}>
              <Typography variant='h3'>Spørsmål</Typography>
              <FormView errors={errors} form={form} register={register} />
            </Paper>
          )}
          <FormControlLabel
            control={<Checkbox checked={allowPhoto} onChange={(e) => setAllowPhoto(e.target.checked)} />}
            disabled={isLoading}
            label='Jeg godtar at bilder av meg kan deles på TIHLDE sine plattformer'
          />
          <FormControlLabel
            control={<Checkbox checked={agreeRules} onChange={(e) => setAgreeRules(e.target.checked)} />}
            disabled={isLoading}
            label='Jeg godtar arrangementsreglene'
          />
          <a href={URLS.eventRules} rel='noopener noreferrer' target='_blank'>
            <Typography variant='caption'>Les arrangementsreglene her (åpnes i ny fane)</Typography>
          </a>
          <Button className={classes.button} color='primary' disabled={isLoading || !agreeRules} fullWidth type='submit' variant='contained'>
            Meld deg på
          </Button>
        </form>
      </div>
    </>
  );
};

export default EventRegistration;
