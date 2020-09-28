import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

// Project components
import TextEditor from '../../../components/inputs/TextEditor';

const styles = () => ({
  root: {
    padding: 20,
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,

    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  field: {
    margin: '5px 0px',
    maxWidth: 300,
  },
  margin: {
    margin: '10px 0px',
  },
});

function JobPostEditor(props) {
  const { classes, jobPost, setJobPost } = props;

  return (
    <div className={classes.root}>
      {!jobPost ? (
        <CircularProgress className={classes.progress} />
      ) : (
        <form>
          <Grid container direction='column' wrap='nowrap'>
            <TextField
              className={classes.field}
              label='Tittel'
              onChange={(e) => setJobPost({ ...jobPost, title: e.target.value })}
              required
              value={jobPost.title || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='Ingress'
              multiline
              onChange={(e) => setJobPost({ ...jobPost, ingress: e.target.value })}
              required
              rowsMax={3}
              value={jobPost.ingress || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='Sted'
              multiline
              onChange={(e) => setJobPost({ ...jobPost, location: e.target.value })}
              required
              rowsMax={3}
              value={jobPost.location || ''}
              variant='filled'
            />
            <TextEditor className={classes.textEditor} onChange={(e) => setJobPost({ ...jobPost, body: e })} value={jobPost.body || ''} />
            <Divider className={classes.margin} />
            <TextField
              className={classes.field}
              label='Logo bilde-url'
              multiline
              onChange={(e) => setJobPost({ ...jobPost, image: e.target.value })}
              required
              rowsMax={3}
              value={jobPost.image || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='Alternativ bildetekst'
              multiline
              onChange={(e) => setJobPost({ ...jobPost, image_alt: e.target.value })}
              required
              rowsMax={3}
              value={jobPost.image_alt || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='Bedrift'
              onChange={(e) => setJobPost({ ...jobPost, company: e.target.value })}
              required
              value={jobPost.company || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='E-post'
              onChange={(e) => setJobPost({ ...jobPost, email: e.target.value })}
              value={jobPost.email || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              InputLabelProps={{ shrink: true }}
              label='Frist'
              onChange={(e) => setJobPost({ ...jobPost, deadline: e.target.value })}
              pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
              type='datetime-local'
              value={jobPost.deadline.substring(0, 16) || new Date().toISOString().substring(0, 16)}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='Link'
              onChange={(e) => setJobPost({ ...jobPost, link: e.target.value })}
              value={jobPost.link || ''}
              variant='filled'
            />
          </Grid>
        </form>
      )}
    </div>
  );
}

JobPostEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  jobPost: PropTypes.object.isRequired,
  setJobPost: PropTypes.func.isRequired,
};

export default withStyles(styles)(JobPostEditor);
