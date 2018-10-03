import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';


// Project components
import EventListItem from "../components/EventListItem"
import Head from "../components/Head"
import Navigation from "../components/Navigation";
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
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows:'auto',

        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '80%',
            justifyContent: 'center',
        },
        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '1fr',
            justifyContent: 'center',
        },
    },
    list: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '5px',
    },
    minify: {
        '@media only screen and (max-width: 600px)': {
            fontSize: 40,
        },
    },
    idonno:{
        height:30,
        width:'auto'
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

        const data ={
            header: "ARRANGEMENTER",
            paragraph: "The Norwegian University of Science and Technology (Norwegian: Norges teknisk-naturvitenskapelige universitet, NTNU) is a pu" +
                "blic research university with campuses in the cities of Trondheim, Gjøvik, and Ålesund in Norway, and has become the largest university i" +
                "n Norway, following the university merger in 2016. NTNU has the main national responsibility for education and research in engineering and techn" +
                "ology, originated from Norwegian Institute of Technology (NTH). In addition to engineering and natural sciences, the university offers higher edu" +
                "cation in other academic disciplines ranging from social sciences, the arts, medical and life sciences, teacher educ",
            image: "https://giftflowers.com.sg/media/wysiwyg/giftflowers/blog/Flower-Arrangement-banner.jpg"
        };
        return (
            <Navigation isLoading={this.state.isLoading} footer>
                {(this.state.isLoading)? null :
                    <div className={classes.root}>

                        <div className={classes.wrapper}>
                            <Head data={data}/>
                            <div className={classes.idonno}/>

                            <div className={classes.grid}>
                                <div className={classes.list}>
                                    {this.state.events.map((value, index) => (
                                        <EventListItem key={value.id} data={value} onClick={() => this.goToEvent(value.id)}/>
                                    ))}
                                </div>
                                <div>

                                </div>
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
