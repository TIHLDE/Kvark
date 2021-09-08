import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Skeleton } from '@mui/material';
import { User } from 'types';

type AvatarProps = {
  user?: Pick<User, 'first_name' | 'last_name' | 'image'>;
} & MuiAvatarProps;

const Avatar = ({ user, className, ...props }: AvatarProps) => {
  return (
    <MuiAvatar alt={`${user?.first_name} ${user?.last_name}`} className={className} src={user?.image} {...props}>
      {user?.first_name ? (
        `${user.first_name.substring(0, 1)}${user.last_name.substring(0, 1)}`
      ) : (
        <Skeleton sx={{ width: '50%', height: '90%' }} variant='text' />
      )}
    </MuiAvatar>
  );
};

export default Avatar;
