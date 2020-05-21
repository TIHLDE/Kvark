import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Service imports
import JobPostService from '../../api/services/JobPostService';

// Material UI Components

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

class JobPostDetails extends Component {

    state = {
      isLoading: true,
      post: {},
    }

    // Gets the event
    componentDidMount() {
      window.scrollTo(0, 0);
      // Get eventItem id
      const id = this.props.match.params.id;
      JobPostService.getPostById(id)
          .then((post) => {
            this.setState({isLoading: false, post: post});
          });
    }

    render() {
      const {classes} = this.props;
      return (
        <Navigation isLoading={this.state.isLoading} whitesmoke>
          {!this.state.isLoading &&
                    <div className={classes.root}>
                      <JobPostRenderer data={this.state.post}/>
                    </div>
          }
        </Navigation>
      );
    }
}

JobPostDetails.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

export default withStyles(styles)(JobPostDetails);
