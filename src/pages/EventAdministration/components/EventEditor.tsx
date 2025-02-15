import { zodResolver } from '@hookform/resolvers/zod';
import { SelectGroup } from '@radix-ui/react-select';
import { addDays, addHours, format, parseISO, setHours, startOfHour, subDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cn } from 'lib/utils';
import { CalendarIcon, Info } from 'lucide-react';
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
import DateTimeRangePicker from 'components/inputs/DateTimeRangePicker';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import { FormImageUpload } from 'components/inputs/Upload';
import { SingleUserSearch } from 'components/inputs/UserSearch';
import RendererPreview from 'components/miscellaneous/RendererPreview';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'components/ui/select';
import { Switch } from 'components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import CloseEvent from './CloseEvent';
import DeleteEvent from './DeleteEvent';
import EventEditorSkeleton from './EventEditorSkeleton';

export type EventEditorProps = {
  eventId: number | null;
  goToEvent: (newEvent: number | null) => void;
};

// const formSchema = z
//   .object({
//     category: z.string({ required_error: 'Du må velge en kategori' }).min(1, { message: 'Du må velge en kategori' }),
//     description: z.string().min(1, { message: 'Beskrivelsen kan ikke være tom' }),
//     end_date: z.date(),
//     end_registration_at: z.date(),
//     organizer: z.string().min(1, { message: 'Du må velge en arrangør' }),
//     image: z.string(),
//     image_alt: z.string(),
//     limit: z.number().min(0, { message: 'Antall plasser må være 0 eller høyere' }),
//     location: z.string().min(1, { message: 'Stedet kan ikke være tomt' }),
//     sign_up: z.boolean(),
//     sign_off_deadline: z.date(),
//     start_date: z.date(),
//     start_registration_at: z.date(),
//     title: z.string().min(1, { message: 'Tittelen kan ikke være tom' }),
//     only_allow_prioritized: z.boolean(),
//     can_cause_strikes: z.boolean(),
//     enforces_previous_strikes: z.boolean(),
//     is_paid_event: z.boolean(),
//     price: z.number().optional(),
//     paytime: z.string().optional(),
//     contact_person: z.object({ user_id: z.string() }).nullable(),
//     emojis_allowed: z.boolean(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.sign_up && data.end_registration_at <= data.start_registration_at) {
//       ctx.addIssue({
//         message: 'Påmeldingsslutt må være etter påmeldingsstart',
//         path: ['end_registration_at'],
//         code: z.ZodIssueCode.custom,
//       });
//     }

//     if (data.end_date <= data.start_date) {
//       ctx.addIssue({
//         message: 'Sluttdato må være etter startdato',
//         path: ['end_date'],
//         code: z.ZodIssueCode.custom,
//       });
//     }

//     if (data.is_paid_event && data.price && data.price < 10) {
//       ctx.addIssue({
//         message: 'Prisen må være 10 eller høyere',
//         path: ['price'],
//         code: z.ZodIssueCode.custom,
//       });
//     }
//   });

const formSchema = z.object({
  title: z.string().nonempty({ message: 'Tittelen kan ikke være tom' }),
  location: z.string().nonempty({ message: 'Stedet kan ikke være tomt' }),
  timePeriod: z.object({
    from: z.date(),
    to: z.date(),
  }),

  signUp: z.discriminatedUnion('enabled', [
    z.object({ enabled: z.literal(false) }),
    z.object({
      enabled: z.literal(true),
      registrationPeriod: z.object({
        from: z.date(),
        to: z.date(),
      }),
      signOffDeadline: z.date(),

      options: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('simple'),
          limit: z.coerce.number().positive(),
        }),
        z.object({
          type: z.literal('advanced'),
          
          allowNonPrioritized: z.discriminatedUnion('enabled', [
            z.object({ enabled: z.literal(false) }),
            z.object({
              enabled: z.literal(true),
              fillRemainingAfter: z.date(),
            }),
          ]),
        }),
      ]),
    }),
  ]),

  description: z.string().nonempty({ message: 'Beskrivelsen kan ikke være tom' }),
  banner: z.string(),
  bannerAlt: z.string(),

  organizer: z.string().nonempty({ message: 'Du må velge en arrangør' }),
  category: z.coerce.number({ required_error: 'Du må velge en kategori' }),

  paid: z.discriminatedUnion('enabled', [
    z.object({ enabled: z.literal(false) }),
    z.object({
      enabled: z.literal(true),
      price: z.coerce.number().min(10, { message: 'Prisen må være 10kr eller høyere' }),
    }),
  ]),

  reactions: z.boolean(),

  contactPerson: z.object({ user_id: z.string() }).nullable(),
});

const EventEditor = ({ eventId, goToEvent }: EventEditorProps) => {
  const { data, isLoading } = useEventById(eventId || -1);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent(eventId || -1);
  const deleteEvent = useDeleteEvent(eventId || -1);
  const { data: permissions } = useUserPermissions();
  const { data: userGroups } = useUserMemberships();
  const memberships = useMemo(() => (userGroups ? userGroups.pages.map((page) => page.results).flat() : []), [userGroups]);
  const { data: user } = useUser();
  const { data: groups, BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS } = useGroupsByType();
  const { data: categories = [] } = useCategories();

  const isUpdating = useMemo(
    () => createEvent.isLoading || updateEvent.isLoading || deleteEvent.isLoading,
    [createEvent.isLoading, updateEvent.isLoading, deleteEvent.isLoading],
  );

  // const [priorityPools, setPriorityPools] = useState<Array<PriorityPoolMutate>>([]);

  // TODO: Implement import of event data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      timePeriod: undefined,
      signUp: {
        enabled: false,
      },
      description: '',
      banner: '',
      bannerAlt: '',

      organizer: '',
      category: undefined,

      paid: { enabled: false },

      reactions: false,
      contactPerson: null,
    },
  });

  // const setValues = useCallback(
  //   (newValues: Event | null) => {
  //     setPriorityPools(newValues?.priority_pools.map((pool) => ({ groups: pool.groups.map((group) => group.slug) })) || []);
  //     const category = newValues?.category as unknown as Category;
  //     form.reset({
  //       category: category?.id.toString() || '',
  //       description: newValues?.description || '',
  //       end_date: newValues?.end_date ? parseISO(newValues.end_date) : new Date(),
  //       end_registration_at: newValues?.end_registration_at ? parseISO(newValues.end_registration_at) : new Date(),
  //       organizer: newValues?.organizer?.slug || '',
  //       image: newValues?.image || '',
  //       image_alt: newValues?.image_alt || '',
  //       limit: newValues?.limit || 0,
  //       location: newValues?.location || '',
  //       sign_off_deadline: newValues?.sign_off_deadline ? parseISO(newValues.sign_off_deadline) : new Date(),
  //       sign_up: newValues?.sign_up || false,
  //       start_date: newValues?.start_date ? parseISO(newValues.start_date) : new Date(),
  //       start_registration_at: newValues?.start_registration_at ? parseISO(newValues.start_registration_at) : new Date(),
  //       title: newValues?.title || '',
  //       only_allow_prioritized: newValues ? newValues.only_allow_prioritized : false,
  //       can_cause_strikes: newValues ? newValues.can_cause_strikes : true,
  //       enforces_previous_strikes: newValues ? newValues.enforces_previous_strikes : true,
  //       is_paid_event: newValues?.is_paid_event || false,
  //       price: (newValues?.paid_information?.price && parseInt(newValues.paid_information.price.toString())) || 0,
  //       paytime: '02:00',
  //       contact_person: newValues?.contact_person || null,
  //       emojis_allowed: newValues?.emojis_allowed || false,
  //     });
  //     if (!newValues) {
  //       setTimeout(() => updateDates(new Date()), 10);
  //     }
  //   },
  //   [form.reset],
  // );

  // /**
  //  * Update the form-data when the opened event changes
  //  */
  // useEffect(() => {
  //   setValues(data || null);
  // }, [data, setValues]);

  const groupOptions = useMemo<Record<string, BaseGroup[]>>(() => {
    if (!permissions) {
      return {};
    }

    if (permissions.permissions.event.write_all) {
      return {
        Hovedorgan: BOARD_GROUPS ?? [],
        Undergrupper: SUB_GROUPS ?? [],
        Komitéer: COMMITTEES ?? [],
        Interessegrupper: INTERESTGROUPS ?? [],
      } as Record<string, BaseGroup[]>;
    }

    return {
      'Dine grupper': memberships.filter((membership) => membership.membership_type === MembershipType.LEADER).map((membership) => membership.group),
    };
  }, [memberships, permissions, user, BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS]);

  const getGroupName = (slug: string): string => {
    const group = groups?.find((group) => group.slug === slug);
    return group ? group.name : 'Gruppe';
  };

  const getEventPreview = (): Event | null => {
    const title = form.getValues('title');
    const description = form.getValues('description');

    if (!title && !description) {
      return null;
    }
    const values = form.getValues();
    return {
      title: values.title,
      location: values.location,
      start_date: values.timePeriod.from.toJSON(),
      end_date: values.timePeriod.to.toJSON(),

      // TODO: Implement signUp
      signUp: {
        enabled: false,
        // startRegistrationAt: new Date(),
      },

      description: values.description,
      image: values.banner,
      image_alt: values.bannerAlt,
      organizer: groups?.find((g) => g.slug === values.organizer) || null,
      category: values.category,

      is_paid_event: values.paid.enabled,
      price: values.paid.enabled ? values.paid.price : null,
      paid_information: values.paid.enabled && {
        paytime: '02:00',
        price: values.paid.price,
      },
      emojis_allowed: values.reactions,
      contactPerson: null,

      list_count: 0,
      priority_pools: [],
      waiting_list_count: 0,
      closed: false,
      end_registration_at: data?.end_registration_at ? parseISO(data.end_registration_at) : new Date(),
      limit: data?.limit || 0,
      sign_off_deadline: data?.sign_off_deadline ? parseISO(data.sign_off_deadline) : new Date(),
      sign_up: data?.sign_up || false,
      start_registration_at: data?.start_registration_at ? parseISO(data.start_registration_at) : new Date(),
      only_allow_prioritized: data ? data.only_allow_prioritized : false,
      can_cause_strikes: data ? data.can_cause_strikes : true,
      enforces_previous_strikes: data ? data.enforces_previous_strikes : true,
      contact_person: data?.contact_person || null,
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('values:', values);

    // if (eventId) {
    //   updateEvent.mutate(event, {
    //     onSuccess: () => {
    //       toast.success('Arrangementet ble oppdatert');
    //     },
    //     onError: (e) => {
    //       toast.error(e.detail);
    //     },
    //   });
    // } else {
    //   createEvent.mutate(event, {
    //     onSuccess: (newEvent) => {
    //       toast.success('Arrangementet ble opprettet');
    //       goToEvent(newEvent.id);
    //     },
    //     onError: (e) => {
    //       toast.error(e.detail);
    //     },
    //   });
  };

  // /**
  //  * Sets the dates of the event to a standarized structure compared to the start-date. Runned when start-date is changed.
  //  * Registration start -> 12:00, 7 days before start
  //  * Registration end -> 12:00, same day as start
  //  * Sign off deadline -> 12:00, 1 days start
  //  * End-date -> 2 hours after start
  //  * @param start The start-date
  //  */
  // const updateDates = (start?: Date) => {
  //   if (start && start instanceof Date && !isNaN(start.valueOf())) {
  //     const getDate = (daysBefore: number, hour: number) =>
  //       startOfHour(setHours(subDays(start, daysBefore), daysBefore === 0 ? Math.min(hour, start.getHours()) : hour));
  //     form.setValue('start_registration_at', getDate(7, 12));
  //     form.setValue('end_registration_at', getDate(0, 12));
  //     form.setValue('sign_off_deadline', getDate(1, 12));
  //     form.setValue('end_date', addHours(start, 2));
  //   }
  // };
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((v) => [v.id.toString(), v.text])), [categories]);

  if (isLoading) {
    return <EventEditorSkeleton />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <Form {...form}>
          <form
            className='space-y-6'
            onSubmit={(e) => {
              console.log('form:', form.getValues());
              return form.handleSubmit(onSubmit)(e);
            }}>
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

            <FormField
              control={form.control}
              name='timePeriod'
              render={({ field }) => {
                const { from, to } = field.value ?? {};

                let dateText = from ? format(from, 'PPP HH:mm', { locale: nb }) : undefined;
                if (to) {
                  dateText += ` - ${format(to, 'PPP HH:mm', { locale: nb })}`;
                }

                return (
                  <FormItem>
                    <FormLabel>Tidsperiode</FormLabel>
                    <FormControl>
                      <DateTimeRangePicker
                        hideSeconds={true}
                        onChange={(e) => {
                          if (e === undefined) {
                            return field.onChange(null);
                          } else {
                            field.onChange(e);
                          }
                        }}
                        range={field.value}>
                        <Button className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')} variant='outline'>
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {field.value ? dateText : <span>Velg periode</span>}
                        </Button>
                      </DateTimeRangePicker>
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <BoolExpand description='Bestem start og slutt for påmelding' form={form} name='signUp.enabled' title='Påmelding'>
              <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
                <FormField
                  control={form.control}
                  name='signUp.registrationPeriod'
                  render={({ field }) => {
                    const { from, to } = field.value ?? {};

                    let dateText = from ? format(from, 'PPP HH:mm', { locale: nb }) : undefined;
                    if (to) {
                      dateText += ` - ${format(to, 'PPP HH:mm', { locale: nb })}`;
                    }

                    return (
                      <FormItem className='w-full'>
                        <FormLabel>Påmeldingsperiode</FormLabel>
                        <FormControl>
                          <DateTimeRangePicker
                            hideSeconds={true}
                            onChange={(e) => {
                              if (e === undefined) {
                                return field.onChange(null);
                              } else {
                                field.onChange(e);
                              }
                            }}
                            range={field.value}>
                            <Button className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')} variant='outline'>
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? dateText : <span>Velg periode</span>}
                            </Button>
                          </DateTimeRangePicker>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <DateTimePicker form={form} hideSeconds label='Avmeldingsfrist' name='signUp.signOffDeadline' required />
              </div>

              <FormField
                control={form.control}
                name='signUp.options.type'
                render={({ field }) => (
                  <Tabs className='mt-3' onValueChange={field.onChange} value={field.value ?? 'simple'}>
                    <TabsList className='w-full'>
                      <TabsTrigger className='w-full' value='simple'>
                        Enkel
                      </TabsTrigger>
                      <TabsTrigger className='w-full' value='advanced'>
                        Avansert
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value='simple'>
                      <Card className='p-4'>
                        <FormField
                          control={form.control}
                          name='signUp.options.limit'
                          render={({ field }) => (
                            <FormItem className='w-full'>
                              <FormLabel>
                                Antall plasser <span className='text-red-300'>*</span>
                              </FormLabel>
                              <FormControl>
                                <Input type='number' {...field} placeholder='0' value={(field.value ?? '').toString()} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Card>
                    </TabsContent>
                    <TabsContent value='advanced'>
                      <Card className='p-4'>
                        <p>Advanced</p>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}
              />
            </BoolExpand>

            <MarkdownEditor form={form} label='Innhold' name='description' required />

            <FormImageUpload form={form} label='Velg et banner bilde' name='banner' ratio='21:9' />

            <FormField
              control={form.control}
              name='bannerAlt'
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
                        {Object.entries(groupOptions).map(([header, groups]) => (
                          <SelectGroup key={header}>
                            <SelectLabel>{header}</SelectLabel>
                            {groups.map((group) => (
                              <SelectItem key={group.slug} value={group.slug}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
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
                    <Select defaultValue={categoryMap[field.value] ? field.value.toString() : undefined} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={categoryMap[field.value] ?? 'Kategori'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(categoryMap).map(([id, text]) => (
                          <SelectItem key={id} value={id}>
                            {text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <BoolExpand description='Bestem en pris hvis du ønsker et betalt arrangement' form={form} name='paid.enabled' title='Betalt arrangement'>
              <FormField
                control={form.control}
                name='paid.price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pris <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type='number' {...field} placeholder='0' value={(field.value ?? '').toString()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </BoolExpand>

            <FormField
              control={form.control}
              name='reactions'
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
            <SingleUserSearch className='w-full' form={form} label='Kontaktperson' name='contactPerson' />

            <div className='space-y-2 md:flex md:items-center md:justify-end md:space-x-4 md:space-y-0 pt-6'>
              {eventId && <DeleteEvent deleteEvent={remove} disabled={isUpdating} eventId={eventId} />}
              {eventId && <CloseEvent closeEvent={closeEvent} disabled={isUpdating} eventId={eventId} />}
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
