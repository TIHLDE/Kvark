import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// API, Actions and Selector imports
import API from '../api/api';
import * as JobPostActions from '../store/actions/JobPostActions';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

// Project Components
import Navigation from '../components/Navigation';
import Banner from '../components/Banner';
import MessageIndicator from '../components/MessageIndicator';
import JobPostItem from '../components/JobPostComponents/JobPostItem';

const styles = {
    root: {
        paddingTop: 10,
    },
    wrapper: {
        maxWidth: 1200,
        margin: 'auto',
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
};

class JobPosts extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: false,
            isFetching: false,

            search: '',
        }
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = () => {
        const response = API.getJobPosts().response();
        response.then((data) => {
            if(response.isError === false) {
                this.props.setJobPosts(data);
            }
        });
    }

    render() {
        const {classes} = this.props;
        const posts = this.props.posts || [];
        return (
            <Navigation whitesmoke>
                <div className={classes.root}>
                    <div className={classes.wrapper}>
                        <Banner title='Annonser' image='https://www.incimages.com/uploaded_files/image/970x450/getty_186693264_200011642000928062_327104.jpg'/>
                        <div className={classes.grid}>
                        
                            {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
                                <div className={classes.listRoot}>
                                    <Grow in={!this.state.isFetching}>
                                        <Paper className={classes.list} elevation={1} square>
                                            {posts.map((value, index) => (
                                                <div key={value.id}>
                                                    <JobPostItem key={value.id} data={value}/>
                                                    <Divider/>
                                                </div>
                                            ))}
                                            {posts.length === 0 && 
                                                <MessageIndicator header={Text.noEvents} subheader={Text.subNoEvents}/>
                                            }
                                        </Paper>
                                    </Grow>
                                </div>
                            }
                        </div>
                    </div>
                    
                </div>
            </Navigation>
        );
    }
}

JobPosts.propTypes = {
    classes: PropTypes.object,
};

const mapStateToProps = (state) => ({
    posts: JobPostActions.getJobPosts(state),
});

const mapDispatchToProps = (dispatch) => ({
    setJobPosts: (data) => dispatch(JobPostActions.setJobPosts(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(JobPosts));