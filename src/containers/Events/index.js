import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import URLS from '../../URLS';
import {MuiThemeProvider as Theme} from '@material-ui/core/styles';
import {errorTheme} from '../../theme';

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

class Events extends Component {

  constructor() {
    super();
    this.state = {
      events: [],
      categories: [],
      isLoading: false,
      isFetching: false,

      search: '',
      category: 0,
      nextPage: null,
      expiredShown: false,
    };
  }

    // Gets the event
    loadEvents = (filters, orderBy = null) => {
      // Add in filters if needed.
      let urlParameters = filters ? {...filters} : {};
      if (this.state.expiredShown) {
        urlParameters['expired'] = true;
      }

      // Decide if we should go to next page or not.
      if (this.state.nextPage) {
        urlParameters = {
          page: this.state.nextPage,
          ...urlParameters,
        };
      } else if (this.state.events.length > 0) {
        // Abort if we have noe more pages and allready have loaded evrything
        this.setState({isFetching: false});
        return;
      }

      // Fetch events from server
      EventService.getEvents(urlParameters, orderBy, (isError, events) => {
        if (isError === false) {
          // For backward compabillity
          let displayedEvents = events.results ? events.results : events;
          const nextPageUrl = events.next;
          urlParameters = {};

          // If we have a url for the next page convert it into a object
          if (nextPageUrl) {
            const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
            const parameterArray = nextPageUrlQuery.split('&');
            parameterArray.forEach((parameter) => {
              const parameterString = parameter.split('=');
              urlParameters[parameterString[0]] = parameterString[1];
            });
          }

          // Get the page number from the object if it exist
          let nextPage = urlParameters['page'] ? urlParameters['page'] : null;
          let expiredShown = this.state.expiredShown;

          if (nextPage === null && !expiredShown && (this.state.search || this.state.category)) {
            nextPage = 1;
            expiredShown = true;
          }

          this.setState((oldState) => {
            // If we allready have events
            if (this.state.events.length > 0) {
              displayedEvents = oldState.events.concat(displayedEvents);
            }
            return {events: displayedEvents, nextPage: nextPage, expiredShown: expiredShown};
          });

          // Used to load expired events when we have nothing else to show.
          if (displayedEvents.length === 0 && nextPage) {
            this.loadEvents({expired: true, ...filters});
            return;
          }
        }
        this.setState({isLoading: false, isFetching: false});
      });
    };

    loadCategory = () => {
      // Get all categories
      EventService.getCategories()
          .then((categories) => {
            this.setState({categories: (categories || [])});
          });
    }

    componentDidMount() {
      window.scrollTo(0, 0);
      // Getting data
      this.setState({isLoading: true});
      this.loadEvents();
      this.loadCategory();
    }

    handleChange = (name) => (event) => {
      this.setState({[name]: event.target.value});
    }

    handleCategoryChange = (event) => {
      this.setState({category: event.target.value, search: ''});
      this.filterEvents(event, null, event.target.value);
    }

    goToEvent = (id) => {
      this.props.history.push(URLS.events + ''.concat(id, '/'));
    };

    // This one must be asyncron in order to make sure that we get the new state in loadEvents.
    resetFilters = async () => {
      await this.setState({isFetching: true, category: 0, search: '', events: [], nextPage: null, expiredShown: false});
      this.loadEvents();
    }

    searchForEvent = (event) => {
      event.preventDefault();
      this.setState({category: 0});
      this.filterEvents(event, this.state.search, 0);
    }

    // This one must be asyncron in order to make sure that we get the new state in loadEvents.
    filterEvents = async (event, search, category) => {
      event.preventDefault();

      await this.setState({isFetching: true, nextPage: null, events: [], expiredShown: false});
      // If no filters requested, just load the events
      if (!search && !category) {
        this.loadEvents();
      } else {
        // Requested filters
        const filters = (category && category !== 0) ? {category: category} : {search: search};
        this.loadEvents(filters);
      }
    }

    getNextPage = () => {
      const search = this.state.search;
      const category = this.state.category;
      let filters = null;
      if (search || category) {
        filters = (category && category !== 0) ? {category: category} : {search: search};
      }
      this.loadEvents(filters, filters ? {expired: true} : null);
    }

    render() {
      const {classes} = this.props;
      const {categories, category} = this.state;

      return (
        <Navigation isLoading={this.state.isLoading} footer whitesmoke fancyNavbar>
          <div className={classes.root}>
            <Banner title='Arrangementer'/>
            <div className={classes.wrapper}>
              <div className={classes.grid}>
                {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
                  <div className={classes.listRoot}>
                    <Grow in={!this.state.isFetching}>
                      <div className={classes.list}>
                        <Pageination nextPage={this.getNextPage} page={this.state.nextPage}>
                          {this.state.events && this.state.events.map((value, index) => (
                            <EventListItem key={value.id} data={value} />
                          ))}
                        </Pageination>
                        { (this.state.events.length === 0 && !this.state.isLoading) &&
                              <NoEventsIndicator />
                        }
                      </div>
                    </Grow>
                  </div>
                }
                <div>
                  <div className={classes.settings}>

                    <form>
                      <TextField className={classes.paddingBtn} value={this.state.search} fullWidth placeholder='Søk...' onChange={this.handleChange('search')}/>
                      <Button fullWidth variant='outlined' color='primary' type='submit' onClick={this.searchForEvent}>{Text.search}</Button>
                    </form>
                    <Divider className={classes.mt}/>
                    <Typography className={classes.mt} variant='h6' gutterBottom>{Text.category}</Typography>
                    <TextField className={classes.paddingBottom} select fullWidth label='Kategori' value={category} onChange={this.handleCategoryChange}>
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
                        onClick={this.resetFilters}>
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
}

Events.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  grid: PropTypes.object,
  history: PropTypes.object,
};

Events.defaultProps = {
  id: '-1',
};

const stateValues = (state) => {
  return {
    grid: state.grid,
  };
};

export default connect(stateValues)(withStyles(styles, {withTheme: true})(Events));
