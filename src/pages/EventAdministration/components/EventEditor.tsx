import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import RendererPreview from '~/components/miscellaneous/RendererPreview';
import { Card, CardContent } from '~/components/ui/card';
import Expandable from '~/components/ui/expandable';
import { useCategories } from '~/hooks/Categories';
import { useCreateEvent, useDeleteEvent, useEventById, useUpdateEvent } from '~/hooks/Event';
import { useGroupsByType } from '~/hooks/Group';
import { useUserMemberships, useUserPermissions } from '~/hooks/User';
import EventRenderer from '~/pages/EventDetails/components/EventRenderer';
import type { Event, EventMutate, PriorityPool, PriorityPoolMutate } from '~/types';
import { GroupType, MembershipType } from '~/types/Enums';
import { addHours, parseISO, setHours, startOfHour, subDays } from 'date-fns';
import { InfoIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import CloseEvent from './CloseEvent';
import DeleteEvent from './DeleteEvent';
import EventEditorSkeleton from './EventEditorSkeleton';
import EventEditPriorityPools from './EventEditPriorityPools';

export type EventEditorProps = {
  eventId: number | null;
  goToEvent: (newEvent: number | null) => void;
};

const formSchema = z
  .object({
    category: z.string().min(1),
    description: z.string().min(1),
    end_date: z.date(),
    end_registration_at: z.date(),
    organizer: z.string().min(1),
    image: z.string(),
    image_alt: z.string(),
    limit: z.number().min(0),
    location: z.string().min(1),
    sign_up: z.boolean(),
    sign_off_deadline: z.date(),
    start_date: z.date(),
    start_registration_at: z.date(),
    title: z.string().min(1),
    only_allow_prioritized: z.boolean(),
    can_cause_strikes: z.boolean(),
    enforces_previous_strikes: z.boolean(),
    is_paid_event: z.boolean(),
    price: z.number().optional(),
    contact_person: z.string().optional(),
    emojis_allowed: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.sign_up && data.end_registration_at <= data.start_registration_at) {
      ctx.addIssue({ message: 'Påmeldingsslutt må være etter påmeldingsstart', path: ['end_registration_at'], code: z.ZodIssueCode.custom });
    }
    if (data.end_date <= data.start_date) {
      ctx.addIssue({ message: 'Sluttdato må være etter startdato', path: ['end_date'], code: z.ZodIssueCode.custom });
    }
    if (data.is_paid_event && data.price && data.price < 10) {
      ctx.addIssue({ message: 'Prisen må være 10 eller høyere', path: ['price'], code: z.ZodIssueCode.custom });
    }
  });

type FormValues = z.infer<typeof formSchema>;

const EventEditor = ({ eventId, goToEvent }: EventEditorProps) => {
  const { data, isLoading } = useEventById(eventId || -1);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent(eventId || -1);
  const deleteEvent = useDeleteEvent(eventId || -1);

  const [priorityPools, setPriorityPools] = useState<Array<PriorityPoolMutate>>([]);

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      onSubmit: formSchema,
    },
    defaultValues: {
      category: data?.category?.toString() || '',
      description: data?.description || '',
      end_date: data?.end_date ? parseISO(data.end_date) : new Date(),
      end_registration_at: data?.end_registration_at ? parseISO(data.end_registration_at) : new Date(),
      organizer: data?.organizer?.slug || '',
      image: data?.image ?? '',
      image_alt: data?.image_alt || '',
      limit: data?.limit || 0,
      location: data?.location || '',
      sign_off_deadline: data?.sign_off_deadline ? parseISO(data.sign_off_deadline) : new Date(),
      sign_up: data?.sign_up || false,
      start_date: data?.start_date ? parseISO(data.start_date) : new Date(),
      start_registration_at: data?.start_registration_at ? parseISO(data.start_registration_at) : new Date(),
      title: data?.title || '',
      only_allow_prioritized: data ? data.only_allow_prioritized : false,
      can_cause_strikes: data ? data.can_cause_strikes : true,
      enforces_previous_strikes: data ? data.enforces_previous_strikes : true,
      is_paid_event: data?.is_paid_event || false,
      price: data?.paid_information?.price,
      contact_person: data?.contact_person?.user_id || '',
      emojis_allowed: data?.emojis_allowed || false,
    } as FormValues,

    async onSubmit({ value }) {
      const event = {
        ...value,
        priority_pools: priorityPools,
        end_date: value.end_date.toJSON(),
        end_registration_at: value.end_registration_at.toJSON(),
        sign_off_deadline: value.sign_off_deadline.toJSON(),
        start_date: value.start_date.toJSON(),
        start_registration_at: value.start_registration_at.toJSON(),
        is_paid_event: value.is_paid_event,
        paid_information: value.is_paid_event ? { price: value.price, paytime: '02:00' } : undefined,
        contact_person: value.contact_person || null,
        emojis_allowed: value.emojis_allowed,
      } as unknown as EventMutate;

      if (eventId) {
        await updateEvent.mutateAsync(event, {
          onSuccess: () => {
            toast.success('Arrangementet ble oppdatert');
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        });
      } else {
        await createEvent.mutateAsync(event, {
          onSuccess: (newEvent) => {
            toast.success('Arrangementet ble opprettet');
            goToEvent(newEvent.id);
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        });
      }
    },
  });

  const { data: categories = [] } = useCategories();

  const updateDates = useCallback(
    (start?: Date) => {
      if (start && start instanceof Date && !isNaN(start.valueOf())) {
        const getDate = (daysBefore: number, hour: number) =>
          startOfHour(setHours(subDays(start, daysBefore), daysBefore === 0 ? Math.min(hour, start.getHours()) : hour));
        form.setFieldValue('start_registration_at', getDate(7, 12));
        form.setFieldValue('end_registration_at', getDate(0, 12));
        form.setFieldValue('sign_off_deadline', getDate(1, 12));
        form.setFieldValue('end_date', addHours(start, 2));
      }
    },
    [form],
  );

  useEffect(() => {
    if (data) {
      setPriorityPools(data.priority_pools.map((pool) => ({ groups: pool.groups.map((group) => group.slug) })));
    } else {
      setPriorityPools([]);
      setTimeout(() => updateDates(new Date()), 10);
    }
    form.reset();
  }, [data, form, updateDates]);

  const { data: permissions } = useUserPermissions();
  const { data: userGroups } = useUserMemberships();
  const memberships = useMemo(() => (userGroups ? userGroups.pages.map((page) => page.results).flat() : []), [userGroups]);
  const { data: groups, BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS } = useGroupsByType();

  const [groupOptions, groupOptionGroups] = useMemo(() => {
    if (!permissions) {
      return [[], []];
    }

    const options: { groupId?: string; value: string; content: React.ReactNode }[] = [];
    const groupOptions: { id: string; label: string }[] = [];

    if (BOARD_GROUPS.length) {
      groupOptions.push({ id: 'hovedorgan', label: 'Hovedorgan' });
      options.push(
        ...BOARD_GROUPS.map((group) => ({
          groupId: 'hovedorgan',
          value: group.slug,
          content: group.name,
        })),
      );
    }

    if (SUB_GROUPS.length) {
      groupOptions.push({ id: 'undergrupper', label: 'Undergrupper' });
      options.push(
        ...SUB_GROUPS.map((group) => ({
          groupId: 'undergrupper',
          value: group.slug,
          content: group.name,
        })),
      );
    }

    if (COMMITTEES.length) {
      groupOptions.push({ id: 'komiteer', label: 'Komitéer' });
      options.push(
        ...COMMITTEES.map((group) => ({
          groupId: 'komiteer',
          value: group.slug,
          content: group.name,
        })),
      );
    }

    if (INTERESTGROUPS.length) {
      groupOptions.push({ id: 'interessegrupper', label: 'Interessegrupper' });
      options.push(
        ...INTERESTGROUPS.map((group) => ({
          groupId: 'interessegrupper',
          value: group.slug,
          content: group.name,
        })),
      );
    }
    if (!permissions.permissions.event.write_all) {
      const relevantMemberships = memberships.filter(
        (membership) => membership.membership_type === MembershipType.LEADER || [GroupType.BOARD, GroupType.SUBGROUP].includes(membership.group.type),
      );

      const userOptions = options.filter((option) => {
        return relevantMemberships.some((membership) => membership.group.slug === option.value);
      });
      const userGroupOptions = groupOptions.filter((group) => userOptions.some((option) => option.groupId === group.id));

      return [userOptions, userGroupOptions];
    }
    return [options, groupOptions];
  }, [memberships, permissions, BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS]);

  const getEventPreview = (): Event | null => {
    const { title: previewTitle, description: previewDescription } = form.state.values as FormValues;

    if (!previewTitle && !previewDescription) {
      return null;
    }

    const values = form.state.values as FormValues;
    return {
      ...values,
      category: parseInt(values.category),
      organizer: groups?.find((g) => g.slug === values.organizer) || null,
      list_count: 0,
      priority_pools: priorityPools.map((pool) => ({ groups: pool.groups.map((group) => groups?.find((g) => g.slug === group)) })) as Array<PriorityPool>,
      waiting_list_count: 0,
      end_date: values.end_date.toJSON(),
      end_registration_at: values.end_registration_at.toJSON(),
      sign_off_deadline: values.sign_off_deadline.toJSON(),
      start_date: values.start_date.toJSON(),
      start_registration_at: values.start_registration_at.toJSON(),
      contact_person: values.contact_person,
      emojis_allowed: values.emojis_allowed,
      paid_information: {
        price: values?.price,
      },
    } as unknown as Event;
  };

  const remove = () => {
    deleteEvent.mutate(null, {
      onSuccess: (data) => {
        toast.success(data.detail);
        goToEvent(null);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const closeEvent = () => {
    updateEvent.mutate({ closed: true } as EventMutate, {
      onSuccess: () => {
        toast.success('Arrangementet ble stengt');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  if (isLoading || (!data && eventId)) {
    return <EventEditorSkeleton />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
          <div className='w-full grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2'>
            <form.AppField name='title'>{(field) => <field.InputField label='Tittel' placeholder='Skriv her...' required />}</form.AppField>
            <form.AppField name='location'>{(field) => <field.InputField label='Sted' placeholder='Skriv her...' required />}</form.AppField>
          </div>

          <div className='w-full grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2'>
            <form.AppField name='start_date'>{(field) => <field.DateTimeField label='Start' required onDateChange={updateDates} />}</form.AppField>
            <form.AppField name='end_date'>{(field) => <field.DateTimeField label='Slutt' required />}</form.AppField>
          </div>

          <form.AppField name='sign_up'>
            {(field) => (
              <field.BoolExpand title='Påmelding' description='Bestem start og slutt for påmelding'>
                <div className='w-full grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2'>
                  <form.AppField name='start_registration_at'>{(field) => <field.DateTimeField label='Start påmelding' required />}</form.AppField>
                  <form.AppField name='end_registration_at'>{(field) => <field.DateTimeField label='Slutt påmelding' required />}</form.AppField>
                </div>
                <div className='w-full grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2'>
                  <form.AppField name='sign_off_deadline'>{(field) => <field.DateTimeField label='Avmeldingsfrist' required />}</form.AppField>
                  <form.AppField name='limit'>{(field) => <field.InputField label='Antall plasser' type='number' placeholder='0' required />}</form.AppField>
                </div>
                <form.AppField name='only_allow_prioritized'>
                  {(field) => <field.SwitchField label='Kun prioriterte' description='Kun personer som er prioriterte får melde seg på' />}
                </form.AppField>
                <form.AppField name='can_cause_strikes'>
                  {(field) => <field.SwitchField label='Kan gi prikker' description='Deltakelse kan gi prikker' />}
                </form.AppField>
                <form.AppField name='enforces_previous_strikes'>
                  {(field) => <field.SwitchField label='Håndhev prikker' description='Håndhev straff fra prikker fra tidligere arrangementer' />}
                </form.AppField>
                <Expandable description='Bestem hvilke grupper som skal prioriteres' icon={<InfoIcon />} title='Prioriterte grupper'>
                  <EventEditPriorityPools priorityPools={priorityPools} setPriorityPools={setPriorityPools} />
                </Expandable>
              </field.BoolExpand>
            )}
          </form.AppField>

          <form.AppField name='description'>{(field) => <field.TextareaField label='Innhold' required />}</form.AppField>

          <form.AppField name='image'>{(field) => <field.ImageUploadField label='Velg bilde' />}</form.AppField>

          <form.AppField name='image_alt'>{(field) => <field.InputField label='Alternativ bildetekst' placeholder='Skriv her...' />}</form.AppField>

          <div className='w-full grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2'>
            <form.AppField name='organizer'>
              {(field) => <field.SelectField label='Arrangør' placeholder='Velg arrangør' required options={groupOptions} group={groupOptionGroups} />}
            </form.AppField>

            <form.AppField name='category'>
              {(field) => (
                <field.SelectField
                  label='Kategori'
                  placeholder='Velg kategori'
                  required
                  options={categories.map((category) => ({
                    value: category.id.toString(),
                    content: category.text,
                  }))}
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name='is_paid_event'>
            {(field) => (
              <field.BoolExpand title='Betalt arrangement' description='Bestem en pris hvis du ønsker et betalt arrangement'>
                <form.AppField name='price'>{(field) => <field.InputField label='Pris' placeholder='0' type='number' required />}</form.AppField>
              </field.BoolExpand>
            )}
          </form.AppField>

          <form.AppField name='emojis_allowed'>{(field) => <field.SwitchField label='Raksjoner' description='La brukere reagere med emojis' />}</form.AppField>

          {/* <SingleUserSearch className='w-full' form={form} label='Kontaktperson' name='contact_person' /> */}
          <div className='space-y-2 md:flex md:items-center md:justify-end md:space-x-4 md:space-y-0 pt-6'>
            <DeleteEvent deleteEvent={remove} eventId={eventId} />
            <CloseEvent closeEvent={closeEvent} eventId={eventId} />
            <RendererPreview getContent={getEventPreview} renderer={EventRenderer} />
            <form.AppForm>
              <form.SubmitButton loading={eventId ? 'Oppdaterer arrangement...' : 'Oppretter arrangement...'} className='w-full md:w-48 block'>
                {eventId ? 'Oppdater arrangement' : 'Opprett arrangement'}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventEditor;
