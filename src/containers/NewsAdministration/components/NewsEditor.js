import PropTypes from 'prop-types';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

// Project components
import MarkdownEditor from '../../../components/inputs/MarkdownEditor';

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

function NewsEditor(props) {
  const { classes, newsItem, setNewsItem } = props;

  return (
    <div className={classes.root}>
      {!newsItem ? (
        <CircularProgress className={classes.progress} />
      ) : (
        <form>
          <Grid container direction='column' wrap='nowrap'>
            <TextField
              className={classes.field}
              label='Tittel'
              onChange={(e) => setNewsItem({ ...newsItem, title: e.target.value })}
              required
              value={newsItem.title || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='Header'
              multiline
              onChange={(e) => setNewsItem({ ...newsItem, header: e.target.value })}
              required
              rowsMax={3}
              value={newsItem.header || ''}
              variant='filled'
            />
            <MarkdownEditor onChange={(e) => setNewsItem({ ...newsItem, body: e.target.value })} value={newsItem.body || ''} variant='filled' />
            <Divider className={classes.margin} />
            <TextField
              className={classes.field}
              label='Bilde url'
              multiline
              onChange={(e) => setNewsItem({ ...newsItem, image: e.target.value })}
              rowsMax={3}
              value={newsItem.image || ''}
              variant='filled'
            />
            <TextField
              className={classes.field}
              label='Alternativ bildetekst'
              multiline
              onChange={(e) => setNewsItem({ ...newsItem, image_alt: e.target.value })}
              rowsMax={3}
              value={newsItem.image_alt || ''}
              variant='filled'
            />
          </Grid>
        </form>
      )}
    </div>
  );
}

NewsEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  newsItem: PropTypes.object.isRequired,
  setNewsItem: PropTypes.func.isRequired,
};

export default withStyles(styles)(NewsEditor);
