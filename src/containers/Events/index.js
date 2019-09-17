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
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';

// Icons
import EventBanner from '../../assets/img/EventBanner.jpg';

// Project components
import EventListItem from "./components/EventListItem"
import Navigation from "../../components/navigation/Navigation";
import Banner from '../../components/layout/Banner';
import Pageination from '../../components/layout/Pageination'
import NoEventsIndicator from './components/NoEventsIndicator';

const styles = (theme) => ({
    root:{
        width:'auto',
        height:'auto',
        minHeight: '95vh',
    },
    wrapper:{
        paddingTop: 20,
        paddingBottom: 30,

        maxWidth: 1200,

        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows:'auto',
        margin:'auto',
        gridGap:'15px',
        justifyContent:'center',

        '@media only screen and (max-width: 1200px)': {
            paddingLeft: 6,
            paddingRight: 6,
        }
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gridTemplateRows:'auto',
        gridGap: '15px',

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
            margin: 12,
        },
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

    constructor(){
        super();
        this.state = {
            events: [],
            categories: [],
            isLoading: false,
            isFetching: false,

            search: '',
            category: 0,
            nextPage: null,
        }
    }

    // Gets the event
    loadEvents = (filters) => {
        // Add in filters if needed.
        let urlParameters = filters ? {...filters} : null;

        // Decide if we should go to next page or not.
        if (this.state.nextPage){
          // WARNING: Thea api automatically adds newest: true as parameter if it is null. Do therefor need to specify this manually here!!!
          urlParameters = {page: this.state.nextPage};
          !filters ? urlParameters['newest'] = true : null;
        } else if (this.state.events.length > 0 ) {
          // Abort if we have noe more pages and allready have loaded evrything
          this.setState({isFetching: false})
          return;
        }


        // Fetch events from server
        EventService.getEvents(urlParameters, null, (isError, events) => {


            if(isError === false) {
                let displayedEvents = events.results;
                let nextPageUrl = events.next;
                urlParameters = {};

                // If we have a url for the next page convert it into a object
                if (nextPageUrl) {
                  let nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
                  let parameterArray = nextPageUrlQuery.split('&');
                  parameterArray.forEach((parameter) => {
                    const parameterString = parameter.split('=')
                    urlParameters[parameterString[0]] = parameterString[1]
                  })
                }

                // Get the page number from the object if it exists
                let nextPage = urlParameters['page'] ? urlParameters['page'] : null;

                this.setState((oldState) => {
                  // If we allready have events
                  if (this.state.events.length > 0) {
                    displayedEvents = oldState.events.concat(displayedEvents)
                  }
                  return {events: displayedEvents, nextPage: nextPage}
                }
                );

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

    componentDidMount(){
        window.scrollTo(0,0);
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
        await this.setState({isFetching: true, category: 0, search: '', events: [], nextPage: null});
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

        await this.setState({isFetching: true, nextPage: null, events: []});
        // If no filters requested, just load the events
        if(!search && !category) {
            this.loadEvents();
        } else {
            // Requested filters
            const filters = (category && category !== 0)? {category: category} : {search: search};
            this.loadEvents(filters);
        }
    }

    getNextPage = () => {
      this.loadEvents()
    }

    render() {
        const {classes} = this.props;
        const {categories, category} = this.state;

        return (
            <Navigation isLoading={this.state.isLoading} footer whitesmoke>
                    <div className={classes.root}>

                        <div className={classes.wrapper}>
                            <Banner image={EventBanner} title='Arrangementer'/>
                            <div className={classes.grid}>
                                {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
                                    <div className={classes.listRoot}>
                                    <Grow in={!this.state.isFetching}>
                                        <Paper className={classes.list} elevation={1} square>
                                            <Pageination nextPage={this.getNextPage} page={this.state.nextPage}>
                                              {this.state.events && this.state.events.map((value, index) => (
                                                  <div key={value.id}>

                                                        <EventListItem key={value.id} data={value} onClick={() => this.goToEvent(value.id)}/>
                                                        <Divider/>

                                                  </div>
                                              ))}
                                            </Pageination>
                                            { (this.state.events.length === 0 && !this.state.isLoading) &&
                                                <NoEventsIndicator />
                                            }
                                        </Paper>
                                    </Grow>
                                    </div>
                                }
                                <div>
                                    <Paper className={classes.settings} elevation={1} square>

                                        <form>
                                            <TextField className={classes.paddingBtn} value={this.state.search} fullWidth placeholder='Søk...' onChange={this.handleChange('search')}/>
                                            <Button fullWidth variant='outlined' color='primary' type='submit' onClick={this.searchForEvent}>{Text.search}</Button>
                                        </form>
                                        <Divider className={classes.mt}/>
                                        <Typography className={classes.mt} variant='title' gutterBottom>{Text.category}</Typography>
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

                                    </Paper>
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
};

Events.defaultProps = {
    id: "-1"
};

const stateValues = (state) => {
    return {
        grid: state.grid
    };
};


export default connect(stateValues)(withStyles(styles, {withTheme: true})(Events));
