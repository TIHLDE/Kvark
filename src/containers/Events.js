import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';


// Project components
import EventListItem from "../components/EventListItem"
import Head from "../components/Head"
import Navigation from "../components/Navigation";
import Information from "../components/Information";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import connect from 'react-redux/es/connect/connect';


// API and store imports
import API from '../api/api';
import { setSelectedItem, selectItem } from '../store/actions/GridActions';
import Arrangement from './Arrangement';
import URLS from '../URLS';


const styles = {
    root:{
        width:'auto',
        height:'auto',
        backgroundColor:'whitesmoke',
    },
    wrapper:{
        paddingTop:'30px',
        paddingBottom:'30px',

        display: 'grid',
        gridTemplateColumns: '80%',
        gridTemplateRows:'auto',
        margin:'auto',
        gridGap:'30px',
        justifyContent:'center',
    },
    headliner:{
        borderStyle:'none none solid none',
        borderColor:'gray',
        borderWidth: '1px',
        textAlign: 'left'
    },
    minify: {
        '@media only screen and (max-width: 600px)': {
            fontSize: 40,
        },
    }


};


class Events extends Component {
    constructor(props){
        super(props);
        this.state = {
            events: [],
            isLoading: false,
        }
    }

    // Gets the event
    loadEvent = () => {
        const { dispatch } = this.props;
        // Get eventItem id
        const id = this.props.match.params.id;

        // Item does not exist, fetch from server
        this.setState({isLoading: true});
        const response = API.getEventItems().response();
        response.then((data) => {

            if (response.isError === false) {
                this.setState({events: data});
            } else {

            }
            this.setState({isLoading: false});
        });


    };

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.loadEvent();
    }

    goToEvent = (id) => {
        this.props.history.push(URLS.events + ''.concat(id, '/'));
    };

    render() {
        const {classes, grid} = this.props;

        return (
            <Navigation isLoading={this.state.isLoading} footer>
                {(this.state.isLoading)? null :
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <div className={classes.headliner}>
                                <Typography variant='display3' className={classes.minify}> Arrangementer </Typography>
                            </div>

                            {this.state.events.map((value, index) => (
                              <EventListItem key={value.id} data={value} onClick={() => this.goToEvent(value.id)}/>
                            ))}

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
