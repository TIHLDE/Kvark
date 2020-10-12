import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// API and store imports
import JobPostService from '../../api/services/JobPostService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Project components
import Navigation from '../../components/navigation/Navigation';
import SidebarList from '../../components/layout/SidebarList';
import DropdownButton from '../../components/miscellaneous/DropdownButton';
import JobPostRenderer from '../JobPostDetails/components/JobPostRenderer';
import JobPostEditor from './components/JobPostEditor';
import Paper from '../../components/layout/Paper';

const SIDEBAR_WIDTH = 300;

const styles = (theme) => ({
  root: {
    paddingLeft: SIDEBAR_WIDTH,
    paddingBottom: 50,
    '@media only screen and (max-width: 800px)': {
      padding: 0,
    },
  },
  content: {
    width: '80%',
    maxWidth: 1100,
    marginTop: 50,
    display: 'block',
    margin: 'auto',

    '@media only screen and (max-width: 800px)': {
      width: 'auto',
      margin: 10,
      padding: '36px 20px',
    },
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  snackbar: {
    marginTop: 55,
    backgroundColor: theme.palette.colors.background.smoke,
    color: theme.palette.colors.text.main,
  },
  header: {
    color: theme.palette.colors.text.main,
  },
  renderer: {
    margin: 10,
  },
});

const defaultJobPost = {
  image: null,
  image_alt: null,
  title: null,
  ingress: null,
  body: null,
  location: null,
  deadline: new Date().toISOString().substring(0, 16),
  company: null,
  email: null,
  link: null,
};

function JobPostAdministration(props) {
  const { classes } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJobPost, setSelectedJobPost] = useState(defaultJobPost);
  const [expiredItems, setExpiredItems] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Gets the job posts
  const loadJobPosts = (parameters = { page: 1 }) => {
    parameters['newest'] = true;
    setIsLoading(true);

    // Fetch job posts from server
    JobPostService.getJobPosts(parameters).then((data) => {
      setJobPosts([...jobPosts, ...data.results]);
      const nextPageUrl = data.next;
      const urlParameters = {};

      // If we have a url for the next page convert it into a object
      if (nextPageUrl) {
        const nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
        const parameterArray = nextPageUrlQuery.split('&');
        parameterArray.forEach((parameter) => {
          const parameterString = parameter.split('=');
          urlParameters[parameterString[0]] = parameterString[1];
        });
      }
      setNextPage(urlParameters['page'] ? Number(urlParameters['page']) : null);
      setIsLoading(false);
    });
  };

  const saveJobPost = () => {
    if (selectedJobPost.id) {
      JobPostService.putJobPost(selectedJobPost.id, selectedJobPost)
        .then((data) => {
          setJobPosts((jobPosts) =>
            jobPosts.map((jobPostItem) => {
              let returnValue = { ...jobPostItem };
              if (jobPostItem.id === data.id) {
                returnValue = data;
              }
              return returnValue;
            }),
          );
          openSnackbar('Annonsen ble oppdatert');
        })
        .catch((e) => openSnackbar(JSON.stringify(e)));
    } else {
      JobPostService.createJobPost(selectedJobPost)
        .then((data) => {
          setJobPosts((jobPosts) => [...jobPosts, data]);
          setSelectedJobPost(data);
          openSnackbar('Annonsen ble opprettet');
        })
        .catch((e) => openSnackbar(JSON.stringify(e)));
    }
  };

  const deleteJobPost = () => {
    if (selectedJobPost.id) {
      JobPostService.deleteJobPost(selectedJobPost.id)
        .then(() => {
          setJobPosts((jobPosts) => jobPosts.filter((jobPostItem) => jobPostItem.id !== selectedJobPost.id));
          setSelectedJobPost(defaultJobPost);
          openSnackbar('Annonsen ble slettet');
        })
        .catch((e) => openSnackbar(JSON.stringify(e)));
    } else {
      openSnackbar('Du kan ikke slette en annonse som ikke er opprettet');
    }
  };

  const fetchExpired = () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    JobPostService.getExpiredData((isError, data) => {
      if (!isError) {
        setExpiredItems(data.results || data || []);
      }
      setIsLoading(false);
    });
  };

  const getNextPage = () => {
    loadJobPosts({ page: nextPage });
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  useEffect(() => {
    loadJobPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = [
    { text: 'Lagre', func: () => saveJobPost() },
    { text: 'Slett', func: () => deleteJobPost() },
  ];

  return (
    <Navigation noFooter whitesmoke>
      <Helmet>
        <title>Annonseadmin - TIHLDE</title>
      </Helmet>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        open={showSnackbar}>
        <SnackbarContent className={classes.snackbar} message={snackbarMessage} />
      </Snackbar>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.top}>
            <Typography className={classes.header} variant='h4'>
              {selectedJobPost.id ? 'Endre annonse' : 'Ny annonse'}
            </Typography>
            <DropdownButton options={options} />
          </div>
          <Tabs aria-label='tabs' indicatorColor='primary' onChange={(e, newTab) => setTab(newTab)} textColor='primary' value={tab}>
            <Tab id='0' label={selectedJobPost.id ? 'Endre' : 'Skriv'} />
            <Tab id='1' label='Forhåndsvis' />
          </Tabs>
          <Paper className={classes.paper} noPadding>
            {tab === 0 && <JobPostEditor jobPost={selectedJobPost} setJobPost={(item) => setSelectedJobPost(item)} />}
            {tab === 1 && (
              <div className={classes.renderer}>
                <JobPostRenderer
                  data={{
                    ...selectedJobPost,
                    logo: selectedJobPost.image,
                    logoAlt: selectedJobPost.image_alt,
                  }}
                />
              </div>
            )}
          </Paper>
        </div>
      </div>
      <SidebarList
        expiredItems={expiredItems}
        fetchExpired={fetchExpired}
        getNextPage={getNextPage}
        isLoading={isLoading}
        items={jobPosts}
        nextPage={nextPage}
        onItemClick={(item) => setSelectedJobPost(item || defaultJobPost)}
        selectedItemId={selectedJobPost?.id || null}
        title='Annonser'
        width={SIDEBAR_WIDTH}
      />
    </Navigation>
  );
}

JobPostAdministration.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JobPostAdministration);
