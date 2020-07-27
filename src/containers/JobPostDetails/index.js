import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Service imports
import JobPostService from '../../api/services/JobPostService';

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
  const {classes, match} = props;
  const [isLoading, setIsLoading] = useState(true);
  const [jobPost, setJobPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = match.params.id;
    JobPostService.getPostById(id)
        .then((post) => {
          setJobPost(post);
          setIsLoading(false);
        });
  }, [match]);

  return (
    <Navigation isLoading={isLoading} whitesmoke>
      {!isLoading && jobPost &&
        <div className={classes.root}>
          <Helmet>
            <title>{jobPost.title} - TIHLDE</title>
            <meta property="og:title" content={jobPost.title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:image" content={jobPost.logo} />
          </Helmet>
          <JobPostRenderer data={jobPost}/>
        </div>
      }
    </Navigation>
  );
}

JobPostDetails.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

export default withStyles(styles)(JobPostDetails);
