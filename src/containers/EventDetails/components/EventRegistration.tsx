import { ComponentType, useState } from 'react';
import { Event, User, TextFieldSubmission, SelectFieldSubmission } from 'types/Types';
import { FormFieldType } from 'types/Enums';
import URLS from 'URLS';
import { getUserStudyShort, shortDownString } from 'utils';
import { useCreateEventRegistration } from 'api/hooks/Event';
import { useFormById } from 'api/hooks/Form';
import { useSnackbar } from 'api/hooks/Snackbar';
import { useForm } from 'react-hook-form';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Typography, FormControlLabel, Checkbox, Button } from '@material-ui/core';

// Icons
import PersonIcon from '@material-ui/icons/PersonOutlineRounded';
import MailIcon from '@material-ui/icons/MailOutlineRounded';
import AllergyIcon from '@material-ui/icons/FastfoodRounded';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';

// Project components
import Paper from 'components/layout/Paper';
import FormView from 'components/forms/FormView';

const useStyles = makeStyles((theme) => ({
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
};

const EventRegistration = ({ event, user }: EventRegistrationProps) => {
  const classes = useStyles();
  const createRegistration = useCreateEventRegistration(event.id);
  const showSnackbar = useSnackbar();
  const { data: form, isLoading: isFormLoading } = useFormById(event.survey || '-');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [allowPhoto, setAllowPhoto] = useState(true);
  const allergy = user.allergy ? shortDownString(user.allergy, 20) : 'Ingen';

  const { register, handleSubmit, formState, setError } = useForm();

  const registerDisabled = isLoading || isFormLoading || !agreeRules;

  const submit = async (data: { answers?: Array<TextFieldSubmission | SelectFieldSubmission> }) => {
    if (registerDisabled) {
      showSnackbar('Du må godkjenne arrangementsreglene før du kan melde deg på', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      data.answers?.forEach((answer, index) => {
        const field = form?.fields.find((field) => field.id === answer.field);
        if (field && field.type === FormFieldType.MULTIPLE_SELECT && field.required) {
          const ans = answer as SelectFieldSubmission;
          if (!ans.selected_options || !ans.selected_options.length) {
            throw new Error(`answers.${index}.selected_options`);
          }
        }
      });
    } catch (e) {
      setError(e.message, { message: 'Du må velge ett eller flere alternativ' });
      setIsLoading(false);
    }
    createRegistration.mutate(
      { allow_photo: allowPhoto, ...data },
      {
        onSuccess: () => {
          showSnackbar('Påmeldingen var vellykket', 'success');
          window.gtag('event', 'registered', {
            event_category: 'event-registration',
            event_label: `Registered for event: ${event.title}`,
          });
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
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
          {form !== undefined && (
            <Paper className={classes.infoPaper}>
              <Typography variant='h3'>Spørsmål</Typography>
              <FormView form={form} formState={formState} register={register} />
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
          <Button className={classes.button} disabled={registerDisabled} fullWidth type='submit' variant='contained'>
            Meld deg på
          </Button>
        </form>
      </div>
    </>
  );
};

export default EventRegistration;
