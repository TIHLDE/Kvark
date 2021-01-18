import { useCallback, useState, useEffect } from 'react';
import classnames from 'classnames';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Category, Event, EventRequired, RegistrationPriority } from 'types/Types';
import { useEvent } from 'api/hooks/Event';
import { useMisc } from 'api/hooks/Misc';
import { useSnackbar } from 'api/hooks/Snackbar';
import { parseISO } from 'date-fns';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Project components
import EventRegistrationPriorities from 'containers/EventAdministration/components/EventRegistrationPriorities';
import EventPreview from 'containers/EventAdministration/components/EventPreview';
import Dialog from 'components/layout/Dialog';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import Select from 'components/inputs/Select';
import TextField from 'components/inputs/TextField';

const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('sm')]: {
      gridGap: 0,
      gridTemplateColumns: '1fr',
    },
  },
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  expansionPanel: {
    border: '1px solid ' + theme.palette.divider,
    background: theme.palette.background.smoke,
  },
  switch: {
    color: theme.palette.text.secondary,
  },
  red: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
}));

export type EventEditorProps = {
  eventId: number | null;
  goToEvent: (newEvent: number | null) => void;
  setEvents: (newEvents: Array<Event> | ((prevEvents: Array<Event>) => Array<Event>)) => void;
};

type FormValues = Pick<
  Event,
  | 'category'
  | 'description'
  | 'end_date'
  | 'end_registration_at'
  | 'evaluate_link'
  | 'image'
  | 'image_alt'
  | 'limit'
  | 'location'
  | 'priority'
  | 'sign_off_deadline'
  | 'start_date'
  | 'start_registration_at'
  | 'title'
>;

const priorities = ['Lav', 'Middels', 'Høy'];

const allPriorities = [
  { user_class: 1, user_study: 1 },
  { user_class: 1, user_study: 2 },
  { user_class: 1, user_study: 3 },
  { user_class: 1, user_study: 5 },
  { user_class: 2, user_study: 1 },
  { user_class: 2, user_study: 2 },
  { user_class: 2, user_study: 3 },
  { user_class: 2, user_study: 5 },
  { user_class: 3, user_study: 1 },
  { user_class: 3, user_study: 2 },
  { user_class: 3, user_study: 3 },
  { user_class: 3, user_study: 5 },
  { user_class: 4, user_study: 4 },
  { user_class: 5, user_study: 4 },
];

const EventEditor = ({ eventId, goToEvent, setEvents }: EventEditorProps) => {
  const classes = useStyles();
  const { getEventById, updateEvent, createEvent, deleteEvent } = useEvent();
  const { getCategories } = useMisc();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [closeEventDialogOpen, setCloseEventDialogOpen] = useState(false);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [regPriorities, setRegPriorities] = useState<Array<RegistrationPriority>>([]);
  const { handleSubmit, register, control, errors, getValues, setError, reset } = useForm<FormValues>();
  const [categories, setCategories] = useState<Array<Category>>([]);

  const setValues = useCallback(
    (newValues: Event | null) => {
      setSignUp(newValues?.sign_up || false);
      setRegPriorities(newValues?.registration_priorities || allPriorities);
      reset({
        category: newValues?.category || 1,
        description: newValues?.description || '',
        end_date: newValues?.end_date.substring(0, 16) || new Date().toISOString().substring(0, 16),
        end_registration_at: newValues?.end_registration_at.substring(0, 16) || new Date().toISOString().substring(0, 16),
        evaluate_link: newValues?.evaluate_link || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        limit: newValues?.limit || 0,
        location: newValues?.location || '',
        priority: newValues?.priority || 2,
        sign_off_deadline: newValues?.sign_off_deadline.substring(0, 16) || new Date().toISOString().substring(0, 16),
        start_date: newValues?.start_date.substring(0, 16) || new Date().toISOString().substring(0, 16),
        start_registration_at: newValues?.start_registration_at.substring(0, 16) || new Date().toISOString().substring(0, 16),
        title: newValues?.title || '',
      });
    },
    [reset],
  );

  const getEventPreview = () => {
    return {
      ...getValues(),
      sign_up: signUp,
      list_count: 0,
      registration_priorities: regPriorities,
      waiting_list_count: 0,
    } as Event;
  };

  useEffect(() => {
    if (eventId) {
      getEventById(Number(eventId))
        .then((data) => setValues(data))
        .catch(() => goToEvent(null));
    } else {
      setValues(null);
    }
  }, [eventId, getEventById, setValues, goToEvent]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, [getCategories]);

  const create = (event: EventRequired) => {
    setIsLoading(true);
    createEvent(event)
      .then((data) => {
        setEvents((events) => [data, ...events]);
        goToEvent(data.id);
        showSnackbar('Arrangementet ble opprettet', 'success');
      })
      .catch((e) => showSnackbar(e.detail, 'error'))
      .finally(() => setIsLoading(false));
  };

  const update = (event: Partial<Event>) => {
    setIsLoading(true);
    updateEvent(Number(eventId), event)
      .then((data) => {
        goToEvent(data.id);
        setEvents((events) =>
          events.map((eventItem) => {
            let returnValue = { ...eventItem };
            if (eventItem.id === data.id) {
              returnValue = data;
            }
            return returnValue;
          }),
        );
        showSnackbar('Arrangementet ble oppdatert', 'success');
      })
      .catch((e) => showSnackbar(e.detail, 'error'))
      .finally(() => setIsLoading(false));
  };

  const remove = () => {
    deleteEvent(Number(eventId))
      .then((data) => {
        setEvents((events) => events.filter((eventItem) => eventItem.id !== Number(eventId)));
        goToEvent(null);
        showSnackbar(data.detail, 'success');
      })
      .catch((e) => showSnackbar(e.detail, 'error'))
      .finally(() => setDeleteEventDialogOpen(false));
  };

  const closeEvent = () => {
    update({ closed: true });
    setCloseEventDialogOpen(false);
  };

  const submit: SubmitHandler<FormValues> = (data) => {
    const event = {
      ...data,
      sign_up: signUp,
      registration_priorities: regPriorities,
    } as Event;
    if (event.sign_up) {
      if (parseISO(event.end_registration_at) < parseISO(event.start_registration_at)) {
        setError('end_registration_at', { message: 'Påmeldingsslutt må være etter påmeldingsstart' });
        return;
      }
      if (parseISO(event.sign_off_deadline) < parseISO(event.start_registration_at)) {
        setError('sign_off_deadline', { message: 'Avmeldingsfrist må være etter påmeldingsstart' });
        return;
      }
      if (parseISO(event.start_date) < parseISO(event.sign_off_deadline)) {
        setError('sign_off_deadline', { message: 'Avmeldingsfrist må være før start' });
        return;
      }
      if (parseISO(event.start_date) < parseISO(event.end_registration_at)) {
        setError('end_registration_at', { message: 'Påmeldingsslutt må være før start' });
        return;
      }
      if (parseISO(event.end_date) < parseISO(event.start_date)) {
        setError('end_date', { message: 'Slutt må være etter start' });
        return;
      }
    }
    if (eventId) {
      update(event);
    } else {
      create(event);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container direction='column' wrap='nowrap'>
          <div className={classes.grid}>
            <TextField errors={errors} label='Tittel' name='title' register={register} required rules={{ required: 'Feltet er påkrevd' }} />
            <TextField errors={errors} label='Sted' name='location' register={register} />
          </div>
          <div className={classes.grid}>
            <TextField
              errors={errors}
              InputLabelProps={{ shrink: true }}
              label='Start'
              name='start_date'
              register={register}
              required
              rules={{ required: 'Feltet er påkrevd' }}
              type='datetime-local'
            />
            <TextField
              errors={errors}
              InputLabelProps={{ shrink: true }}
              label='Slutt'
              name='end_date'
              register={register}
              required
              rules={{ required: 'Feltet er påkrevd' }}
              type='datetime-local'
            />
          </div>
          <FormControlLabel
            className={classes.switch}
            control={<Switch checked={signUp} color='primary' onChange={(e) => setSignUp(e.target.checked)} />}
            label='Åpen for påmelding'
          />
          <Collapse in={signUp}>
            <div className={classes.grid}>
              <TextField
                errors={errors}
                InputLabelProps={{ shrink: true }}
                label='Start påmelding'
                name='start_registration_at'
                register={register}
                required={signUp}
                rules={{ required: signUp ? 'Feltet er påkrevd' : undefined }}
                type='datetime-local'
              />
              <TextField
                errors={errors}
                InputLabelProps={{ shrink: true }}
                label='Start påmelding'
                name='end_registration_at'
                register={register}
                required={signUp}
                rules={{ required: signUp ? 'Feltet er påkrevd' : undefined }}
                type='datetime-local'
              />
            </div>
            <div className={classes.grid}>
              <TextField
                errors={errors}
                InputLabelProps={{ shrink: true }}
                label='Avmeldingsfrist'
                name='sign_off_deadline'
                register={register}
                required={signUp}
                rules={{ required: signUp ? 'Feltet er påkrevd' : undefined }}
                type='datetime-local'
              />
              <TextField
                errors={errors}
                InputLabelProps={{ shrink: true }}
                inputProps={{ inputMode: 'numeric' }}
                label='Antall plasser'
                name='limit'
                register={register}
                required={signUp}
                rules={{
                  pattern: { value: RegExp(/^[0-9]*$/), message: 'Skriv inn et heltall som 0 eller høyere' },
                  valueAsNumber: true,
                  min: { value: 0, message: 'Antall plasser må være 0 eller høyere' },
                  required: signUp ? 'Feltet er påkrevd' : undefined,
                }}
              />
            </div>
            <TextField errors={errors} label='Evalueringsskjema (url)' name='evaluate_link' register={register} />
            <div className={classes.margin}>
              <ExpansionPanel className={classes.expansionPanel}>
                <ExpansionPanelSummary aria-controls='priorities' expandIcon={<ExpandMoreIcon />} id='priorities-header'>
                  <Typography>Prioriterte</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <EventRegistrationPriorities priorities={regPriorities} setPriorities={setRegPriorities} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </Collapse>
          <MarkdownEditor
            error={Boolean(errors.description)}
            helperText={Boolean(errors.description) && 'Gi arrengementet en beskrivelse'}
            inputRef={register({ required: true })}
            name='description'
          />
          <div className={classes.grid}>
            <TextField errors={errors} label='Bilde-url' name='image' register={register} />
            <TextField errors={errors} label='Bildetekst' name='image_alt' register={register} />
          </div>
          <div className={classes.grid}>
            <Select control={control} errors={errors} label='Prioritering' name='priority'>
              {priorities.map((value, index) => (
                <MenuItem key={index} value={index}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {Boolean(categories.length) && (
              <Select control={control} errors={errors} label='Kategori' name='category'>
                {categories.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.text}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <EventPreview className={classes.margin} getEvent={getEventPreview} />
          <Button className={classes.margin} color='primary' disabled={isLoading} type='submit' variant='contained'>
            {eventId ? 'Oppdater arrangement' : 'Opprett arrangement'}
          </Button>
          {Boolean(eventId) && (
            <div className={classes.grid}>
              <Button className={classnames(classes.margin, classes.red)} disabled={isLoading} onClick={() => setCloseEventDialogOpen(true)} variant='outlined'>
                Steng
              </Button>
              <Button
                className={classnames(classes.margin, classes.red)}
                disabled={isLoading}
                onClick={() => setDeleteEventDialogOpen(true)}
                variant='outlined'>
                Slett
              </Button>
            </div>
          )}
        </Grid>
      </form>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Å stenge et arrangement kan ikke reverseres. Eventuell på- og avmelding vil bli stoppet.'
        onClose={() => setCloseEventDialogOpen(false)}
        onConfirm={closeEvent}
        open={closeEventDialogOpen}
        titleText='Er du sikker?'
      />
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Sletting av arrangementer kan ikke reverseres.'
        onClose={() => setDeleteEventDialogOpen(false)}
        onConfirm={remove}
        open={deleteEventDialogOpen}
        titleText='Er du sikker?'
      />
    </>
  );
};

export default EventEditor;
