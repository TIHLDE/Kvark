import { useMemo } from 'react';
import { useUserGroups } from 'api/hooks/User';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import GroupItem from 'containers/GroupOverview/components/GroupItem';

const ProfileGroups = () => {
  const { data } = useUserGroups();
  const groups = useMemo(() => data || [], [data]);
  return (
    <div>
      {groups.length ? (
        <Grid container spacing={1}>
          {groups.map((group) => (
            <Grid item key={group.slug} md={6} xs={12}>
              <GroupItem group={group} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NotFoundIndicator header='Fant ingen badges' subtitle='Du er medlem av noen grupper' />
      )}
    </div>
  );
};

export default ProfileGroups;
