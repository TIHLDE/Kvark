import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// API and store imports
import API from '../api/api';
import {GeneralActions} from '../store/actions/MainActions';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Project components
import Navigation from '../components/Navigation';

const styles = {
    root: {
        margin: 'auto',
        width: '100%',
        maxWidth: '1200px',
        backgroundColor: '#ebebe',
        overflow: 'hidden',
    },
    image: {
        maxHeight: '700px',
        height: 'auto',
        width: '100%',
    },
    contentWrapper: {
        position: 'relative',
    },
    content: {
        height: 'auto',
        width: '100%',

        display: 'grid',
        gridTemplateRows: '1fr auto',

        marginBottom: 30,
    },
    newsContent: {
        backgroundColor: 'white',
        padding: 20,
    },
    contentTop: {
        marginBottom: 10,
    },
    title: {
        '@media only screen and (max-width: 800px)': {
            fontSize: '1em',
        },
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.7em',
        }
    },
    subtitle: {
        '@media only screen and (max-width: 800px)': {
            fontSize: '0.7em',
        },
        '@media only screen and (max-width: 600px)': {
            fontSize: '0.5em',
        }
    },
    contentText: {
        fontSize: '0.55em',
    },
    avatar: {
        borderRadius: 0,
        width: '50px',
        height: '50px',
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
        this.loadNews();
    }

    // Loading news info
    loadNews = () => {
        // Get newsitem id
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
           const response = API.getNewsItem(id).response();
           response.then((data) => {
               if (!response.isError) {
                   console.log(data);
                   this.props.setSelectedItem(data);
               }
               this.setState({isLoading: false});
           });
       }
    }

    render() {
        const {classes, selected} = this.props;
        const data = (selected && selected.data)? selected.data : (selected)? selected : {};

        return (
            <Navigation isLoading={this.state.isLoading}>
                {(this.state.isLoading)? null : 
                    <Grid className={classes.root} container direction='column' wrap='nowrap'>
                        <img className={classes.image} src={data.image} alt={data.image_alt}/>
                        <div className={classes.contentWrapper}>
                            <Paper className={classes.content} elevation={0}>
                                <div className={classes.newsContent}>
                                    <div className={classes.contentTop}>
                                        <Typography className={classes.title} variant='display2'>{data.title}</Typography>
                                        <Typography className={classes.subtitle} variant='title'>{data.header}</Typography>
                                    </div>
                                    <Typography className={classes.contentText}>
                                        {data.body}
                                    </Typography>
                                </div>
                            </Paper>
                        </div>
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
