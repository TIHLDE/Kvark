import EditIcon from '@mui/icons-material/EditRounded';
import OpenIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Collapse, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import NewsEditor from 'pages/NewsAdministration/components/NewsEditor';

import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginLeft: theme.spacing(35),
    [theme.breakpoints.down('lg')]: {
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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { newsId } = useParams();
  const editTab = { value: 'edit', label: newsId ? 'Endre' : 'Skriv', icon: EditIcon };
  const navigateTab = { value: 'navigate', label: 'Se nyhet', icon: OpenIcon };
  const tabs = newsId ? [editTab, navigateTab] : [editTab];
  const [tab, setTab] = useState(editTab.value);

  const goToNews = (newNews: number | null) => {
    if (newNews) {
      navigate(`${URLS.newsAdmin}${newNews}/`);
    } else {
      setTab(editTab.value);
      navigate(URLS.newsAdmin);
    }
  };

  return (
    // TODO: Add SidebarList when migration is done
    // <Page maxWidth={false} options={{ lightColor: 'blue', filledTopbar: true, gutterBottom: true, gutterTop: true, noFooter: true, title: 'Admin nyheter' }}>
    //   <SidebarList
    //     descKey='header'
    //     idKey='id'
    //     noExpired
    //     onItemClick={(id: number | null) => goToNews(id || null)}
    //     selectedItemId={Number(newsId)}
    //     title='Nyheter'
    //     titleKey='title'
    //     useHook={useNews}
    //   />
    <div className='w-full px-2 md:px-12 mt-20'>
      <div className={classes.root}>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h2'>
            {newsId ? 'Endre nyhet' : 'Ny nyhet'}
          </Typography>
          <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
          <Paper>
            <Collapse in={tab === editTab.value} mountOnEnter>
              <NewsEditor goToNews={goToNews} newsId={Number(newsId)} />
            </Collapse>
            {tab === navigateTab.value && <Navigate to={`${URLS.news}${newsId}/`} />}
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default NewsAdministration;
