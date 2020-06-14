import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

// API and store imports
import {useNews, useCreateNews, usePutNews, useDeleteNews} from '../../api/hooks/News';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Project components
import Navigation from '../../components/navigation/Navigation';
import SidebarList from '../../components/layout/SidebarList';
import DropdownButton from '../../components/miscellaneous/DropdownButton';
import NewsRenderer from '../NewsDetails/components/NewsRenderer';
import NewsEditor from './components/NewsEditor';
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
    backgroundColor: theme.colors.background.smoke,
    color: theme.colors.text.main,
  },
  header: {
    color: theme.colors.text.main,
  },
});

const defaultNewsItem = {
  image: null,
  image_alt: null,
  title: null,
  header: null,
  body: null,
};

function NewsAdministration(props) {
  const {classes} = props;
  const [tab, setTab] = useState(0);
  const [selectedNewsItem, setSelectedNewsItem] = useState(defaultNewsItem);
  const [news, isLoading] = useNews();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const createNews = useCreateNews(selectedNewsItem, (data, isError) => {
    if (!isError) {
      setSelectedNewsItem(data);
      openSnackbar('Nyheten ble opprettet');
    } else {
      openSnackbar(JSON.stringify(data));
    }
  });
  const putNews = usePutNews(selectedNewsItem.id, selectedNewsItem, (data, isError) => {
    if (!isError) {
      setSelectedNewsItem(data);
      openSnackbar('Nyheten ble oppdatert');
    } else {
      openSnackbar(JSON.stringify(data));
    }
  });
  const deleteNews = useDeleteNews(selectedNewsItem.id, (data, isError) => {
    if (!isError) {
      setSelectedNewsItem(defaultNewsItem);
      openSnackbar('Nyheten ble slettet');
    } else {
      openSnackbar(JSON.stringify(data));
    }
  });

  const saveNewsItem = () => selectedNewsItem.id ? putNews() : createNews();

  const deleteNewsItem = () => selectedNewsItem.id ? deleteNews() : openSnackbar('Du kan ikke slette en nyhet som ikke er opprettet');

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  useEffect(() => window.scrollTo(0, 0), []);

  const options = [{text: 'Lagre', func: () => saveNewsItem()}, {text: 'Slett', func: () => deleteNewsItem()}];

  return (
    <Navigation whitesmoke>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setShowSnackbar(false)}>

        <SnackbarContent
          className={classes.snackbar}
          message={snackbarMessage}/>
      </Snackbar>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.top}>
            <Typography className={classes.header} variant='h4'>{selectedNewsItem.id ? 'Endre nyhet' : 'Ny nyhet'}</Typography>
            <DropdownButton options={options} />
          </div>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, newTab) => setTab(newTab)}
            aria-label="tabs"
          >
            <Tab id='0' label={selectedNewsItem.id ? 'Endre' : 'Skriv'} />
            <Tab id='1' label="Forhåndsvis" />
          </Tabs>
          <Paper noPadding>
            {tab === 0 && <NewsEditor newsItem={selectedNewsItem} setNewsItem={(item) => setSelectedNewsItem(item)}></NewsEditor>}
            {tab === 1 && <NewsRenderer newsData={selectedNewsItem} />}
          </Paper>
        </div>
      </div>
      <SidebarList
        items={news}
        selectedItemId={selectedNewsItem?.id || null}
        onItemClick={(item) => setSelectedNewsItem(item || defaultNewsItem)}
        hideExpired
        title='Nyheter'
        isLoading={isLoading}
        width={SIDEBAR_WIDTH}
      />
    </Navigation>
  );
}

NewsAdministration.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewsAdministration);
