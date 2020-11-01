import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import URLS from '../../URLS';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import { urlEncode } from '../../utils';

// Service imports
import { useJobPostById } from '../../api/hooks/JobPost';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import JobPostRenderer from './components/JobPostRenderer';

const styles = {
  root: {
    maxWidth: 1200,
    margin: 'auto',
    padding: 12,
    paddingTop: 20,
  },
};

function JobPostDetails(props) {
  const { classes } = props;
  const { id } = useParams();
  const [jobPost, error] = useJobPostById(Number(id));
  const history = useHistory();

  useEffect(() => {
    if (error) {
      history.replace(URLS.jobposts);
    }
    if (jobPost) {
      history.replace(`${URLS.jobposts}${id}/${urlEncode(jobPost.title)}/`);
    }
  }, [id, history, jobPost, error]);

  return (
    <Navigation isLoading={!jobPost} whitesmoke>
      {jobPost && (
        <div className={classes.root}>
          <Helmet>
            <title>{jobPost.title} - TIHLDE</title>
            <meta content={jobPost.title} property='og:title' />
            <meta content='website' property='og:type' />
            <meta content={window.location.href} property='og:url' />
            <meta content={jobPost.logo} property='og:image' />
          </Helmet>
          <JobPostRenderer data={jobPost} />
        </div>
      )}
    </Navigation>
  );
}

JobPostDetails.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(JobPostDetails);
