import EditIcon from '@mui/icons-material/EditRounded';
import OpenIcon from '@mui/icons-material/OpenInBrowserRounded';
import { Collapse, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import URLS from 'URLS';

import JobPostEditor from 'pages/JobPostAdministration/components/JobPostEditor';

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

const JobPostAdministration = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { jobPostId } = useParams();
  const editTab = { value: 'edit', label: jobPostId ? 'Endre' : 'Skriv', icon: EditIcon };
  const navigateTab = { value: 'navigate', label: 'Se annonse', icon: OpenIcon };
  const tabs = jobPostId ? [editTab, navigateTab] : [editTab];
  const [tab, setTab] = useState(editTab.value);

  const goToJobPost = (newJobPost: number | null) => {
    if (newJobPost) {
      navigate(`${URLS.jobpostsAdmin}${newJobPost}/`);
    } else {
      setTab(editTab.value);
      navigate(URLS.jobpostsAdmin);
    }
  };

  return (
    // TODO: Add SidebarList when migration is done
    // <Page
    //   maxWidth={false}
    //   options={{ lightColor: 'blue', filledTopbar: true, gutterBottom: true, gutterTop: true, noFooter: true, title: 'Admin jobbannonser' }}>
    //   <SidebarList
    //     descKey='company'
    //     idKey='id'
    //     onItemClick={(id: number | null) => goToJobPost(id || null)}
    //     selectedItemId={Number(jobPostId)}
    //     title='Annonser'
    //     titleKey='title'
    //     useHook={useJobPosts}
    //   />
    <div className='w-full px-2 md:px-12 mt-20'>
      <div className={classes.root}>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h2'>
            {jobPostId ? 'Endre annonse' : 'Ny annonse'}
          </Typography>
          <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
          <Paper>
            <Collapse in={tab === editTab.value} mountOnEnter>
              <JobPostEditor goToJobPost={goToJobPost} jobpostId={Number(jobPostId)} />
            </Collapse>
            {tab === navigateTab.value && <Navigate to={`${URLS.jobposts}${jobPostId}/`} />}
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default JobPostAdministration;
