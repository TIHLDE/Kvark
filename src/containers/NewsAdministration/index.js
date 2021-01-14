import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// API and store imports
import { useNews } from '../../api/hooks/News';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
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
    backgroundColor: theme.palette.background.smoke,
    color: theme.palette.text.primary,
  },
  header: {
    color: theme.palette.text.primary,
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
  const { classes } = props;
  const [tab, setTab] = useState(0);
  const [selectedNewsItem, setSelectedNewsItem] = useState(defaultNewsItem);
  const { getNews, createNews, updateNews, deleteNews } = useNews();
  const [news, setNews] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const saveNewsItem = () =>
    selectedNewsItem.id
      ? updateNews(selectedNewsItem.id, selectedNewsItem)
          .then((data) => {
            setSelectedNewsItem(data);
            openSnackbar('Nyheten ble oppdatert');
          })
          .catch((error) => openSnackbar(error?.detail))
      : createNews(selectedNewsItem)
          .then((data) => {
            setSelectedNewsItem(data);
            openSnackbar('Nyheten ble opprettet');
          })
          .catch((error) => openSnackbar(error?.detail));

  const deleteNewsItem = () =>
    selectedNewsItem.id
      ? deleteNews(selectedNewsItem.id)
          .then(() => {
            setSelectedNewsItem(defaultNewsItem);
            openSnackbar('Nyheten ble slettet');
          })
          .catch((error) => openSnackbar(error?.detail))
      : openSnackbar('Du kan ikke slette en nyhet som ikke er opprettet');

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  useEffect(() => {
    getNews().then((news) => setNews(news));
  }, [getNews]);

  const options = [
    { text: 'Lagre', func: () => saveNewsItem() },
    { text: 'Slett', func: () => deleteNewsItem() },
  ];

  return (
    <Navigation noFooter>
      <Helmet>
        <title>Nyhetsadmin - TIHLDE</title>
      </Helmet>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        open={showSnackbar}>
        <SnackbarContent className={classes.snackbar} message={snackbarMessage} />
      </Snackbar>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.top}>
            <Typography className={classes.header} variant='h4'>
              {selectedNewsItem.id ? 'Endre nyhet' : 'Ny nyhet'}
            </Typography>
            <DropdownButton options={options} />
          </div>
          <Tabs aria-label='tabs' indicatorColor='primary' onChange={(e, newTab) => setTab(newTab)} textColor='primary' value={tab}>
            <Tab id='0' label={selectedNewsItem.id ? 'Endre' : 'Skriv'} />
            <Tab id='1' label='Forhåndsvis' />
          </Tabs>
          <Paper noPadding>
            {tab === 0 && <NewsEditor newsItem={selectedNewsItem} setNewsItem={(item) => setSelectedNewsItem(item)}></NewsEditor>}
            {tab === 1 && <NewsRenderer newsData={selectedNewsItem} />}
          </Paper>
        </div>
      </div>
      <SidebarList
        hideExpired
        isLoading={!news}
        items={news || []}
        onItemClick={(item) => setSelectedNewsItem(news.find((newsItem) => newsItem.id === item) || defaultNewsItem)}
        selectedItemId={selectedNewsItem?.id || null}
        title='Nyheter'
        width={SIDEBAR_WIDTH}
      />
    </Navigation>
  );
}

NewsAdministration.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewsAdministration);
