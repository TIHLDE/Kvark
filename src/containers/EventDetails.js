import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// Project components
import Navigation from '../components/Navigation';
import EventRenderer from '../components/EventComponents/EventRenderer';

// API and store imports
import API from '../api/api';
import { setSelectedItem } from '../store/actions/GridActions';


const styles = {
    root:{
        backgroundColor:'whitesmoke',
        minHeight: '90vh',
    },
    wrapper:{
        maxWidth: 1200,
        margin: 'auto',
        paddingTop: 10,
        paddingBottom: 100,

        '@media only screen and (max-width: 600px)': {
            paddingTop: 0,
        }
    },
};


class EventDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
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
        const response = API.getEventItem(id).response();
        response.then((data) => {
            if (response.isError === false) {
                dispatch(setSelectedItem(data));
            } else {
                // Redirect to 404
                this.props.history.replace('/');
            }
            this.setState({isLoading: false});
        });
    };

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.loadEvent();
    }

    render() {
        const {classes, grid} = this.props;
        const selected = grid.selectedItem;
        const data = (selected && selected.data)? selected.data : (selected)? selected : {};

        return (
            <Navigation isLoading={this.state.isLoading} footer>
                {(this.state.isLoading)? null :
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <EventRenderer data={data}/>
                        </div>
                    </div>
                }
            </Navigation>
        );
    }
}


EventDetails.propTypes = {
    classes: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.object,
};

EventDetails.defaultProps = {
    id: '-1',
};

const stateValues = (state) => {
    return {
        grid: state.grid
    };
};


export default connect(stateValues)(withStyles(styles)(EventDetails));
