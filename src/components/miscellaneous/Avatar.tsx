import { makeStyles } from '@material-ui/styles';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Skeleton } from '@material-ui/core';
import { User } from 'types/Types';

type AvatarProps = {
  user?: Pick<User, 'first_name' | 'last_name' | 'image'>;
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
