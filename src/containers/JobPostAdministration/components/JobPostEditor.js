import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

// Project components
import TextEditor from '../../../components/inputs/TextEditor';

const styles = (theme) => ({
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
  const {classes, jobPost, setJobPost} = props;

  return (
    <div className={classes.root}>
      {!jobPost ?
        <CircularProgress className={classes.progress} /> :
        <form>
          <Grid container direction='column' wrap='nowrap'>
            <TextField variant='filled' className={classes.field} label='Tittel' value={jobPost.title || ''} onChange={(e) => setJobPost({...jobPost, title: e.target.value})} required/>
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Ingress' value={jobPost.ingress || ''} onChange={(e) => setJobPost({...jobPost, ingress: e.target.value})} required/>
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Sted' value={jobPost.location || ''} onChange={(e) => setJobPost({...jobPost, location: e.target.value})} required/>
            <TextEditor className={classes.textEditor} value={jobPost.body || ''} onChange={(e) => setJobPost({...jobPost, body: e})}/>
            <Divider className={classes.margin} />
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Logo bilde-url' value={jobPost.image || ''} onChange={(e) => setJobPost({...jobPost, image: e.target.value})} required/>
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Alternativ bildetekst' value={jobPost.image_alt || ''} onChange={(e) => setJobPost({...jobPost, image_alt: e.target.value})} required/>
            <TextField variant='filled' className={classes.field} label='Bedrift' value={jobPost.company || ''} onChange={(e) => setJobPost({...jobPost, company: e.target.value})} required/>
            <TextField variant='filled' className={classes.field} label="E-post" value={jobPost.email || ''} onChange={(e) => setJobPost({...jobPost, email: e.target.value})}/>
            <TextField variant='filled' className={classes.field} InputLabelProps={{shrink: true}} type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Frist' value={jobPost.deadline.substring(0, 16) || new Date().toISOString().substring(0, 16)} onChange={(e) => setJobPost({...jobPost, deadline: e.target.value})}/>
            <TextField variant='filled' className={classes.field} label="Link" value={jobPost.link || ''} onChange={(e) => setJobPost({...jobPost, link: e.target.value})}/>
          </Grid>
        </form>
      }
    </div>
  );
}

JobPostEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  jobPost: PropTypes.object.isRequired,
  setJobPost: PropTypes.func.isRequired,
};

export default withStyles(styles)(JobPostEditor);
