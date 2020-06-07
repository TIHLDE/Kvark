import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

// API and store imports
import NewsService from '../../api/services/NewsService';

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
  paper: {
    border: theme.sizes.border.width + ' solid ' + theme.colors.border.main,
    borderRadius: theme.sizes.border.radius,
    backgroundColor: theme.colors.background.light,
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

  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [news, setNews] = useState([]);
  const [selectedNewsItem, setSelectedNewsItem] = useState(defaultNewsItem);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Gets the news
  const loadNews = () => {
    setIsLoading(true);

    // Fetch news from server
    NewsService.getNews({}, (isError, loadedNews) => {
      if (isError === false) {
        setNews(loadedNews);
      }
      setIsLoading(false);
    });
  };

  const saveNewsItem = () => {
    if (selectedNewsItem.id) {
      NewsService.putNews(selectedNewsItem.id, selectedNewsItem)
          .then((data) => {
            setNews((news) => news.map((newsItem) => {
              let returnValue = {...newsItem};
              if (newsItem.id === data.id) {
                returnValue = data;
              }
              return returnValue;
            }));
            openSnackbar('Nyheten ble oppdatert');
          })
          .catch((e) => openSnackbar(JSON.stringify(e)));
    } else {
      NewsService.createNewNews(selectedNewsItem)
          .then((data) => {
            setNews((news) => [...news, data]);
            setSelectedNewsItem(data);
            openSnackbar('Nyheten ble opprettet');
          })
          .catch((e) => openSnackbar(JSON.stringify(e)));
    }
  };

  const deleteNewsItem = () => {
    if (selectedNewsItem.id) {
      NewsService.deleteNews(selectedNewsItem.id)
          .then((data) => {
            setNews((news) => news.filter((newsItem) => newsItem.id !== selectedNewsItem.id));
            setSelectedNewsItem(defaultNewsItem);
            openSnackbar('Nyheten ble slettet');
          })
          .catch((e) => openSnackbar(JSON.stringify(e)));
    } else {
      openSnackbar('Du kan ikke slette en nyhet som ikke er opprettet');
    }
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div className={classes.paper}>
            {tab === 0 && <NewsEditor newsItem={selectedNewsItem} setNewsItem={(item) => setSelectedNewsItem(item)}></NewsEditor>}
            {tab === 1 && <NewsRenderer newsData={selectedNewsItem} />}
          </div>
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
