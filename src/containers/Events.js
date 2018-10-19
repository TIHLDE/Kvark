import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connect from 'react-redux/es/connect/connect';
import URLS from '../URLS';

// API and store imports
import API from '../api/api';
import { setSelectedItem, selectItem } from '../store/actions/GridActions';

// Text
import Text from '../text/EventText';

// Material Components
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Project components
import EventListItem from "../components/EventComponents/EventListItem"
import Head from "../components/Head"
import Navigation from "../components/Navigation";
import Banner from '../components/Banner';
import Arrangement from './EventDetails';
import MessageIndicator from '../components/MessageIndicator';

const styles = {
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

        '@media only screen and (max-width: 800px)': {
            order: 1,
        },
    },
    settings: {
        position: 'sticky',
        top: 88,
        maxHeight: 160,
        padding: 20,

        '@media only screen and (max-width: 800px)': {
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

        '@media only screen and (max-width: 800px)': {
            order: 1,
        },
    },
};


class Events extends Component {

    constructor(){
        super();
        this.state = {
            events: [],
            isLoading: false,
            isFetching: false,

            search: '',
        }
    }

    // Gets the event
    loadEvent = () => {
        const { dispatch } = this.props;
        // Get eventItem id
        const id = this.props.match.params.id;

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

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.setState({isLoading: true});
        this.loadEvent();
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value});
    }

    goToEvent = (id) => {
        this.props.history.push(URLS.events + ''.concat(id, '/'));
    };

    filterEvents = (event) => {
        event.preventDefault();

        const search = this.state.search;

        this.setState({isFetching: true});
        console.log(search);
        if(!search) {
            this.loadEvent();
            return;
        }
        
        const response = API.getEventItems(search).response();
        response.then((data) => {

            if (response.isError === false) {
                this.setState({events: data});
            } else {

            }
            this.setState({isFetching: false});
        });
    }

    render() {
        const {classes, grid} = this.props;
        return (
            <Navigation isLoading={this.state.isLoading} footer>
                {(this.state.isLoading)? null :
                    <div className={classes.root}>

                        <div className={classes.wrapper}>
                            <Banner image='http://sf.co.ua/13/06/wallpaper-2845536.jpg' title='Arrangementer'/>
                            <div className={classes.grid}>

                                {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
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
                                }
                                <Paper className={classes.settings} elevation={1} square>
                                    <Typography variant='title' gutterBottom>{Text.filter}</Typography>
                                    <form>
                                        <TextField className={classes.paddingBtn} fullWidth placeholder='Søk...' onChange={this.handleChange('search')}/>
                                        <Button fullWidth variant='outlined' color='primary' type='submit' onClick={this.filterEvents}>{Text.search}</Button>
                                    </form>
                                    
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


export default connect(stateValues)(withStyles(styles)(Events));
