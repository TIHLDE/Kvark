import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {MuiThemeProvider as Theme} from '@material-ui/core/styles';
import {errorTheme} from '../../theme';
import Helmet from 'react-helmet';

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

// Project components
import EventListItem from './components/EventListItem';
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
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    backgroundColor: theme.colors.background.light,
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
    marginTop: 10,
  },
  resetBtn: {
    marginTop: 10,
  },
});

function Events(props) {
  const {classes} = props;
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
          setFilters({...filters, expired: true});
          return;
        }
      }
      setIsFetching(false);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadEvents();
    EventService.getCategories().then((categories) => setCategories(categories || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const urlParameters = {...filters};
    if (urlParameters.search === '') delete urlParameters.search;
    if (urlParameters.category === 0) delete urlParameters.category;
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
    const newFilters = {...filters};
    newFilters.page = nextPage;
    setFilters(newFilters);
  };

  return (
    <Navigation isLoading={isLoading} footer whitesmoke fancyNavbar>
      <Helmet>
        <title>Arrangementer - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <Banner title='Arrangementer'/>
        <div className={classes.wrapper}>
          <div className={classes.grid}>
            {isFetching ? <CircularProgress className={classes.progress} /> :
              <div className={classes.listRoot}>
                <Grow in={!isFetching}>
                  <div className={classes.list}>
                    <Pageination nextPage={getNextPage} page={nextPage}>
                      {events && events.map((value, index) => (
                        <EventListItem key={value.id} data={value} />
                      ))}
                    </Pageination>
                    {events.length === 0 && !isLoading &&
                      <NoEventsIndicator />
                    }
                  </div>
                </Grow>
              </div>
            }
            <div>
              <div className={classes.settings}>
                <form>
                  <TextField variant='outlined' className={classes.paddingBtn} value={searchInput} fullWidth label='Søk...' onChange={(e) => setSearchInput(e.target.value)}/>
                  <Button fullWidth variant='outlined' color='primary' type='submit' onClick={searchForEvent}>{Text.search}</Button>
                </form>
                <Divider className={classes.mt}/>
                <Typography className={classes.mt} variant='h6' gutterBottom>{Text.category}</Typography>
                <TextField variant='outlined' className={classes.paddingBottom} select fullWidth label='Kategori' value={category} onChange={handleCategoryChange}>
                  <MenuItem value={0}>Alle</MenuItem>
                  {categories.map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.text}
                    </MenuItem>
                  ))}
                </TextField>
                <Divider className={classes.mt}/>

                <Theme theme={errorTheme}>
                  <Button
                    className={classes.resetBtn}
                    fullWidth
                    color='primary'
                    variant='outlined'
                    onClick={resetFilters}>
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
