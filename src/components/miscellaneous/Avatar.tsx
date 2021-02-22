import { makeStyles } from '@material-ui/core';
import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import { User } from 'types/Types';

type AvatarProps = {
  user?: User;
} & MuiAvatarProps;

const useStyles = makeStyles({
  skeletonCircle: {
    width: '50%',
    height: '90%',
  },
});

const Avatar = ({ user, className }: AvatarProps) => {
  const classes = useStyles();
  return (
    <MuiAvatar alt={`${user?.first_name} ${user?.last_name}`} className={className} src={user?.image}>
      {user?.first_name ? (
        `${user.first_name.substring(0, 1)}${user.last_name.substring(0, 1)}`
      ) : (
        <Skeleton className={classes.skeletonCircle} variant='text' />
      )}
    </MuiAvatar>
  );
};

export default Avatar;
