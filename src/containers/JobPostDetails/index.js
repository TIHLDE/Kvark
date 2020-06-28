import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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
  const [jobPost, setJobPost] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = match.params.id;
    JobPostService.getPostById(id)
        .then((post) => {
          setIsLoading(false);
          setJobPost(post);
        });
  }, [match]);

  return (
    <Navigation isLoading={isLoading} whitesmoke>
      {!isLoading &&
        <div className={classes.root}>
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
