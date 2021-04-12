import classNames from 'classnames';
import Helmet from 'react-helmet';
import { useGroups } from 'api/hooks/Group';

// Material UI Components
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Paper from 'components/layout/Paper';
import GroupItem from 'containers/GroupOverview/components/GroupItem';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 220,
    background: theme.palette.colors.gradient.main.top,
  },
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
  groupContainer: {
    display: 'grid',
    gridGap: theme.spacing(3),
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoRows: '7rem',
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  undertitle: {
    fontSize: '1.6rem',
  },
  marginMed: {
    marginBottom: theme.spacing(5),
  },
  marginSm: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem',
    },
  },
}));

interface Map {
  [key: string]: string | undefined;
}

const groupTypes: Map = {
  BOARD: 'Hovedstyret',
  SUBGROUP: 'Undergrupper',
  COMMITTEE: 'Komitéer',
};

const GroupOverview = () => {
  const classes = useStyles();
  const { data, error, isLoading } = useGroups();

  const content =
    data &&
    [...new Set(data.map((group) => group.type))].map((groupType) => {
      return (
        <div key={groupType}>
          <Typography className={classNames(classes.marginSm, classes.undertitle)} variant='h4'>
            {groupTypes[groupType]}
          </Typography>
          <div className={classes.groupContainer}>
            {data
              ?.filter((group) => group.type === groupType)
              .map((group) => {
                return <GroupItem group={group} key={group.name} />;
              })}
          </div>
        </div>
      );
    });

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>Gruppeoversikt</title>
      </Helmet>
      <Paper className={classes.content}>
        <Typography className={[classes.marginMed, classes.title].join(' ')} variant='h1'>
          Gruppeoversikt
        </Typography>
        {isLoading && <LinearProgress />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && content}
      </Paper>
    </Navigation>
  );
};

export default GroupOverview;
