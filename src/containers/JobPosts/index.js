import { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Text
import Text from '../../text/JobPostText';

// API, Actions and Selector imports
import { useJobPost } from '../../api/hooks/JobPost';

// Material UI Components
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// Icons
// Project Components
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import Pageination from '../../components/layout/Pageination';
import NoPostsIndicator from './components/NoPostsIndicator';
import ListItem from '../../components/miscellaneous/ListItem';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    paddingTop: 10,
  },
  wrapper: {
    paddingTop: '10px',
    paddingBottom: '30px',

    maxWidth: 1200,

    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    margin: 'auto',
    gridGap: '15px',
    justifyContent: 'center',

    '@media only screen and (max-width: 1200px)': {
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridTemplateRows: 'auto',
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
    display: 'grid',
    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  settings: {
    position: 'sticky',
    top: 88,

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
  mt: {
    marginTop: 10,
  },
  resetBtn: {
    marginTop: 10,
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.light,
    },
  },
});

function JobPosts(props) {
  const { classes } = props;
  const { getJobPosts } = useJobPost();
  const [jobPosts, setJobPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchPosts = (urlParameters = {}) => {
    setIsFetching(true);
    if (jobPosts.length > 0 && urlParameters === {}) {
      setIsFetching(false);
      return;
    }
    getJobPosts(urlParameters).then((posts) => {
      let displayedJobPosts = posts.results;
      const nextPageUrl = posts.next;
      const newUrlParameters = {};

      // If we have a url for the next page convert it into a object
      if (nextPageUrl) {
        const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
        const parameterArray = nextPageUrlQuery.split('&');
        parameterArray.forEach((parameter) => {
          const parameterString = parameter.split('=');
          newUrlParameters[parameterString[0]] = parameterString[1];
        });
      }
      setNextPage(newUrlParameters['page'] || null);

      // If we allready have jobposts
      if (urlParameters.page) {
        displayedJobPosts = [...jobPosts, ...displayedJobPosts];
      }
      setJobPosts(displayedJobPosts);

      // Used to load expired jobposts when we have nothing else to show.
      if (displayedJobPosts.length === 0 && !urlParameters.expired && urlParameters.search) {
        setFilters({ ...filters, expired: true });
        return;
      }
      setIsLoading(false);
      setIsFetching(false);
    });
  };

  useEffect(() => {
    const urlParameters = { ...filters };
    if (urlParameters.search === '') {
      delete urlParameters.search;
    }
    fetchPosts(urlParameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const resetFilters = () => {
    setSearchInput('');
    setFilters({});
    setNextPage(null);
  };

  const searchForPosts = (e) => {
    e.preventDefault();
    const newFilters = {};
    newFilters.search = searchInput;
    setFilters(newFilters);
  };

  const getNextPage = () => {
    const newFilters = { ...filters };
    newFilters.page = nextPage;
    setFilters(newFilters);
  };

  return (
    <Navigation fancyNavbar>
      <Helmet>
        <title>Karriere - TIHLDE</title>
      </Helmet>
      <Banner title='Karriere' />
      {!isLoading && (
        <>
          <div className={classes.root}>
            <div className={classes.wrapper}>
              <div className={classes.grid}>
                {isFetching ? (
                  <CircularProgress className={classes.progress} />
                ) : (
                  <div className={classes.listRoot}>
                    <Grow in={!isFetching}>
                      <div className={classes.list}>
                        <Pageination nextPage={getNextPage} page={nextPage}>
                          {jobPosts.map((jobPost) => (
                            <ListItem imgContain jobpost={jobPost} key={jobPost.id} />
                          ))}
                          {jobPosts.length === 0 && <NoPostsIndicator />}
                        </Pageination>
                      </div>
                    </Grow>
                  </div>
                )}
                <div>
                  <Paper className={classes.settings}>
                    <form>
                      <TextField
                        className={classes.paddingBtn}
                        fullWidth
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder='Søk...'
                        value={searchInput}
                      />
                      <Button color='primary' fullWidth onClick={searchForPosts} type='submit' variant='outlined'>
                        {Text.search}
                      </Button>
                    </form>
                    <Divider className={classes.mt} />
                    <Button className={classes.resetBtn} color='primary' fullWidth onClick={resetFilters} variant='outlined'>
                      {Text.reset}
                    </Button>
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Navigation>
  );
}

JobPosts.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(JobPosts);
