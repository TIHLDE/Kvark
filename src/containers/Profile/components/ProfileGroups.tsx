import { useMemo } from 'react';
import { useUserGroups } from 'hooks/User';

// Material UI Components
import Grid from '@mui/material/Grid';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import GroupItem, { GroupItemLoading } from 'containers/GroupOverview/components/GroupItem';

const ProfileGroups = () => {
  const { data } = useUserGroups();
  const groups = useMemo(() => data || [], [data]);
  if (!data) {
    return (
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <GroupItemLoading />
        </Grid>
      </Grid>
    );
  } else if (!groups.length) {
    return <NotFoundIndicator header='Fant ingen grupper' subtitle='Du er ikke medlem av noen grupper' />;
  }
  return (
    <Grid container spacing={1}>
      {groups.map((group) => (
        <Grid item key={group.slug} md={6} xs={12}>
          <GroupItem group={group} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileGroups;
