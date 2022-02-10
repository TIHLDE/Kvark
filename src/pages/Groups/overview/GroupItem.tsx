import { Link } from 'react-router-dom';
import { Group } from 'types';
import URLS from 'URLS';

// Material UI
import { makeStyles } from 'makeStyles';
import { Theme, Skeleton, ButtonBase, Typography, Stack, Divider } from '@mui/material';

// Icons
import MembersIcon from '@mui/icons-material/PersonRounded';

// Project components
import Paper from 'components/layout/Paper';
import { Mail } from '@mui/icons-material';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    minHeight: 90,
    justifyContent: 'flex-start',
  },
  grouplogo: {
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
  const logo = group.image === null ? undefined : group.image;
  const logo_alt = group.image_alt === null ? undefined : group.image_alt;

  return (
    <Paper noOverflow noPadding sx={{ background: (theme) => theme.palette.background[background] }}>
      <ButtonBase className={classes.container} component={Link} focusRipple to={URLS.groups.details(group.slug)}>
        <Stack alignItems='center' direction='row' divider={<Divider flexItem orientation='vertical' />} justifyContent='flex-start' spacing={2}>
          <img alt={logo_alt} className={classes.grouplogo} loading='lazy' src={logo} width={64} />
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
        <Skeleton width={100} />
        <img width={64} />

        <Stack direction='row'>
          <MembersIcon className={classes.icon} />
          <Skeleton className={classes.text} width={120} />
        </Stack>
        <Stack direction='row'>
          <Mail className={classes.icon} />
          <Skeleton className={classes.text} width={120} />
        </Stack>
      </ButtonBase>
    </Paper>
  );
};
