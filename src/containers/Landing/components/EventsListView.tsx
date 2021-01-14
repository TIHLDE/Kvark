import { Event } from 'types/Types';
import URLS from 'URLS';
import { Link } from 'react-router-dom';

// Material-UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

// Project componets
import ListItem from 'components/miscellaneous/ListItem';
import Story from 'components/story/Story';

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
  progress: {
    margin: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  btn: {
    padding: theme.spacing(1),
  },
}));

export type EventsListViewProps = {
  events: Array<Event>;
  isLoading?: boolean;
};

const NO_OF_EVENTS_TO_SHOW = 3;

const EventsListView = ({ events, isLoading = false }: EventsListViewProps) => {
  const classes = useStyles();
  const theme = useTheme();

  if (isLoading) {
    return (
      <div className={classes.noEventText}>
        <CircularProgress className={classes.progress} />
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
      <>
        <Story fadeColor={theme.palette.background.smoke} items={events} />
        <div className={classes.container}>
          {events.map((event, index) => index < NO_OF_EVENTS_TO_SHOW && <ListItem event={event} key={event.id} />)}
          <Button className={classes.btn} color='primary' component={Link} to={URLS.events} variant='outlined'>
            Alle arrangementer ({events.length})
          </Button>
        </div>
      </>
    );
  }
};

export default EventsListView;
