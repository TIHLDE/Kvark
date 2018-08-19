import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// API and store imports
import API from '../api/api';
import {GeneralActions} from '../store/actions/MainActions';

// Project components
import Navigation from '../components/Navigation';
import Paragraph from '../components/Paragraph';
import Details from '../components/Details'
import {Grid, Button} from '@material-ui/core/';



const styles = {
    root:{
        backgroundColor:'whitesmoke',
        margin:'auto',
        '@media only screen and (min-width: 600px)': {
            paddingBottom:20,
        }
    },
    image:{
        backgroundColor: 'whitesmoke',
        width: '100%',
        height: 500,

        '@media only screen and (max-width: 600px)': {
            height: 300,
        }
    },
    cell:{
        paddingBottom:20,
        width:'70%',

        '@media only screen and (max-width: 1300px)': {
            width: '100%',
        },
    },
    paragraph:{
        width:'80%',
        float:'right',
        '@media only screen and (max-width: 1300px)': {
            width: '100%',
        },
    }

};

class Arrangement extends Component {
    constructor(){
        super();

        this.state={
            isLoading: false,
        };
    }


    // Gets the event
    loadEvent = () => {
        // Get eventItem id
        const id = this.props.match.params.id;

        // Does the item exist in store
        const itemExists = this.props.grid.findIndex((elem) => elem.id == id) !== -1;

       // Item exists, get it from store
       if (itemExists) {
           this.props.selectStoredItem(id);
       }
       // Item does not exist, fetch from server
       else {
           this.setState({isLoading: true});
           const response = API.getEventItem(id).response();
           response.then((data) => {
               if (!response.isError) {
                   this.props.setSelectedItem(data);
               } else {
                   // Redirect to 404
               }
               this.setState({isLoading: false});
           });
       }
    };

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.loadEvent();
    }

    render() {
        const {classes, selected} = this.props;
        const data = (selected && selected.data)? selected.data : (selected)? selected : {};
        let button = <Button color="primary">Meld deg på</Button>

            return (
            <Navigation isLoading={this.state.isLoading}>
                 {(this.state.isLoading)? null :
                    <div className={classes.root}>
                        <Grid container spacing={16}>
                            <Grid item className={classes.image}>
                                <img style={{width:'100%', height:'100%'}} src={data.image} alt={data.image_alt}/>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <div className={classes.paragraph}>
                                    <Paragraph data={{
                                        subheader: data.title,
                                        text: data.description,
                                    }}/>

                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid item className={classes.cell}>
                                    <Details data={{
                                        clock: data.start,
                                        date: data.date,
                                        where: data.location,
                                        name: data.name,
                                        study: data.study,
                                        space: data.space,
                                        what: data.what,
                                        link: data.link
                                    }} join={button}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                 }
            </Navigation>
        );
    }
}

Arrangement.propTypes = {
    classes: PropTypes.object,
    selected: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.array,
    selectStoredItem: PropTypes.func,
    setSelectedItem: PropTypes.func,
};

Arrangement.defaultProps = {
    id: "-1"
};

const stateValues = (state) => {
    return {
        grid: state.general.grid,
        selected: state.general.selectedItem,
    };
};

const dispatchers = (dispatch) => {
    return {
        selectStoredItem: (id) => dispatch({type: GeneralActions.SELECT_STORED_ITEM, payload: id}),
        setSelectedItem: (item) => dispatch({type: GeneralActions.SET_SELECTED_ITEM, payload: item}),
    };
};


export default connect(stateValues, dispatchers)(withStyles(styles)(Arrangement));
