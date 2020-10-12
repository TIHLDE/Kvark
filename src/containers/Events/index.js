import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { MuiThemeProvider as Theme } from '@material-ui/core/styles';
import { errorTheme } from '../../theme';
import Helmet from 'react-helmet';
import URLS from '../../URLS';
import { getFormattedDate } from '../../utils';
import moment from 'moment';

// API and store imports
import EventService from '../../api/services/EventService';

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

// Icons
import DateIcon from '@material-ui/icons/DateRange';
import LocationIcon from '@material-ui/icons/LocationOn';

// Project components
import ListItem from '../../components/miscellaneous/ListItem';
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
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

    '@media only screen and (max-width: 1200px)': {
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

    '@media only screen and (max-width: 800px)': {
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
    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  settings: {
    position: 'sticky',
    top: 88,
    padding: 28,

    '@media only screen and (max-width: 800px)': {
      order: 0,
      position: 'static',
      top: 0,
    },
    border: theme.palette.sizes.border.width + ' solid ' + theme.palette.colors.border.main,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.colors.background.light,
  },
  paddingBtn: {
    paddingBottom: 10,
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,

    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  mt: {
    color: theme.palette.colors.text.main,
    marginTop: 10,
  },
  resetBtn: {
    marginTop: 10,
    borderRadius: theme.shape.borderRadius,
  },
});

function Events(props) {
  const { classes } = props;
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
    EventService.getEvents(urlParameters, null, (isError, loadedEvents) => {
      if (isError === false) {
        let displayedEvents = loadedEvents.results;
        const nextPageUrl = loadedEvents.next;
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
      }
      setIsFetching(false);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadEvents();
    EventService.getCategories().then((categories) => setCategories(categories || []));
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
    <Navigation fancyNavbar whitesmoke>
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
                        <ListItem
                          expired={event.expired}
                          img={event.image}
                          imgAlt={event.image_alt}
                          info={[
                            { label: getFormattedDate(moment(event.start_date, ['YYYY-MM-DD HH:mm'], 'nb')), icon: DateIcon },
                            { label: event.location, icon: LocationIcon },
                          ]}
                          key={event.id}
                          link={URLS.events + ''.concat(event.id, '/')}
                          title={event.title}
                        />
                      ))}
                    </Pageination>
                    {events.length === 0 && !isLoading && <NoEventsIndicator />}
                  </div>
                </Grow>
              </div>
            )}
            <div>
              <div className={classes.settings}>
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

                <Theme theme={errorTheme}>
                  <Button className={classes.resetBtn} color='primary' fullWidth onClick={resetFilters} variant='outlined'>
                    {Text.reset}
                  </Button>
                </Theme>
              </div>
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
