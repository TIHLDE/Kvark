import { useUser } from 'api/hooks/User';

// Material-UI
import Typography from '@material-ui/core/Typography';

// Project componets
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';

const ProfileEvents = () => {
  const { data: user } = useUser();

  if (!user) {
    return <ListItemLoading />;
  } else if (!user.events.length) {
    return (
      <Typography align='center' variant='subtitle1'>
        Du er ikke påmeldt noen kommende arrangementer
      </Typography>
    );
  } else {
    return <>{user.events?.map((event) => !event.expired && <ListItem event={event} key={event.id} />)}</>;
  }
};

export default ProfileEvents;
