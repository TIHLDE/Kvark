import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Project components
import Head from "../components/Head"
import Navigation from "../components/Navigation";
import Information from "../components/Information";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import connect from 'react-redux/es/connect/connect';


// API and store imports
import API from '../api/api';
import { setSelectedItem, selectItem } from '../store/actions/GridActions';


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
        gridTemplateColumns: '60%',
        gridTemplateRows:'auto',
        margin:'auto',
        gridGap:'30px',
        justifyContent:'center',
    },
    headliner:{
        borderStyle:'none none solid none',
        borderColor:'gray',
        borderWidth: '1px',
        textAlign: 'center'
    },
    text:{
        width:'60%',
        margin:'auto'
    },

};


class Arrangement extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
        }
    }

    // Gets the event
    loadEvent = () => {
        const { grid, dispatch } = this.props;
        // Get eventItem id
        const id = this.props.match.params.id;
        // If item exists in store, it will be loaded to state
        dispatch(selectItem(id));
        // Item does not exist, fetch from server
        if (grid.selectedItem == null) {
            this.setState({isLoading: true});
            const response = API.getEventItem(id).response();
            response.then((data) => {
                if (!response.isError) {
                    dispatch(setSelectedItem(data));
                } else {
                    // Redirect to 404
                    this.props.history.replace('/');
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
        const {classes, grid} = this.props;
        const selected = grid.selectedItem;
        const data = (selected && selected.data)? selected.data : (selected)? selected : {};


        return (
            <Navigation isLoading={this.state.isLoading} footer>
                {(this.state.isLoading)? null :
                    <div className={classes.root}>
                    <Head data={data} />
                    <div className={classes.wrapper}>
                        <div className={classes.headliner}>
                            <Typography variant='display3'> {data.title} </Typography>
                        </div>
                        <Information data={data}/>
                        <Button variant="contained" color="primary" style={{margin:'auto'}}>
                            Meld deg på
                        </Button>
                        <div className={classes.text}>
                            {data.description}
                        </div>
                    </div>
                    </div>
                }
            </Navigation>
        );
    }
}


Arrangement.propTypes = {
    classes: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.object,
};

Arrangement.defaultProps = {
    id: "-1"
};

const stateValues = (state) => {
    return {
        grid: state.grid
    };
};


export default connect(stateValues)(withStyles(styles)(Arrangement));
