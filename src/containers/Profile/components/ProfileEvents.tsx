import React, { useState, useEffect } from 'react';
import { Event } from 'types/Types';
import { useUser } from 'api/hooks/User';

// Material-UI
import Typography from '@material-ui/core/Typography';

// Project componets
import ListItem from 'components/miscellaneous/ListItem';

const ProfileEvents = () => {
  const [events, setEvents] = useState<Array<Event>>([]);
  const { getUserData } = useUser();

  useEffect(() => {
    getUserData()
      .then((user) => {
        if (user) {
          setEvents(user.events);
        }
      })
      .catch(() => {});
  }, [getUserData]);

  return (
    <div>
      {events?.map((event) => !event.expired && <ListItem event={event} key={event.id} />)}
      {!events.length && (
        <Typography align='center' variant='subtitle1'>
          Du er ikke påmeldt noen kommende arrangementer
        </Typography>
      )}
    </div>
  );
};

export default ProfileEvents;
