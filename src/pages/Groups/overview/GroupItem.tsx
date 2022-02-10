import { Link } from 'react-router-dom';
import URLS from 'URLS';

// Material UI
import { makeStyles } from 'makeStyles';
import { Theme, Skeleton, ButtonBase, Typography, Stack, Divider } from '@mui/material';

// Icons
import MembersIcon from '@mui/icons-material/PersonRounded';
import { Group } from 'types';
import Paper from 'components/layout/Paper';
import { Mail } from '@mui/icons-material';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    minHeight: 90,
    justifyContent: 'flex-start',
  },
  logo: {
    height: '64px',
    width: '64px',
    borderRadius: '20px',
    marginLeft: '16px',
  },
  icon: {
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
    },
  },
  text: {
    marginLeft: theme.spacing(1),
    fontSize: '0.8rem',
  },
}));

export type GroupItemProps = {
  group: Group;
  background?: keyof Theme['palette']['background'];
};

const GroupItem = ({ group, background = 'paper' }: GroupItemProps) => {
  const { classes } = useStyles();

  return (
    <Paper noOverflow noPadding sx={{ background: (theme) => theme.palette.background[background] }}>
      <ButtonBase className={classes.container} component={Link} focusRipple to={URLS.groups.details(group.slug)}>
        <Stack alignItems='center' direction='row' divider={<Divider flexItem orientation='vertical' />} gap={1} justifyContent='flex-start' sx={{ pl: 1 }}>
          <AspectRatioImg alt={group?.image_alt || ''} borderRadius ratio={1} src={group?.image || ''} sx={{ width: 70, height: 70 }} />
          <Stack>
            <Typography variant='h3'>{group.name}</Typography>
            {group.leader && (
              <Stack alignItems='center' direction='row'>
                <MembersIcon className={classes.icon} />
                <Typography className={classes.text}>
                  {group.leader.first_name} {group.leader.last_name}
                </Typography>
              </Stack>
            )}
            {group.contact_email && (
              <Stack alignItems='center' direction='row'>
                <Mail className={classes.icon} />
                <Typography className={classes.text}>{group.contact_email}</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </ButtonBase>
    </Paper>
  );
};

export default GroupItem;

export const GroupItemLoading = ({ background = 'paper' }: Pick<GroupItemProps, 'background'>) => {
  const { classes } = useStyles();
  return (
    <Paper noOverflow noPadding sx={{ background: (theme) => theme.palette.background[background] }}>
      <ButtonBase className={classes.container} focusRipple>
        <Stack alignItems='center' direction='row' divider={<Divider flexItem orientation='vertical' />} gap={1} justifyContent='flex-start' sx={{ pl: 1 }}>
          <AspectRatioLoading sx={{ width: 70, height: 70 }} />
          <Stack>
            <Skeleton width={100} />

            <Stack direction='row'>
              <MembersIcon className={classes.icon} />
              <Skeleton className={classes.text} width={120} />
            </Stack>
            <Stack direction='row'>
              <Mail className={classes.icon} />
              <Skeleton className={classes.text} width={120} />
            </Stack>
          </Stack>
        </Stack>
      </ButtonBase>
    </Paper>
  );
};
