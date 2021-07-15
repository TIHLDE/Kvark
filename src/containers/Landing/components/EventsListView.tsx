import { EventCompact } from 'types/Types';
import URLS from 'URLS';
import { Link } from 'react-router-dom';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project componets
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import { useGoogleAnalytics } from 'api/hooks/Utils';

// Styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
  },
  noEventText: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.5),
    textAlign: 'center',
  },
  btn: {
    padding: theme.spacing(1),
  },
}));

export type EventsListViewProps = {
  events: Array<EventCompact>;
  isLoading?: boolean;
};

const NO_OF_EVENTS_TO_SHOW = 3;

const EventsListView = ({ events, isLoading = false }: EventsListViewProps) => {
  const classes = useStyles();
  const { event } = useGoogleAnalytics();

  const openEventsAnalytics = () => event('go-to-all-events', 'events-list-view', `Go to all events`);

  if (isLoading) {
    return (
      <div className={classes.container}>
        <ListItemLoading />
        <ListItemLoading />
        <ListItemLoading />
      </div>
    );
  } else if (!events.length) {
    return (
      <Typography align='center' className={classes.noEventText} variant='subtitle1'>
        Ingen kommende arrangementer
      </Typography>
    );
  } else {
    return (
      <div className={classes.container}>
        {events.map((event, index) => index < NO_OF_EVENTS_TO_SHOW && <ListItem event={event} key={event.id} />)}
        <Button className={classes.btn} component={Link} onClick={openEventsAnalytics} to={URLS.events} variant='outlined'>
          Alle arrangementer ({events.length})
        </Button>
      </div>
    );
  }
};

export default EventsListView;
