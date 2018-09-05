import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {refactorDateString} from '../utils';
import classNames from 'classnames';

// API and store imports
import API from '../api/api';
import {GeneralActions} from '../store/actions/MainActions';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Project components
import Navigation from '../components/Navigation';

const styles = {
    root: {
        margin: 'auto',
        width: '100%',
        maxWidth: 900,
        backgroundColor: '#ebebe',
        overflow: 'hidden',
    },
    image: {
       
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
        maxHeight: 500,
        

        '@media only screen and (max-width: 600px)': {
            order: 0,
        },
    },
    title: {
        margin: '20px 0 10px 0',
        '@media only screen and (max-width: 800px)': {
            fontSize: '1em',
        },
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.7em',
            order: 1,
        }
    },
    subtitle: {
        margin: '5px 0',
        '@media only screen and (max-width: 800px)': {
            fontSize: '0.7em',
        },
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.5em',
            order: 2,
        },
    },
    caption: {
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.4em',
            order: 3,
        },
    },
    contentText: {
        fontSize: '0.55em',
        marginTop: 30,
        marginBottom: 100,
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.5em',
            order: 4,
        }
    },
    avatar: {
        borderRadius: 0,
        width: '50px',
        height: '50px',
    },
    text: {
        '@media only screen and (max-width: 800px)': {
            padding: '0 15px',
        }
    },
};

class NewsPage extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: false,
        }
    }
    
    componentDidMount() {
        window.scrollTo(0,0);
        this.loadNews();
    }

    // Loading news info
    loadNews = () => {
        // Get newsitem id
        const id = this.props.match.params.id;

        // Does the item exist in store
        const itemExists = this.props.grid.findIndex((elem) => elem.id == id && elem.type === 'news') !== -1;

       // Item exists, get it from store
       if (itemExists) {
           this.props.selectStoredItem(id);
       }
       // Item does not exist, fetch from server
       else {
           this.setState({isLoading: true});
           const response = API.getNewsItem(id).response();
           response.then((data) => {
               if (!response.isError) {
                   this.props.setSelectedItem(data);
               } else {
                   // Redirect to 404
               }
               this.setState({isLoading: false});
           });
       }
    }

    render() {
        const {classes, selected} = this.props;
        const data = (selected && selected.data)? selected.data : (selected)? selected : {};
        const lastUpdated = (selected && selected.updated_at)? selected.updated_at : (data.updated_at)? data.updated_at : '';

        return (
            <Navigation footer isLoading={this.state.isLoading}>
                {(this.state.isLoading)? null : 
                    <Grid className={classes.root} container direction='column' wrap='nowrap'>
                        <Typography className={classNames(classes.text, classes.title)} variant='display2' color='inherit'>{data.title}</Typography>
                        <Typography className={classNames(classes.text, classes.subtitle)} variant='title'>{data.header}</Typography>
                        <Typography className={classNames(classes.text, classes.caption)} variant='body2' color='textSecondary'>Sist oppdatert: {refactorDateString(lastUpdated)}</Typography>
                        <img className={classes.image} src={data.image} alt={data.image_alt}/> 
                        <Typography className={classNames(classes.text, classes.contentText)}>
                            {data.body}
                        </Typography>
                    </Grid>
                }
            </Navigation>
        );
    }
}

NewsPage.propTypes = {
    classes: PropTypes.object,
    selected: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.array,
    selectStoredItem: PropTypes.func,
    setSelectedItem: PropTypes.func,
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

export default connect(stateValues, dispatchers)(withStyles(styles)(NewsPage));
