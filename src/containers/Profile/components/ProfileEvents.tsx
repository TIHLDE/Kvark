import React, { useState, useEffect } from 'react';
import { EventCompact } from 'types/Types';
import { useUser } from 'api/hooks/User';

// Material-UI
import Typography from '@material-ui/core/Typography';

// Project componets
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';

const ProfileEvents = () => {
  const { getUserData } = useUser();
  const [events, setEvents] = useState<Array<EventCompact> | null>(null);

  useEffect(() => {
    let subscribed = true;
    getUserData().then((user) => {
      if (user && subscribed) {
        setEvents(user.events);
      }
    });
    return () => {
      subscribed = false;
    };
  }, [getUserData]);

  if (!events) {
    return <ListItemLoading />;
  } else if (!events.length) {
    return (
      <Typography align='center' variant='subtitle1'>
        Du er ikke påmeldt noen kommende arrangementer
      </Typography>
    );
  } else {
    return <>{events?.map((event) => !event.expired && <ListItem event={event} key={event.id} />)}</>;
  }
};

export default ProfileEvents;
