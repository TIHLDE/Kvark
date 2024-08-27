import { zodResolver } from '@hookform/resolvers/zod';
import { SelectGroup } from '@radix-ui/react-select';
import { addHours, parseISO, setHours, startOfHour, subDays } from 'date-fns';
import { Info } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { BaseGroup, Category, Event, EventMutate, PriorityPool, PriorityPoolMutate } from 'types';
import { GroupType, MembershipType } from 'types/Enums';

import { useCategories } from 'hooks/Categories';
import { useCreateEvent, useDeleteEvent, useEventById, useUpdateEvent } from 'hooks/Event';
import { useGroupsByType } from 'hooks/Group';
import { useUser, useUserMemberships, useUserPermissions } from 'hooks/User';

import EventEditPriorityPools from 'pages/EventAdministration/components/EventEditPriorityPools';
import EventRenderer from 'pages/EventDetails/components/EventRenderer';

import BoolExpand from 'components/inputs/BoolExpand';
import DateTimePicker from 'components/inputs/DateTimePicker';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import { FormImageUpload } from 'components/inputs/Upload';
import { SingleUserSearch } from 'components/inputs/UserSearch';
import RendererPreview from 'components/miscellaneous/RendererPreview';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import Expandable from 'components/ui/expandable';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'components/ui/select';
import { Switch } from 'components/ui/switch';

import CloseEvent from './CloseEvent';
import DeleteEvent from './DeleteEvent';
import EventEditorSkeleton from './EventEditorSkeleton';

export type EventEditorProps = {
  eventId: number | null;
  goToEvent: (newEvent: number | null) => void;
};

type GroupOption =
  | {
      type: 'header';
      header: string;
    }
  | {
      type: 'group';
      group: BaseGroup;
    };

const formSchema = z
  .object({
    category: z.string({ required_error: 'Du må velge en kategori' }).min(1, { message: 'Du må velge en kategori' }),
    description: z.string().min(1, { message: 'Beskrivelsen kan ikke være tom' }),
    end_date: z.date(),
    end_registration_at: z.date(),
    organizer: z.string().min(1, { message: 'Du må velge en arrangør' }),
    image: z.string(),
    image_alt: z.string(),
    limit: z.number().min(0, { message: 'Antall plasser må være 0 eller høyere' }),
    location: z.string().min(1, { message: 'Stedet kan ikke være tomt' }),
    sign_up: z.boolean(),
    sign_off_deadline: z.date(),
    start_date: z.date(),
    start_registration_at: z.date(),
    title: z.string().min(1, { message: 'Tittelen kan ikke være tom' }),
    only_allow_prioritized: z.boolean(),
    can_cause_strikes: z.boolean(),
    enforces_previous_strikes: z.boolean(),
    is_paid_event: z.boolean(),
    price: z.number().optional(),
    paytime: z.string().optional(),
    contact_person: z.object({ user_id: z.string() }).nullable(),
    emojis_allowed: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.sign_up && data.end_registration_at <= data.start_registration_at) {
      ctx.addIssue({
        message: 'Påmeldingsslutt må være etter påmeldingsstart',
        path: ['end_registration_at'],
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.end_date <= data.start_date) {
      ctx.addIssue({
        message: 'Sluttdato må være etter startdato',
        path: ['end_date'],
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.is_paid_event && data.price && data.price < 10) {
      ctx.addIssue({
        message: 'Prisen må være 10 eller høyere',
        path: ['price'],
        code: z.ZodIssueCode.custom,
      });
    }
  });

const EventEditor = ({ eventId, goToEvent }: EventEditorProps) => {
  const { data, isLoading } = useEventById(eventId || -1);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent(eventId || -1);
  const deleteEvent = useDeleteEvent(eventId || -1);
  const isUpdating = useMemo(
    () => createEvent.isLoading || updateEvent.isLoading || deleteEvent.isLoading,
    [createEvent.isLoading, updateEvent.isLoading, deleteEvent.isLoading],
  );

  const [priorityPools, setPriorityPools] = useState<Array<PriorityPoolMutate>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: data?.category.toString() || '',
      description: data?.description || '',
      end_date: data?.end_date ? parseISO(data.end_date) : new Date(),
      end_registration_at: data?.end_registration_at ? parseISO(data.end_registration_at) : new Date(),
      organizer: data?.organizer?.slug || '',
      image: data?.image || '',
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
      paytime: '02:00',
      contact_person: data?.contact_person || null,
      emojis_allowed: data?.emojis_allowed || false,
    },
  });

  const { data: categories = [] } = useCategories();

  const setValues = useCallback(
    (newValues: Event | null) => {
      setPriorityPools(newValues?.priority_pools.map((pool) => ({ groups: pool.groups.map((group) => group.slug) })) || []);
      const category = newValues?.category as unknown as Category;
      form.reset({
        category: category?.id.toString() || '',
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
        is_paid_event: newValues?.is_paid_event || false,
        price: (newValues?.paid_information?.price && parseInt(newValues.paid_information.price.toString())) || 0,
        paytime: '02:00',
        contact_person: newValues?.contact_person || null,
        emojis_allowed: newValues?.emojis_allowed || false,
      });
      if (!newValues) {
        setTimeout(() => updateDates(new Date()), 10);
      }
    },
    [form.reset],
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

  const getEventPreview = (): Event | null => {
    const title = form.getValues('title');
    const description = form.getValues('description');

    if (!title && !description) {
      return null;
    }

    const values = form.getValues();
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
    } as Event;
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const event = {
      ...values,
      priority_pools: priorityPools,
      end_date: values.end_date.toJSON(),
      end_registration_at: values.end_registration_at.toJSON(),
      sign_off_deadline: values.sign_off_deadline.toJSON(),
      start_date: values.start_date.toJSON(),
      start_registration_at: values.start_registration_at.toJSON(),
      is_paid_event: values.is_paid_event,
      paid_information: values.is_paid_event
        ? {
            price: values.price,
            paytime: '02:00',
          }
        : undefined,
      contact_person: values.contact_person?.user_id || null,
      emojis_allowed: values.emojis_allowed,
    } as unknown as EventMutate;

    if (eventId) {
      updateEvent.mutate(event, {
        onSuccess: () => {
          toast.success('Arrangementet ble oppdatert');
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    } else {
      createEvent.mutate(event, {
        onSuccess: (newEvent) => {
          toast.success('Arrangementet ble opprettet');
          goToEvent(newEvent.id);
        },
        onError: (e) => {
          toast.error(e.detail);
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
      form.setValue('start_registration_at', getDate(7, 12));
      form.setValue('end_registration_at', getDate(0, 12));
      form.setValue('sign_off_deadline', getDate(1, 12));
      form.setValue('end_date', addHours(start, 2));
    }
  };

  const getCategoryValue = (value: string): string => {
    const category = categories.find((category) => category.id === parseInt(value));
    if (category) {
      return category.id.toString();
    }
    return '';
  };

  const getCategoryName = (value: string): string => {
    const category = categories.find((category) => category.id === parseInt(value));
    if (category) {
      return category.text;
    }
    return 'Kategori';
  };

  const getGroupName = (slug: string): string => {
    const group = groups?.find((group) => group.slug === slug);
    return group ? group.name : 'Gruppe';
  };

  if (isLoading) {
    return <EventEditorSkeleton />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Tittel <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Sted <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <DateTimePicker form={form} label='Start' name='start_date' onDateChange={updateDates} required />

              <DateTimePicker form={form} label='Slutt' name='end_date' required />
            </div>

            <BoolExpand description='Bestem start og slutt for påmelding' form={form} name='sign_up' title='Påmelding'>
              <div className='space-y-4'>
                <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
                  <DateTimePicker form={form} label='Start påmelding' name='start_registration_at' required />

                  <DateTimePicker form={form} label='Slutt påmelding' name='end_registration_at' required />
                </div>

                <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
                  <DateTimePicker form={form} label='Avmeldingsfrist' name='sign_off_deadline' required />

                  <FormField
                    control={form.control}
                    name='limit'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>
                          Antall plasser <span className='text-red-300'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type='number' {...field} onChange={(event) => field.onChange(parseInt(event.target.value))} placeholder='0' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='only_allow_prioritized'
                    render={({ field }) => (
                      <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Kun prioriterte</FormLabel>
                          <FormDescription>Kun personer som er prioriterte får melde seg på</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='can_cause_strikes'
                    render={({ field }) => (
                      <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Kan gi prikker</FormLabel>
                          <FormDescription>Deltakelse kan gi prikker</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='enforces_previous_strikes'
                    render={({ field }) => (
                      <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Håndhev prikker</FormLabel>
                          <FormDescription>Håndhev straff fra prikker fra tidligere arrangementer</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Expandable description='Bestem hvilke grupper som skal prioriteres' icon={<Info />} title='Prioriterte grupper'>
                  <EventEditPriorityPools priorityPools={priorityPools} setPriorityPools={setPriorityPools} />
                </Expandable>
              </div>
            </BoolExpand>

            <MarkdownEditor form={form} label='Innhold' name='description' required />

            <FormImageUpload form={form} label='Velg bilde' name='image' ratio='21:9' />

            <FormField
              control={form.control}
              name='image_alt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternativ bildetekst</FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <FormField
                control={form.control}
                name='organizer'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Arrangør <span className='text-red-300'>*</span>
                    </FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={getGroupName(field.value)} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groupOptions.map((option, index) => (
                          <Fragment key={index}>
                            <SelectGroup>
                              {option.type === 'header' ? (
                                <SelectLabel>{option.header}</SelectLabel>
                              ) : (
                                <SelectItem value={option.group.slug}>{option.group.name}</SelectItem>
                              )}
                            </SelectGroup>
                          </Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Kategori <span className='text-red-300'>*</span>
                    </FormLabel>
                    <Select
                      // defaultValue={getCategoryValue(field.value)} onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={getCategoryValue(field.value)}
                      onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={getCategoryName(field.value)} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={category.id.toString()}>
                            {category.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <BoolExpand description='Bestem en pris hvis du ønsker et betalt arrangement' form={form} name='is_paid_event' title='Betalt arrangement'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pris <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(event) => field.onChange(parseInt(event.target.value))} placeholder='0' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </BoolExpand>

            <FormField
              control={form.control}
              name='emojis_allowed'
              render={({ field }) => (
                <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Reaksjoner</FormLabel>
                    <FormDescription>La brukere reagere på nyheten med emojis</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <SingleUserSearch className='w-full' form={form} label='Kontaktperson' name='contact_person' />

            <div className='space-y-2 md:flex md:items-center md:justify-end md:space-x-4 md:space-y-0 pt-6'>
              <DeleteEvent deleteEvent={remove} eventId={eventId} />
              <CloseEvent closeEvent={closeEvent} eventId={eventId} />
              <RendererPreview getContent={getEventPreview} renderer={EventRenderer} />
              <Button className='w-full md:w-48 block' disabled={isUpdating} type='submit'>
                {eventId ? 'Oppdater arrangement' : 'Opprett arrangement'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EventEditor;
