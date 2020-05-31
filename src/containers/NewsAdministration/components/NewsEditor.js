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

function NewsEditor(props) {
  const {classes, newsItem, setNewsItem} = props;

  return (
    <div className={classes.root}>
      {!newsItem ?
        <CircularProgress className={classes.progress} /> :
        <form>
          <Grid container direction='column' wrap='nowrap'>
            <TextField variant='filled' className={classes.field} label='Tittel' value={newsItem.title || ''} onChange={(e) => setNewsItem({...newsItem, title: e.target.value})} required/>
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Header' value={newsItem.header || ''} onChange={(e) => setNewsItem({...newsItem, header: e.target.value})} required/>
            <TextEditor className={classes.textEditor} value={newsItem.body || ''} onChange={(e) => setNewsItem({...newsItem, body: e})}/>
            <Divider className={classes.margin} />
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Bilde url' value={newsItem.image || ''} onChange={(e) => setNewsItem({...newsItem, image: e.target.value})} required/>
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Alternativ bildetekst' value={newsItem.image_alt || ''} onChange={(e) => setNewsItem({...newsItem, image_alt: e.target.value})} required/>
          </Grid>
        </form>
      }
    </div>
  );
}

NewsEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  newsItem: PropTypes.object.isRequired,
  setNewsItem: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewsEditor);
