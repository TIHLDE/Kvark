import { ReactNode, useEffect, useMemo, useState } from 'react';
import { EventCompact } from 'types';
import { parseISO } from 'date-fns';
import { ViewState, AppointmentModel } from '@devexpress/dx-react-scheduler';
import { useTheme, Popper, ClickAwayListener } from '@mui/material';
import { Scheduler, MonthView, Toolbar, DateNavigator, Appointments } from '@devexpress/dx-react-scheduler-material-ui';

// Project components
import Paper from 'components/layout/Paper';
import { useGoogleAnalytics } from 'hooks/Utils';
import { Groups } from 'types/Enums';
import EventsCalendarPopover from './EventsCalendarPopover';
export type EventsCalendarViewProps = {
  events: Array<EventCompact>;
  oldEvents: Array<EventCompact>;
};

type AppointmentProps = {
  children: ReactNode;
  data: AppointmentModel;
};

const Appointment = ({ children, data }: AppointmentProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const getColor = (event: EventCompact) =>
    theme.palette.colors[event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ? 'nok_event' : 'other_event'];
  return (
    <div>
      <div onClick={handleClick}>
        <Appointments.Appointment data={data} draggable={false} resources={[]} style={{ backgroundColor: getColor(data as unknown as EventCompact) }}>
          {children}
        </Appointments.Appointment>
      </div>
      <Popper
        anchorEl={anchorEl}
        modifiers={[
          {
            name: 'flip',
            enabled: false,
          },
        ]}
        open={open}
        placement='top'
        style={{ zIndex: 1000000 }}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>{typeof data.id === 'number' ? <EventsCalendarPopover id={data.id} /> : null}</div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

const EventsCalendarView = ({ events, oldEvents }: EventsCalendarViewProps) => {
  const { event } = useGoogleAnalytics();

  useEffect(() => {
    event('open', 'calendar', 'Open calendar on landing page');
  }, [event]);

  const displayedEvents = useMemo(
    () =>
      [...events, ...oldEvents].map(
        (event) =>
          ({
            ...event,
            startDate: parseISO(event.start_date),
            endDate: parseISO(event.end_date),
          } as AppointmentModel),
      ),
    [oldEvents, events],
  );

  return (
    <Paper noPadding sx={{ '& div:first-of-type': { whiteSpace: 'break-spaces' }, '& table': { minWidth: 'unset' } }}>
      <Scheduler data={displayedEvents} firstDayOfWeek={1} locale='no-NB'>
        <ViewState />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </Paper>
  );
};

export default EventsCalendarView;
