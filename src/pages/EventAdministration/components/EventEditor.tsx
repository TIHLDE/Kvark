import { SafetyDividerRounded } from '@mui/icons-material';
import { Box, Collapse, Grid, LinearProgress, ListSubheader, MenuItem, Stack, styled } from '@mui/material';
import { addHours, parseISO, setHours, startOfHour, subDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BaseGroup, Event, EventMutate, Group, PriorityPool, PriorityPoolMutate } from 'types';
import { GroupType, MembershipType } from 'types/Enums';
import Checkbox from '@mui/material/Checkbox';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';

import { useCategories } from 'hooks/Categories';
import { useCreateEvent, useDeleteEvent, useEventById, useUpdateEvent } from 'hooks/Event';
import { useGroupsByType } from 'hooks/Group';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser, useUserMemberships, useUserPermissions } from 'hooks/User';

import EventEditPriorityPools from 'pages/EventAdministration/components/EventEditPriorityPools';
import EventRenderer from 'pages/EventDetails/components/EventRenderer';

import Bool from 'components/inputs/Bool';
import DatePicker from 'components/inputs/DatePicker';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import { StandaloneExpand } from 'components/layout/Expand';
import VerifyDialog from 'components/layout/VerifyDialog';
import RendererPreview from 'components/miscellaneous/RendererPreview';
import { ShowMoreText, ShowMoreTooltip } from 'components/miscellaneous/UserInformation';
import { getValue } from '@mui/system';
import { TimePicker } from '@mui/lab';
import { formatMinutes } from 'components/inputs/TimePicker';

const Row = styled(Stack)(({ theme }) => ({
  gap: 0,
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
    flexDirection: 'row',
  },
}));

export type EventEditorProps = {
  eventId: number | null;
  goToEvent: (newEvent: number | null) => void;
};

type FormValues = Pick<
  Event,
  | 'only_allow_prioritized'
  | 'category'
  | 'description'
  | 'image'
  | 'image_alt'
  | 'is_paid_event'
  | 'price'
  | 'paytime'
  | 'limit'
  | 'location'
  | 'sign_up'
  | 'title'
  | 'can_cause_strikes'
  | 'enforces_previous_strikes'
> & {
  end_date: Date;
  end_registration_at: Date;
  organizer: Group['slug'];
  sign_off_deadline: Date;
  start_date: Date;
  start_registration_at: Date;
};
type GroupOption = { type: 'header'; header: string } | { type: 'group'; group: BaseGroup };

const EventEditor = ({ eventId, goToEvent }: EventEditorProps) => {
  const { data, isLoading } = useEventById(eventId || -1);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent(eventId || -1);
  const deleteEvent = useDeleteEvent(eventId || -1);
  const showSnackbar = useSnackbar();

  const [priorityPools, setPriorityPools] = useState<Array<PriorityPoolMutate>>([]);
  const { handleSubmit, register, watch, control, formState, getValues, reset, setValue } = useForm<FormValues>();
  const watchSignUp = watch('sign_up');
  const watchPaidEvent = watch('is_paid_event');
  const { data: categories = [] } = useCategories();

  const setValues = useCallback(
    (newValues: Event | null) => {
      setPriorityPools(newValues?.priority_pools.map((pool) => ({ groups: pool.groups.map((group) => group.slug) })) || []);
      reset({
        category: newValues?.category || 1,
        description: newValues?.description || '',
        end_date: newValues?.end_date ? parseISO(newValues.end_date) : new Date(),
        end_registration_at: newValues?.end_registration_at ? parseISO(newValues.end_registration_at) : new Date(),
        organizer: newValues?.organizer?.slug || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        limit: newValues?.limit || 0,
        location: newValues?.location || '',
        sign_off_deadline: newValues?.sign_off_deadline ? parseISO(newValues.sign_off_deadline) : new Date(),
        sign_up: newValues?.sign_up || false,
        start_date: newValues?.start_date ? parseISO(newValues.start_date) : new Date(),
        start_registration_at: newValues?.start_registration_at ? parseISO(newValues.start_registration_at) : new Date(),
        title: newValues?.title || '',
        only_allow_prioritized: newValues ? newValues.only_allow_prioritized : false,
        can_cause_strikes: newValues ? newValues.can_cause_strikes : true,
        enforces_previous_strikes: newValues ? newValues.enforces_previous_strikes : true,
      });
      if (!newValues) {
        setTimeout(() => updateDates(new Date()), 10);
      }
    },
    [reset],
  );

  /**
   * Update the form-data when the opened event changes
   */
  useEffect(() => {
    setValues(data || null);
  }, [data, setValues]);

  const { data: permissions } = useUserPermissions();
  const { data: userGroups } = useUserMemberships();
  const memberships = useMemo(() => (userGroups ? userGroups.pages.map((page) => page.results).flat() : []), [userGroups]);
  const { data: user } = useUser();
  const { data: groups, BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS } = useGroupsByType();

  const groupOptions = useMemo<Array<GroupOption>>(() => {
    if (!permissions) {
      return [];
    }
    if (permissions.permissions.event.write_all) {
      const array: Array<GroupOption> = [];
      if (BOARD_GROUPS.length) {
        array.push({ type: 'header', header: 'Hovedorgan' });
        BOARD_GROUPS.forEach((group) => array.push({ type: 'group', group }));
      }
      if (SUB_GROUPS.length) {
        array.push({ type: 'header', header: 'Undergrupper' });
        SUB_GROUPS.forEach((group) => array.push({ type: 'group', group }));
      }
      if (COMMITTEES.length) {
        array.push({ type: 'header', header: 'Komitéer' });
        COMMITTEES.forEach((group) => array.push({ type: 'group', group }));
      }
      if (INTERESTGROUPS.length) {
        array.push({ type: 'header', header: 'Interessegrupper' });
        INTERESTGROUPS.forEach((group) => array.push({ type: 'group', group }));
      }
      return array;
    }
    return memberships
      .filter((membership) => membership.membership_type === MembershipType.LEADER || [GroupType.BOARD, GroupType.SUBGROUP].includes(membership.group.type))
      .map((membership) => ({ type: 'group', group: membership.group }));
  }, [memberships, permissions, user, BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS]);

  const getEventPreview = (): Event => {
    const values = getValues();
    return {
      ...values,
      organizer: groups?.find((g) => g.slug === values.organizer) || null,
      list_count: 0,
      priority_pools: priorityPools.map((pool) => ({ groups: pool.groups.map((group) => groups?.find((g) => g.slug === group)) })) as Array<PriorityPool>,
      waiting_list_count: 0,
      end_date: values.end_date.toJSON(),
      end_registration_at: values.end_registration_at.toJSON(),
      sign_off_deadline: values.sign_off_deadline.toJSON(),
      start_date: values.start_date.toJSON(),
      start_registration_at: values.start_registration_at.toJSON(),
    } as Event;
  };

  const remove = async () => {
    deleteEvent.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        goToEvent(null);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const closeEvent = async () => {
    await updateEvent.mutate({ closed: true } as EventMutate, {
      onSuccess: () => {
        showSnackbar('Arrangementet ble stengt', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    const event = {
      ...data,
      priority_pools: priorityPools,
      end_date: data.end_date.toJSON(),
      end_registration_at: data.end_registration_at.toJSON(),
      sign_off_deadline: data.sign_off_deadline.toJSON(),
      start_date: data.start_date.toJSON(),
      start_registration_at: data.start_registration_at.toJSON(),
      is_paid_event: data.is_paid_event,
      paid_information: {
        price: data.price,
        paytime: formatMinutes(data.paytime ? data.paytime : 0)
      }
    } as unknown as EventMutate;
    if (eventId) {
      await updateEvent.mutate(event, {
        onSuccess: () => {
          showSnackbar('Arrangementet ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    } else {
      await createEvent.mutate(event, {
        onSuccess: (newEvent) => {
          showSnackbar('Arrangementet ble opprettet', 'success');
          goToEvent(newEvent.id);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    }
  };

  /**
   * Sets the dates of the event to a standarized structure compared to the start-date. Runned when start-date is changed.
   * Registration start -> 12:00, 7 days before start
   * Registration end -> 12:00, same day as start
   * Sign off deadline -> 12:00, 1 days start
   * End-date -> 2 hours after start
   * @param start The start-date
   */
  const updateDates = (start?: Date) => {
    if (start && start instanceof Date && !isNaN(start.valueOf())) {
      const getDate = (daysBefore: number, hour: number) =>
        startOfHour(setHours(subDays(start, daysBefore), daysBefore === 0 ? Math.min(hour, start.getHours()) : hour));
      setValue('start_registration_at', getDate(7, 12));
      setValue('end_registration_at', getDate(0, 12));
      setValue('sign_off_deadline', getDate(1, 12));
      setValue('end_date', addHours(start, 2));
    }
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container direction='column' wrap='nowrap'>
          <Row>
            <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi arrangementet en tittel' })} required />
            <TextField formState={formState} label='Sted' {...register('location', { required: 'Oppgi et sted for arrangementet' })} required />
          </Row>
          <Row>
            <DatePicker
              control={control}
              formState={formState}
              label='Start'
              name='start_date'
              onDateChange={updateDates}
              required
              rules={{ required: 'Feltet er påkrevd' }}
              type='date-time'
            />
            <DatePicker
              control={control}
              formState={formState}
              label='Slutt'
              name='end_date'
              required
              rules={{
                required: 'Feltet er påkrevd',
                validate: {
                  afterStartDate: (value) => value > getValues().start_date || 'Slutt på arrangement må være etter start på arrangement',
                },
              }}
              type='date-time'
            />
          </Row>
          <Bool control={control} formState={formState} label='Åpen for påmelding' name='sign_up' type='switch' />
          <Collapse in={watchSignUp}>
            <Row>
              <DatePicker
                control={control}
                formState={formState}
                label='Start påmelding'
                name='start_registration_at'
                required={watchSignUp}
                rules={{ required: watchSignUp ? 'Feltet er påkrevd' : undefined }}
                type='date-time'
              />
              <DatePicker
                control={control}
                formState={formState}
                label='Slutt påmelding'
                name='end_registration_at'
                required={watchSignUp}
                rules={{
                  required: watchSignUp ? 'Feltet er påkrevd' : undefined,
                  validate: {
                    beforeStartDate: (value) => value < getValues().start_date || !watchSignUp || 'Påmeldingsslutt må være før start på arrangement',
                    afterRegistrationStart: (value) =>
                      value > getValues().start_registration_at || !watchSignUp || 'Påmeldingsslutt må være etter påmeldingsstart',
                  },
                }}
                type='date-time'
              />
            </Row>
            <Row>
              <DatePicker
                control={control}
                formState={formState}
                helperText={
                  <ShowMoreText>Deltagere kan melde seg av etter fristen og helt frem til 2 timer før arrangementsstart, men vil da få 1 prikk.</ShowMoreText>
                }
                label='Avmeldingsfrist'
                name='sign_off_deadline'
                required={watchSignUp}
                rules={{
                  required: watchSignUp ? 'Feltet er påkrevd' : undefined,
                  validate: {
                    beforeStartDate: (value) => value < getValues().start_date || !watchSignUp || 'Avmeldingsfrist må være før start på arrangement',
                    afterRegistrationStart: (value) =>
                      value > getValues().start_registration_at || !watchSignUp || 'Avmeldingsfrist må være etter påmeldingsstart',
                  },
                }}
                type='date-time'
              />
              <TextField
                formState={formState}
                helperText={
                  <ShowMoreText>
                    Antall plasser på dette arrangementet. Når disse plassene er fyllt opp vil nye brukere som melder seg på havne på ventelisten, med mindre de
                    er prioriterte og en med plass ikke er prioritert. I såfall vil den nyligst påmeldte som ikke er prioritert bli satt på ventelisten.
                  </ShowMoreText>
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ inputMode: 'numeric' }}
                label='Antall plasser'
                {...register('limit', {
                  pattern: { value: RegExp(/^[0-9]*$/), message: 'Skriv inn et heltall som 0 eller høyere' },
                  valueAsNumber: true,
                  min: { value: 0, message: 'Antall plasser må være 0 eller høyere' },
                  required: watchSignUp ? 'Feltet er påkrevd' : undefined,
                })}
                required={watchSignUp}
              />
            </Row>
            <StandaloneExpand icon={<SafetyDividerRounded />} primary='Prioriteringer' sx={{ my: 1 }}>
              <EventEditPriorityPools priorityPools={priorityPools} setPriorityPools={setPriorityPools} />
            </StandaloneExpand>
            <Stack>
              <Bool
                control={control}
                formState={formState}
                label={
                  <>
                    Påmelding kun for prioriterte
                    <ShowMoreTooltip>
                      Bestemmer om kun prioriterte brukere skal kunne melde seg på arrangementet. Hvis bryteren er skrudd på kan kun brukere som er medlem av
                      minst én prioriteringsgruppe melde seg på dette arrangementet.
                    </ShowMoreTooltip>
                  </>
                }
                name='only_allow_prioritized'
                type='switch'
              />
              <Bool
                control={control}
                formState={formState}
                label={
                  <>
                    Gi prikker ved sen avmelding og ikke oppmøte
                    <ShowMoreTooltip>
                      Bestemmer om brukere skal kunne motta prikker ved å være påmeldt dette arrangementet. Hvis bryteren er skrudd av vil deltagere ikke få
                      prikk for ikke oppmøte eller for sen avmelding.
                    </ShowMoreTooltip>
                  </>
                }
                name='can_cause_strikes'
                type='switch'
              />
              <Bool
                control={control}
                formState={formState}
                label={
                  <>
                    Håndhev straff for prikker (sen påmeldinsstart og lavere prioritering)
                    <ShowMoreTooltip>
                      Denne bryteren styrer om brukeres aktive prikker skal håndheves ved påmelding. Det vil for eks. si at om bryteren er slått av så vil ikke
                      en bruker med 1 prikk måtte vente 3 timer før den kan melde seg på.
                    </ShowMoreTooltip>
                  </>
                }
                name='enforces_previous_strikes'
                type='switch'
              />
            </Stack>
          </Collapse>
          <MarkdownEditor formState={formState} {...register('description', { required: 'Gi arrangementet en beskrivelse' })} required />
          <ImageUpload formState={formState} label='Velg bilde' ratio='21:9' register={register('image')} setValue={setValue} watch={watch} />
          <TextField formState={formState} label='Bildetekst' {...register('image_alt')} />
          <Row>
            {groupOptions.length > 0 && (
              <Select
                control={control}
                formState={formState}
                helperText={
                  <ShowMoreText>
                    Arrangøren vises på arrangementssiden, samt bestemmer kolonne og farge på forsiden. Den bestemmer også hvilke brukere som har tilgang til å
                    endre arrangementet. Kun medlemmer av undergruppe/leder av komité eller interessegruppe som arrangerer et arrangement kan redigere det, se
                    påmeldte og legge til spørreskjemaer.
                  </ShowMoreText>
                }
                label='Arrangør (Gruppe)'
                name='organizer'
                required
                rules={{ required: 'Du må velge en arrangør' }}>
                {groupOptions.map((option) =>
                  option.type === 'header' ? (
                    <ListSubheader key={option.header}>{option.header}</ListSubheader>
                  ) : (
                    <MenuItem key={option.group.slug} value={option.group.slug}>
                      {option.group.name}
                    </MenuItem>
                  ),
                )}
              </Select>
            )}
            {Boolean(categories.length) && (
              <Select
                control={control}
                formState={formState}
                helperText={<ShowMoreText>Kategorien brukes til å la brukerne enklere finne arrangementer de ser etter.</ShowMoreText>}
                label='Kategori'
                name='category'>
                {categories.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.text}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Row>

          <Bool
            control={control}
            formState={formState}
            label={
              <>
                Betalt arrangement
                <ShowMoreTooltip>
                  Bestemmer om brukere skal kunne motta prikker ved å være påmeldt dette arrangementet. Hvis bryteren er skrudd av vil deltagere ikke få
                  prikk for ikke oppmøte eller for sen avmelding.
                </ShowMoreTooltip>
              </>
            }
            name='is_paid_event'
            type='checkbox'
          />

          {watchPaidEvent && (
            
            <Box>
              <TextField type="number" formState={formState} label='Pris' {...register('price', { required: 'Gi arrangementet en pris' })} />
              <TextField placeholder="Skriv inn antall minuttter" type="number" formState={formState} label='Betalingsfrist' {...register('paytime', { required: 'Gi arrangementet en betalingsfrist i minutter' })} />
            </Box>

          )}

          <RendererPreview getContent={getEventPreview} renderer={EventRenderer} sx={{ my: 2 }} />
          <SubmitButton disabled={isLoading || createEvent.isLoading || updateEvent.isLoading || deleteEvent.isLoading} formState={formState}>
            {eventId ? 'Oppdater arrangement' : 'Opprett arrangement'}
          </SubmitButton>
          {eventId !== null && (
            <Row sx={{ mt: 2 }}>
              <VerifyDialog
                closeText='Hei'
                color='warning'
                contentText='Å stenge et arrangement kan ikke reverseres. Eventuell på- og avmelding vil bli stoppet.'
                disabled={data?.closed}
                onConfirm={closeEvent}
                titleText='Test?'>
                Steng
              </VerifyDialog>
              <VerifyDialog
                closeText='Ikke slett arrangementet'
                color='error'
                contentText='Sletting av arrangementer kan ikke reverseres.'
                onConfirm={remove}
                titleText='Er du sikker?'>
                Slett
              </VerifyDialog>
            </Row>
          )}
        </Grid>
      </form>
    </>
  );
};

export default EventEditor;
