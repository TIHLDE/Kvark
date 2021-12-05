import { useGroupsByType } from 'hooks/Group';
import { useIsAuthenticated } from 'hooks/User';
import { useSetNavigationOptions } from 'components/navigation/Navigation';
import { Group } from 'types';
import { Typography, Grid } from '@mui/material';

// Project Components
import Paper from 'components/layout/Paper';
import GroupItem, { GroupItemLoading } from 'pages/Groups/overview/GroupItem';

const GroupsOverview = () => {
  useSetNavigationOptions({ title: 'Gruppeoversikt' });
  const isAuthenticated = useIsAuthenticated();
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS, OTHER_GROUPS, error, isLoading } = useGroupsByType();

  type CollectionProps = {
    groups: Array<Group>;
    title: string;
  };

  const Collection = ({ groups, title }: CollectionProps) => (
    <>
      <Typography gutterBottom variant='h2'>
        {title}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {groups.map((group) => (
          <Grid item key={group.name} lg={4} md={6} xs={12}>
            <GroupItem background='smoke' group={group} />
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <>
      <Typography gutterBottom variant='h1'>
        Gruppeoversikt
      </Typography>
      {isLoading && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item lg={4} md={6} xs={12}>
            <GroupItemLoading />
          </Grid>
          <Grid item lg={4} md={6} xs={12}>
            <GroupItemLoading />
          </Grid>
        </Grid>
      )}
      {error && <Paper>{error.detail}</Paper>}
      {Boolean(BOARD_GROUPS.length) && <Collection groups={BOARD_GROUPS} title='Hovedstyret' />}
      {Boolean(SUB_GROUPS.length) && <Collection groups={SUB_GROUPS} title='Undergrupper' />}
      {Boolean(COMMITTEES.length) && <Collection groups={COMMITTEES} title='Komitéer' />}
      {Boolean(INTERESTGROUPS.length) && <Collection groups={INTERESTGROUPS} title='Interessegrupper' />}
      {isAuthenticated && Boolean(OTHER_GROUPS.length) && <Collection groups={OTHER_GROUPS} title='Andre grupper' />}
    </>
  );
};

export default GroupsOverview;
