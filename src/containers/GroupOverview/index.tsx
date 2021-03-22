import { useGroups } from 'api/hooks/Group';
import Helmet from 'react-helmet';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Paper from 'components/layout/Paper';
import { PersonListItemLoading } from 'containers/UserAdmin/components/PersonListItem';
import GroupItem from './components/GroupItem';

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
    gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
    gridAutoRows: '7rem',
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
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

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>Gruppeoversikt</title>
      </Helmet>
      <Paper className={classes.content}>
        <Typography className={[classes.marginMed, classes.title].join(' ')} variant='h1'>
          Gruppeoversikt
        </Typography>
        {isLoading && <PersonListItemLoading />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined &&
          [...new Set(data.map((group) => group.type))].map((groupType) => {
            return (
              <div key={groupType}>
                <Typography className={[classes.marginSm, classes.undertitle].join(' ')} variant='h4'>
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
          })}
      </Paper>
    </Navigation>
  );
};

export default GroupOverview;
