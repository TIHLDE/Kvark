import { ComponentType, useState } from 'react';
import { Event, User } from 'types/Types';
import URLS from 'URLS';
import { getUserStudyShort, shortDownString } from 'utils';
import { useCreateEventRegistration } from 'api/hooks/Event';
import { useSnackbar } from 'api/hooks/Snackbar';

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

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoPaper: {
    padding: theme.spacing(2),
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
};

const EventRegistration = ({ event, user }: EventRegistrationProps) => {
  const classes = useStyles();
  const createRegistration = useCreateEventRegistration(event.id);
  const showSnackbar = useSnackbar();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionsAnswered, setQuestionsAnswered] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [allowPhoto, setAllowPhoto] = useState(true);
  const allergy = user.allergy ? shortDownString(user.allergy, 20) : 'Ingen';

  const register = async () => {
    setIsLoading(true);
    await createRegistration.mutate(
      { allow_photo: allowPhoto },
      {
        onSuccess: () => {
          showSnackbar('Påmeldingen var vellykket', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
    setIsLoading(false);
  };

  return (
    <>
      <div className={classes.list}>
        <Typography>
          Vennligst se over at følgende opplysninger stemmer. Dine opplysninger vil bli delt med TIHLDE. Du kan endre informasjonen i profilen din, også etter
          påmelding!
        </Typography>
        <div className={classes.list}>
          <Paper className={classes.infoPaper} noPadding>
            <ListItem icon={PersonIcon} text={'Navn: ' + user.first_name + ' ' + user.last_name} />
            <ListItem icon={MailIcon} text={'Epost: ' + user.email} />
            <ListItem icon={SchoolIcon} text={'Studieprogram: ' + getUserStudyShort(user.user_study)} />
            <ListItem icon={HomeIcon} text={'Klasse: ' + user.user_class} />
            <ListItem icon={AllergyIcon} text={'Allergier: ' + allergy} />
          </Paper>
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
          <Button
            className={classes.button}
            color='primary'
            disabled={isLoading || !agreeRules || !questionsAnswered}
            fullWidth
            onClick={register}
            variant='contained'>
            Meld deg på
          </Button>
        </div>
      </div>
    </>
  );
};

export default EventRegistration;
