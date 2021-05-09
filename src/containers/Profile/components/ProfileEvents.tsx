import { useUser } from 'api/hooks/User';

// Project componets
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const ProfileEvents = () => {
  const { data: user } = useUser();

  if (!user) {
    return <ListItemLoading />;
  } else if (!user.events.length) {
    return <NotFoundIndicator header='Fant ingen arrangementer' subtitle='Du er ikke påmeldt noen kommende arrangementer' />;
  } else {
    return <>{user.events?.map((event) => !event.expired && <ListItem event={event} key={event.id} />)}</>;
  }
};

export default ProfileEvents;
