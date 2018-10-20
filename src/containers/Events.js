import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import URLS from '../URLS';
import {MuiThemeProvider as Theme} from '@material-ui/core/styles';
import {errorTheme} from '../theme';

// API and store imports
import API from '../api/api';

// Text
import Text from '../text/EventText';

// Material Components
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';

// Project components
import EventListItem from "../components/EventComponents/EventListItem"
import Navigation from "../components/Navigation";
import Banner from '../components/Banner';
import MessageIndicator from '../components/MessageIndicator';

const styles = (theme) => ({
    root:{
        width:'auto',
        height:'auto',
        backgroundColor: 'whitesmoke',
        minHeight: '95vh',
    },
    wrapper:{
        paddingTop:'10px',
        paddingBottom:'30px',

        maxWidth: 1000,

        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows:'auto',
        margin:'auto',
        gridGap:'5px',
        justifyContent:'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gridTemplateRows:'auto',
        gridGap: '5px',

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
        maxHeight: 236,
        padding: 20,

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
        }
    }

    // Gets the event
    loadEvent = () => {
        // Item does not exist, fetch from server
        
        const response = API.getEventItems().response();
        response.then((data) => {

            if (response.isError === false) {
                this.setState({events: data});
            } else {

            }
            this.setState({isLoading: false, isFetching: false});
        });
    };

    loadCategory = () => {
        // Get all categories
        const response = API.getCategories().response();
        response.then((data) => {
            console.log(data);
            if(response.isError === false) {
                this.setState({categories: data});
            }
        });
    }

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.setState({isLoading: true});
        this.loadEvent();
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

    resetFilters = () => {
        this.setState({isFetching: true, category: 0, search: ''});
        this.loadEvent();
    }

    searchForEvent = (event) => {
        event.preventDefault();
        this.setState({category: 0});
        this.filterEvents(event, this.state.search, 0);
    }

    filterEvents = (event, search, category) => {
        event.preventDefault();

        this.setState({isFetching: true});
        if(!search && !category) {
            this.loadEvent();
            return;
        }

        const filters = (category && category !== 0)? {category: category} : {search: search};
        
        const response = API.getEventItems(filters).response();
        response.then((data) => {
            if (response.isError === false) {
                this.setState({events: data.sort((a, b) => (a.expired === b.expired)? 0 : a.expired ? 1 : -1)});
            }
            this.setState({isFetching: false});
        });
    }

    render() {
        const {classes} = this.props;
        const {categories, category} = this.state;

        return (
            <Navigation isLoading={this.state.isLoading} footer>
                {(this.state.isLoading)? null :
                    <div className={classes.root}>

                        <div className={classes.wrapper}>
                            <Banner image='http://sf.co.ua/13/06/wallpaper-2845536.jpg' title='Arrangementer'/>
                            <div className={classes.grid}>

                                {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
                                    <div className={classes.listRoot}>
                                    <Grow in={!this.state.isFetching}>
                                        <Paper className={classes.list} elevation={1} square>
                                            {this.state.events.map((value, index) => (
                                                <div key={value.id}>
                                                    <EventListItem key={value.id} data={value} onClick={() => this.goToEvent(value.id)}/>
                                                    <Divider/>
                                                </div>
                                            ))}
                                            {this.state.events.length === 0 && 
                                                <MessageIndicator header={Text.noEvents} subheader={Text.subNoEvents}/>
                                            }
                                        </Paper>
                                    </Grow>
                                    </div>
                                }
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

                }
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
