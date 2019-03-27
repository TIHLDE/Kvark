import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import URLS from '../../URLS';
import {MuiThemeProvider as Theme} from '@material-ui/core/styles';
import {errorTheme} from '../../theme';

// Text
import Text from '../../text/JobPostText';

// API, Actions and Selector imports
import JobPostService from '../../api/services/JobPostService';
import * as JobPostActions from '../../store/actions/JobPostActions';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import NoPostsIndicator from './components/NoPostsIndicator';
import JobPostItem from './components/JobPostItem';

const styles = {
    root: {
        paddingTop: 10,
    },
    wrapper: {
        paddingTop:'10px',
        paddingBottom:'30px',

        maxWidth: 1200,

        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows:'auto',
        margin:'auto',
        gridGap:'15px',
        justifyContent:'center',

        '@media only screen and (max-width: 1200px)': {
            paddingLeft: 6,
            paddingRight: 6,
        }
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
    settings: {
        position: 'sticky',
        top: 88,
        padding: 28,

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
};

const bannerImage = 'https://www.incimages.com/uploaded_files/image/970x450/getty_186693264_200011642000928062_327104.jpg';

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
        window.scrollTo(0,0);
        this.setState({isLoading: true});
        this.fetchPosts();
    }

    fetchPosts = () => {
        JobPostService.getJobPosts()
        .then((posts) => {
            this.setState({isLoading: false, isFetching: false});
        });
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value});
    }

    goToJobPost = (id) => {
        this.props.history.push(URLS.jobposts + ''.concat(id, '/'));
    };

    resetFilters = () => {
        this.setState({isFetching: true, category: 0, search: ''});
        this.fetchPosts();
    }

    searchForPosts = (event) => {
        event.preventDefault();
        this.filterPosts(event, this.state.search);
    }

    filterPosts = (event, search) => {
        event.preventDefault();

        this.setState({isFetching: true});
        if(!search) {
            this.fetchPosts();
            return;
        }

        // Requested filters
        const filters = {search: search};
        
        // Fetch filtered job posts
        JobPostService.getJobPosts(filters, {expired: true})
        .then((posts) => {
            this.setState({isFetching: false});
        });
    }

    render() {
        const {classes} = this.props;
        const posts = this.props.posts || [];
        return (
            <Navigation whitesmoke footer isLoading={this.state.isLoading}>
                {this.state.isLoading ? null :
                <div className={classes.root}>
                    <div className={classes.wrapper}>
                        <Banner h6='Karriere' image={bannerImage}/>
                        <div className={classes.grid}>
                        
                            {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
                                <div className={classes.listRoot}>
                                    <Grow in={!this.state.isFetching}>
                                        <Paper className={classes.list} elevation={1} square>
                                            {posts.map((value, index) => (
                                                <div key={value.id}>
                                                    <JobPostItem key={value.id} data={value} onClick={() => this.goToJobPost(value.id)}/>
                                                    <Divider/>
                                                </div>
                                            ))}
                                            {posts.length === 0 && 
                                                <NoPostsIndicator />
                                            }
                                        </Paper>
                                    </Grow>
                                </div>
                            }
                            <div>
                                <Paper className={classes.settings} elevation={1} square> 
                                    <form>
                                        <TextField className={classes.paddingBtn} value={this.state.search} fullWidth placeholder='Søk...' onChange={this.handleChange('search')}/>
                                        <Button fullWidth variant='outlined' color='primary' type='submit' onClick={this.searchForPosts}>{Text.search}</Button>
                                    </form>
                                    <Divider className={classes.mt}/>
                                    <Typography className={classes.mt} variant='h6' gutterBottom>{Text.category}</Typography>

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
                </div>
                }
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