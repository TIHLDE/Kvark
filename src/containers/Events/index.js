import { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// API and store imports
import { useEvent } from '../../api/hooks/Event';
import { useMisc } from '../../api/hooks/Misc';

// Text
import Text from '../../text/EventText';

// Material Components
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';

// Project components
import ListItem from '../../components/miscellaneous/ListItem';
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import Paper from '../../components/layout/Paper';
import Pageination from '../../components/layout/Pageination';
import NoEventsIndicator from './components/NoEventsIndicator';

const styles = (theme) => ({
  root: {
    width: 'auto',
    height: 'auto',
    minHeight: '95vh',
  },
  wrapper: {
    paddingTop: 20,
    paddingBottom: 30,
    maxWidth: 1200,

    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    margin: 'auto',
    gridGap: 15,
    justifyContent: 'center',

    [theme.breakpoints.down('lg')]: {
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridTemplateRows: 'auto',
    gridGap: 15,

    position: 'relative',

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
      justifyContent: 'center',
      gridAutoFlow: 'row dense',
    },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  listRoot: {
    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  },
  settings: {
    position: 'sticky',
    top: 88,

    [theme.breakpoints.down('md')]: {
      order: 0,
      position: 'static',
      top: 0,
    },
  },
  paddingBtn: {
    paddingBottom: 10,
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,

    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  },
  mt: {
    color: theme.palette.text.primary,
    marginTop: 10,
  },
  resetBtn: {
    marginTop: 10,
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
});

function Events(props) {
  const { classes } = props;
  const { getEvents } = useEvent();
  const { getCategories } = useMisc();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [filters, setFilters] = useState({});

  // Gets the event
  const loadEvents = (urlParameters = {}) => {
    if (events.length > 0 && urlParameters === {}) {
      setIsFetching(false);
      return;
    }

    // Fetch events from server
    getEvents(urlParameters).then((data) => {
      let displayedEvents = data.results;
      const nextPageUrl = data.next;
      const newUrlParameters = {};

      // If we have a url for the next page convert it into a object
      if (nextPageUrl) {
        const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
        const parameterArray = nextPageUrlQuery.split('&');
        parameterArray.forEach((parameter) => {
          const parameterString = parameter.split('=');
          newUrlParameters[parameterString[0]] = parameterString[1];
        });
      }
      setNextPage(newUrlParameters['page'] || null);

      // If we allready have events
      if (urlParameters.page) {
        displayedEvents = [...events, ...displayedEvents];
      }
      setEvents(displayedEvents);

      // Used to load expired events when we have nothing else to show.
      if (displayedEvents.length === 0 && !urlParameters.expired && (urlParameters.search || urlParameters.category)) {
        setFilters({ ...filters, expired: true });
        return;
      }
      setIsFetching(false);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadEvents();
    getCategories().then((categories) => setCategories(categories || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const urlParameters = { ...filters };
    if (urlParameters.search === '') {
      delete urlParameters.search;
    }
    if (urlParameters.category === 0) {
      delete urlParameters.category;
    }
    loadEvents(urlParameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    const newFilters = {};
    newFilters.category = event.target.value;
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setCategory(0);
    setSearchInput('');
    setFilters({});
    setNextPage(null);
  };

  const searchForEvent = (e) => {
    e.preventDefault();
    setCategory(0);
    const newFilters = {};
    newFilters.search = searchInput;
    setFilters(newFilters);
  };

  const getNextPage = () => {
    const newFilters = { ...filters };
    newFilters.page = nextPage;
    setFilters(newFilters);
  };

  return (
    <Navigation fancyNavbar>
      <Helmet>
        <title>Arrangementer - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <Banner title='Arrangementer' />
        <div className={classes.wrapper}>
          <div className={classes.grid}>
            {isFetching ? (
              <CircularProgress className={classes.progress} />
            ) : (
              <div className={classes.listRoot}>
                <Grow in={!isFetching}>
                  <div className={classes.list}>
                    <Pageination nextPage={getNextPage} page={nextPage}>
                      {events?.map((event) => (
                        <ListItem event={event} key={event.id} />
                      ))}
                    </Pageination>
                    {events.length === 0 && !isLoading && <NoEventsIndicator />}
                  </div>
                </Grow>
              </div>
            )}
            <div>
              <Paper className={classes.settings}>
                <form>
                  <TextField
                    className={classes.paddingBtn}
                    fullWidth
                    label='Søk...'
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    variant='outlined'
                  />
                  <Button color='primary' fullWidth onClick={searchForEvent} type='submit' variant='outlined'>
                    {Text.search}
                  </Button>
                </form>
                <Divider className={classes.mt} />
                <Typography className={classes.mt} gutterBottom variant='h6'>
                  {Text.category}
                </Typography>
                <TextField
                  className={classes.paddingBottom}
                  fullWidth
                  label='Kategori'
                  onChange={handleCategoryChange}
                  select
                  value={category}
                  variant='outlined'>
                  <MenuItem value={0}>Alle</MenuItem>
                  {categories.map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.text}
                    </MenuItem>
                  ))}
                </TextField>
                <Divider className={classes.mt} />

                <Button className={classes.resetBtn} color='primary' fullWidth onClick={resetFilters} variant='outlined'>
                  {Text.reset}
                </Button>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}

Events.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
};

Events.defaultProps = {
  id: '-1',
};

export default withStyles(styles)(Events);
