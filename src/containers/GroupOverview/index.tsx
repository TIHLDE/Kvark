import { useMemo } from 'react';
import Helmet from 'react-helmet';
import { useGroups } from 'api/hooks/Group';
import { useIsAuthenticated } from 'api/hooks/User';
import { GroupType } from 'types/Enums';
import { Group } from 'types/Types';

// Material UI Components
import { makeStyles, Typography } from '@material-ui/core';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Paper from 'components/layout/Paper';
import GroupItem, { GroupItemLoading } from 'containers/GroupOverview/components/GroupItem';

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
    gridGap: theme.spacing(2),
    gridTemplateColumns: 'repeat(3, 1fr)',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

const GroupOverview = () => {
  const classes = useStyles();
  const isAuthenticated = useIsAuthenticated();
  const { data: groups, error, isLoading } = useGroups();
  const BOARD_GROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.BOARD) || [], [groups]);
  const SUB_GROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.SUBGROUP) || [], [groups]);
  const COMMITTEES = useMemo(() => groups?.filter((group) => group.type === GroupType.COMMITTEE) || [], [groups]);
  const INTERESTGROUPS = useMemo(() => groups?.filter((group) => group.type === GroupType.INTERESTGROUP) || [], [groups]);
  const OTHER_GROUPS = useMemo(
    () => groups?.filter((group) => ![...BOARD_GROUPS, ...SUB_GROUPS, ...COMMITTEES, ...INTERESTGROUPS].some((g) => group.slug === g.slug)) || [],
    [groups, BOARD_GROUPS, SUB_GROUPS, COMMITTEES],
  );

  type CollectionProps = {
    groups: Array<Group>;
    title: string;
  };

  const Collection = ({ groups, title }: CollectionProps) => (
    <div>
      <Typography gutterBottom variant='h2'>
        {title}
      </Typography>
      <div className={classes.groupContainer}>
        {groups.map((group) => (
          <GroupItem group={group} key={group.name} />
        ))}
      </div>
    </div>
  );

  return (
    <Navigation banner={<div className={classes.top}></div>} fancyNavbar>
      <Helmet>
        <title>Gruppeoversikt</title>
      </Helmet>
      <Paper className={classes.content}>
        <Typography gutterBottom variant='h1'>
          Gruppeoversikt
        </Typography>
        {isLoading && (
          <div className={classes.groupContainer}>
            <GroupItemLoading />
            <GroupItemLoading />
          </div>
        )}
        {error && <Paper>{error.detail}</Paper>}
        {Boolean(BOARD_GROUPS.length) && <Collection groups={BOARD_GROUPS} title='Hovedstyret' />}
        {Boolean(SUB_GROUPS.length) && <Collection groups={SUB_GROUPS} title='Undergrupper' />}
        {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komitéer' />}
        {Boolean(INTERESTGROUPS.length) && <Collection groups={INTERESTGROUPS} title='Interessegrupper' />}
        {isAuthenticated && Boolean(OTHER_GROUPS.length) && <Collection groups={OTHER_GROUPS} title='Andre grupper' />}
      </Paper>
    </Navigation>
  );
};

export default GroupOverview;
