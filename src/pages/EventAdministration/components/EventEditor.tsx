import { zodResolver } from '@hookform/resolvers/zod';
import { SelectGroup } from '@radix-ui/react-select';
import { parseISO, setHours, startOfHour, subDays } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { Control, FieldPath, FieldValues, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { BaseGroup, Event, EventMutate } from 'types';
import { MembershipType } from 'types/Enums';

import { useCategories } from 'hooks/Categories';
import { useCreateEvent, useDeleteEvent, useEventById, useUpdateEvent } from 'hooks/Event';
import { useGroupsByType } from 'hooks/Group';
import { useUser, useUserMemberships, useUserPermissions } from 'hooks/User';

import EventRenderer from 'pages/EventDetails/components/EventRenderer';

import BoolExpand from 'components/inputs/BoolExpand';
import DateTimePicker from 'components/inputs/DateTimePicker';
import { DateTimeRangePickerFormInput } from 'components/inputs/DateTimeRangePicker';
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

const formSchema = z
  .object({
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
  })
  .superRefine((data, ctx) => {
    if (data.timePeriod.from >= data.timePeriod.to) {
      ctx.addIssue({
        message: 'Tidsperioden er ikke gyldig. Startdato må være før sluttdato',
        path: ['timePeriod'],
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.signUp.enabled) {
      if (data.signUp.registrationPeriod.from >= data.signUp.registrationPeriod.to) {
        ctx.addIssue({
          message: 'Påmeldingsperioden er ikke gyldig. Startdato må være før sluttdato',
          path: ['signUp', 'registrationPeriod'],
          code: z.ZodIssueCode.custom,
        });
      }
    }
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

  /**
   * Sets the dates of the event to a standarized structure compared to the start-date. Runned when start-date is changed.
   * Registration start -> 12:00, 7 days before start
   * Registration end -> 12:00, same day as start
   * Sign off deadline -> 12:00, 1 days start
   * @param start The start-date
   */
  useEffect(() => {
    const timePeriod = form.watch('timePeriod');

    if (timePeriod?.from) {
      const start = timePeriod.from;

      const getDate = (daysBefore: number, hour: number) =>
        startOfHour(setHours(subDays(start, daysBefore), daysBefore === 0 ? Math.min(hour, start.getHours()) : hour));
      form.setValue('signUp.registrationPeriod', {
        from: getDate(7, 12),
        to: getDate(0, 12),
      });
      form.setValue('signUp.signOffDeadline', getDate(1, 12));
    }
  }, [form.watch('timePeriod')]);

  useEffect(() => {
    if (data && eventId) {
      form.reset({
        title: data.title,
        location: data.location,
        timePeriod: {
          from: parseISO(data.start_date),
          to: parseISO(data.end_date),
        },
        signUp: {
          enabled: data.sign_up,
          registrationPeriod: {
            from: parseISO(data.start_registration_at),
            to: parseISO(data.end_registration_at),
          },
          signOffDeadline: parseISO(data.sign_off_deadline),
          options: {
            type: data.sign_up ? 'simple' : 'advanced',
            limit: data.limit,
            allowNonPrioritized: {
              enabled: data.only_allow_prioritized,
              fillRemainingAfter: parseISO(data.end_registration_at),
            },
          },
        },
        description: data.description,
        banner: data.image,
        bannerAlt: data.image_alt,
        organizer: data.organizer?.slug,
        category: data.category,
        paid: data.is_paid_event
          ? {
              enabled: true,
              price: data.price,
            }
          : { enabled: false },
        reactions: data.emojis_allowed,
        contactPerson: data.contact_person,
      });
    }
  }, [data, eventId, form]);

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
    // eslint-disable-next-line no-console
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

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((v) => [v.id.toString(), v.text])), [categories]);

  if (isLoading) {
    return <EventEditorSkeleton />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <FormInput control={form.control} label='Tittel' name='title' placeholder='Navnet på arrangementet' required />
              <FormInput control={form.control} label='Sted' name='location' placeholder='Hvor skal det være?' required />
            </div>

            <DateTimeRangePickerFormInput control={form.control} label='Tidsperiode' name='timePeriod' required />

            <BoolExpand description='Bestem start og slutt for påmelding' form={form} name='signUp.enabled' title='Påmelding'>
              <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
                <DateTimeRangePickerFormInput control={form.control} label='Påmeldingsperiode' name='signUp.registrationPeriod' required />

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
                        <FormInput control={form.control} label='Antall plasser' name='signUp.options.limit' placeholder='0' required />
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

            <FormInput control={form.control} label='Alternativ bildetekst' name='bannerAlt' />

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
              <FormInput control={form.control} label='Pris' name='paid.price' placeholder='0' required />
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

type FormInputProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  label: string | React.ReactNode;
  control?: Control<TFieldValues>;
  name: TName;
  required?: boolean;
  placeholder?: string;
};
export function FormInput<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: FormInputProps<TFieldValues, TName>,
) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel>
            {props.label} {props.required && <span className='text-red-300'>*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={typeof field.value === 'number' ? 'number' : 'text'}
              {...field}
              placeholder={props.placeholder}
              value={(field.value ?? '').toString()}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
