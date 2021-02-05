import { useMemo } from 'react';
import URLS from 'URLS';
import { useNavigate, useParams } from 'react-router-dom';

// API and store imports
import { useJobPosts } from 'api/hooks/JobPost';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project components
import Paper from 'components/layout/Paper';
import Navigation from 'components/navigation/Navigation';
import SidebarList from 'components/layout/SidebarList';
import JobPostEditor from 'containers/JobPostAdministration/components/JobPostEditor';

const useStyles = makeStyles((theme: Theme) => ({
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

const JobPostAdministration = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { jobPostId } = useParams();
  const { data, hasNextPage, fetchNextPage, isLoading } = useJobPosts();
  const jobposts = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const { data: expiredData, fetchNextPage: fetchNextExpiredPage } = useJobPosts({ expired: true });
  const expiredJobposts = useMemo(() => (expiredData ? expiredData.pages.map((page) => page.results).flat() : []), [expiredData]);

  const goToJobPost = (newJobPost: number | null) => {
    if (newJobPost) {
      navigate(`${URLS.jobpostsAdmin}${newJobPost}/`);
    } else {
      navigate(URLS.jobpostsAdmin);
    }
  };

  return (
    <Navigation maxWidth={false} noFooter>
      <SidebarList
        expiredItems={expiredJobposts}
        fetchExpired={() => fetchNextExpiredPage()}
        getNextPage={() => fetchNextPage()}
        isLoading={isLoading}
        items={jobposts}
        nextPage={hasNextPage}
        onItemClick={(id: number | null) => goToJobPost(id || null)}
        selectedItemId={Number(jobPostId)}
        title='Annonser'
      />
      <div className={classes.root}>
        <div className={classes.content}>
          <Typography className={classes.header} variant='h2'>
            {jobPostId ? 'Endre annonse' : 'Ny annonse'}
          </Typography>
          <Paper>
            <JobPostEditor goToJobPost={goToJobPost} jobpostId={Number(jobPostId)} />
          </Paper>
        </div>
      </div>
    </Navigation>
  );
};

export default JobPostAdministration;
