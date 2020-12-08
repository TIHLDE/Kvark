import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Category, Event, EventRequired, RegistrationPriority } from 'types/Types';
import { useEvent } from 'api/hooks/Event';
import { useMisc } from 'api/hooks/Misc';
import { useSnackbar } from 'api/hooks/Snackbar';
import MdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';
import { parseISO } from 'date-fns';

// Material-UI
import { makeStyles, Theme, MuiThemeProvider as ErrorTheme } from '@material-ui/core/styles';
import { errorTheme } from 'theme';
import TextField from '@material-ui/core/TextField';
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
    border: '1px solid ' + theme.palette.colors.border.main,
    background: theme.palette.colors.background.smoke,
  },
  switch: {
    color: theme.palette.colors.text.light,
  },
}));

export type EventEditorProps = {
  eventId: number | null;
  goToEvent: (newEvent: number | null) => void;
  setEvents: (newEvents: Array<Event> | ((prevEvents: Array<Event>) => Array<Event>)) => void;
};

type FormValues = {
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  image: string;
  image_alt: string;
  priority: number;
  category: number;
  limit: number;
  start_registration_at: string;
  end_registration_at: string;
  sign_off_deadline: string;
  evaluate_link: string;
};

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
  const description = useRef<MdEditor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [closeEventDialogOpen, setCloseEventDialogOpen] = useState(false);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [regPriorities, setRegPriorities] = useState<Array<RegistrationPriority>>([]);
  const { handleSubmit, register, control, errors, getValues, setError, reset } = useForm<FormValues>();
  const [categories, setCategories] = useState<Array<Category>>([]);

  const setValues = useCallback(
    (newValues: Event | null) => {
      description.current?.setText(newValues?.description || '');
      setSignUp(newValues?.sign_up || false);
      setRegPriorities(newValues?.registration_priorities || allPriorities);
      reset({
        category: newValues?.category || 1,
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
      description: description.current?.getMdValue() || '',
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
      description: description.current?.getMdValue() || '',
      registration_priorities: regPriorities,
    } as Event;
    if (event.sign_up) {
      if (parseISO(event.end_registration_at) < parseISO(event.start_registration_at)) {
        setError('end_registration_at', { type: 'manual', message: 'Påmeldingsslutt må være etter påmeldingsstart' });
        return;
      }
      if (parseISO(event.sign_off_deadline) < parseISO(event.start_registration_at)) {
        setError('sign_off_deadline', { type: 'manual', message: 'Avmeldingsfrist må være etter påmeldingsstart' });
        return;
      }
      if (parseISO(event.start_date) < parseISO(event.sign_off_deadline)) {
        setError('sign_off_deadline', { type: 'manual', message: 'Avmeldingsfrist må være før start' });
        return;
      }
      if (parseISO(event.start_date) < parseISO(event.end_registration_at)) {
        setError('end_registration_at', { type: 'manual', message: 'Påmeldingsslutt må være før start' });
        return;
      }
      if (parseISO(event.end_date) < parseISO(event.start_date)) {
        setError('end_date', { type: 'manual', message: 'Slutt må være etter start' });
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
            <Controller
              as={TextField}
              control={control}
              defaultValue=''
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              label='Tittel *'
              margin='normal'
              name='title'
              rules={{ required: 'Feltet er påkrevd' }}
              variant='outlined'
            />
            <Controller as={TextField} control={control} defaultValue='' label='Sted' margin='normal' name='location' variant='outlined' />
          </div>
          <div className={classes.grid}>
            <TextField
              defaultValue=''
              error={Boolean(errors.start_date)}
              helperText={errors.start_date?.message}
              InputLabelProps={{ shrink: true }}
              inputRef={register({ required: 'Feltet er påkrevd' })}
              label='Start *'
              margin='normal'
              name='start_date'
              type='datetime-local'
              variant='outlined'
            />
            <TextField
              defaultValue=''
              error={Boolean(errors.end_date)}
              helperText={errors.end_date?.message}
              InputLabelProps={{ shrink: true }}
              inputRef={register({ required: 'Feltet er påkrevd' })}
              label='Slutt *'
              margin='normal'
              name='end_date'
              type='datetime-local'
              variant='outlined'
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
                defaultValue=''
                error={Boolean(errors.start_registration_at)}
                helperText={errors.start_registration_at?.message}
                InputLabelProps={{ shrink: true }}
                inputRef={register}
                label='Start påmelding'
                margin='normal'
                name='start_registration_at'
                type='datetime-local'
                variant='outlined'
              />
              <TextField
                defaultValue=''
                error={Boolean(errors.end_registration_at)}
                helperText={errors.end_registration_at?.message}
                InputLabelProps={{ shrink: true }}
                inputRef={register}
                label='Slutt påmelding'
                margin='normal'
                name='end_registration_at'
                type='datetime-local'
                variant='outlined'
              />
            </div>
            <div className={classes.grid}>
              <TextField
                defaultValue=''
                error={Boolean(errors.sign_off_deadline)}
                helperText={errors.sign_off_deadline?.message}
                InputLabelProps={{ shrink: true }}
                inputRef={register}
                label='Avmeldingsfrist'
                margin='normal'
                name='sign_off_deadline'
                type='datetime-local'
                variant='outlined'
              />
              <TextField
                defaultValue='0'
                error={Boolean(errors.limit)}
                helperText={Boolean(errors.limit) && 'Antall plasser må være et positivt tall'}
                inputRef={register({ min: 0 })}
                label='Antall plasser'
                margin='normal'
                name='limit'
                type='number'
                variant='outlined'
              />
            </div>
            <Controller
              as={TextField}
              control={control}
              defaultValue=''
              fullWidth
              label='Evalueringsskjema-url'
              margin='normal'
              name='evaluate_link'
              variant='outlined'
            />
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
          <div className={classes.margin}>
            <MdEditor
              plugins={['header', 'font-bold', 'font-italic', 'list-unordered', 'list-ordered', 'block-wrap', 'link', 'mode-toggle']}
              ref={description}
              renderHTML={(text: string) => <ReactMarkdown source={text} />}
              style={{ height: 300 }}
            />
          </div>
          <div className={classes.grid}>
            <Controller as={TextField} control={control} defaultValue='' label='Bilde-url' margin='normal' name='image' variant='outlined' />
            <Controller as={TextField} control={control} defaultValue='' label='Bildetekst' margin='normal' name='image_alt' variant='outlined' />
          </div>
          <div className={classes.grid}>
            <Controller as={TextField} control={control} defaultValue='' label='Prioritering' margin='normal' name='priority' select variant='outlined'>
              {priorities.map((value, index) => (
                <MenuItem key={index} value={index}>
                  {value}
                </MenuItem>
              ))}
            </Controller>
            {categories.length && (
              <Controller as={TextField} control={control} defaultValue='' label='Kategori' margin='normal' name='category' select variant='outlined'>
                {categories.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.text}
                  </MenuItem>
                ))}
              </Controller>
            )}
          </div>
          <EventPreview className={classes.margin} getEvent={getEventPreview} />
          <Button className={classes.margin} color='primary' disabled={isLoading} type='submit' variant='contained'>
            {eventId ? 'Oppdater arrangement' : 'Opprett arrangement'}
          </Button>
          {Boolean(eventId) && (
            <div className={classes.grid}>
              <ErrorTheme theme={errorTheme}>
                <Button className={classes.margin} color='primary' disabled={isLoading} onClick={() => setCloseEventDialogOpen(true)} variant='outlined'>
                  Steng
                </Button>
                <Button className={classes.margin} color='primary' disabled={isLoading} onClick={() => setDeleteEventDialogOpen(true)} variant='outlined'>
                  Slett
                </Button>
              </ErrorTheme>
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
