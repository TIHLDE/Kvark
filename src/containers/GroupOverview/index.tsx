import { useMemo } from 'react';
import { useGroups } from 'hooks/Group';
import { useIsAuthenticated } from 'hooks/User';
import { GroupType } from 'types/Enums';
import { Group } from 'types/Types';

// Material UI Components
import { Typography, Grid } from '@mui/material';

// Project Components
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import GroupItem, { GroupItemLoading } from 'containers/GroupOverview/components/GroupItem';
import { PrimaryTopBox } from 'components/layout/TopBox';

const GroupOverview = () => {
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
    <Page banner={<PrimaryTopBox />} options={{ title: 'Gruppeoversikt' }}>
      <Paper sx={{ margin: '-60px auto 60px', position: 'relative' }}>
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
      </Paper>
    </Page>
  );
};

export default GroupOverview;
