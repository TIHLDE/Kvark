import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import { Appointments, DateNavigator, MonthView, Scheduler, Toolbar } from '@devexpress/dx-react-scheduler-material-ui';
import { addDays, endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { Category, EventList } from 'types';
import { Category as CategoryEnum, Groups } from 'types/Enums';

import { useEvents } from 'hooks/Event';
import { useAnalytics } from 'hooks/Utils';

import EventsCalendarPopover from 'pages/Landing/components/EventsCalendarPopover';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

type Filters = {
  start_range?: string;
  end_range?: string;
};
export type EventsCalendarViewProps = {
  category?: Category['id'];
};

type AppointmentProps = {
  children: ReactNode;
  data: AppointmentModel;
};

const Appointment = ({ children, data }: AppointmentProps) => {
  const getColor = (event: EventList): string => {
    if (event.category?.text === CategoryEnum.ACTIVITY) {
      return 'bg-[#9778ce] dark:bg-[#7e57c2] hover:bg-[#9778ce]/30 dark:hover:bg-[#7e57c2]/30';
    }

    if (
      event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ||
      event.category?.text.toLowerCase() === CategoryEnum.COMPRES ||
      event.category?.text.toLowerCase() === CategoryEnum.COURSE
    ) {
      return 'bg-[#83C4F8] dark:bg-[#83C4F8] hover:bg-[#83C4F8]/30 dark:hover:bg-[#83C4F8]/30';
    }

    return 'bg-[#FFA675] dark:bg-[#FFA675] hover:bg-[#FFA675]/30 dark:hover:bg-[#FFA675]/30';
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='w-full h-full'>
          <Appointments.Appointment className={getColor(data as unknown as EventList)} data={data} draggable={false} resources={[]}>
            {children}
          </Appointments.Appointment>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <EventsCalendarPopover id={Number(data.id)} />
      </PopoverContent>
    </Popover>
  );
};

const EventsCalendarView = ({ category }: EventsCalendarViewProps) => {
  const { event } = useAnalytics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<Filters>();
  const { data, fetchNextPage } = useEvents({ category, ...filters });
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  useEffect(() => {
    event('open', 'calendar', 'Open calendar on landing page');
  }, [event]);

  useEffect(() => {
    const firstDay = startOfMonth(currentDate);
    const lastDay = addDays(endOfMonth(currentDate), 7);
    setFilters({ end_range: lastDay.toJSON(), start_range: firstDay.toJSON() });
  }, [currentDate]);

  // fetch all events in the set timespan
  useEffect(() => {
    if (data?.pages[data.pages.length - 1].next) {
      fetchNextPage();
    }
  }, [events]);

  const displayedEvents = useMemo(
    () =>
      events.map(
        (event) =>
          ({
            ...event,
            startDate: parseISO(event.start_date),
            endDate: parseISO(event.end_date),
          } as AppointmentModel),
      ),
    [events],
  );
  return (
    <div className='p-2 rounded-md border bg-card'>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Scheduler data={displayedEvents} firstDayOfWeek={1} locale='no-NB'>
        <ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </div>
  );
};

export default EventsCalendarView;
