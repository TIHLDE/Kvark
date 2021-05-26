import URLS from 'URLS';
import { useNavigate, useParams } from 'react-router-dom';

// API and store imports
import { useJobPosts } from 'api/hooks/JobPost';

// Material-UI
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project components
import Paper from 'components/layout/Paper';
import Page from 'components/navigation/Page';
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

  const goToJobPost = (newJobPost: number | null) => {
    if (newJobPost) {
      navigate(`${URLS.jobpostsAdmin}${newJobPost}/`);
    } else {
      navigate(URLS.jobpostsAdmin);
    }
  };

  return (
    <Page
      maxWidth={false}
      options={{ lightColor: 'blue', filledTopbar: true, gutterBottom: true, gutterTop: true, noFooter: true, title: 'Admin jobbannonser' }}>
      <SidebarList
        descKey='company'
        idKey='id'
        onItemClick={(id: number | null) => goToJobPost(id || null)}
        selectedItemId={Number(jobPostId)}
        title='Annonser'
        titleKey='title'
        useHook={useJobPosts}
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
    </Page>
  );
};

export default JobPostAdministration;
