import URLS from 'URLS';
import { useNavigate, useParams } from 'react-router-dom';
import { useNews } from 'api/hooks/News';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project components
import Paper from 'components/layout/Paper';
import Navigation from 'components/navigation/Navigation';
import SidebarList from 'components/layout/SidebarList';
import NewsEditor from 'containers/NewsAdministration/components/NewsEditor';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginLeft: theme.spacing(35),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4, 1, 6),
      marginLeft: 0,
    },
  },
  content: {
    maxWidth: 900,
    margin: '0 auto',
  },
  header: {
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const NewsAdministration = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { newsId } = useParams();

  const goToNews = (newNews: number | null) => {
    if (newNews) {
      navigate(`${URLS.newsAdmin}${newNews}/`);
    } else {
      navigate(URLS.newsAdmin);
    }
  };

  return (
    <Navigation maxWidth={false} noFooter>
      <SidebarList
        descKey='header'
        idKey='id'
        noExpired
        onItemClick={(id: number | null) => goToNews(id || null)}
        selectedItemId={Number(newsId)}
        title='Nyheter'
        titleKey='title'
        useHook={useNews}
      />
      <div className={classes.root}>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h2'>
            {newsId ? 'Endre nyhet' : 'Ny nyhet'}
          </Typography>
          <Paper>
            <NewsEditor goToNews={goToNews} newsId={Number(newsId)} />
          </Paper>
        </div>
      </div>
    </Navigation>
  );
};

export default NewsAdministration;
