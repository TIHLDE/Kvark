import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../../../api/hooks/User';
import URLS from '../../../URLS';
import { getFormattedDate } from '../../../utils';
import moment from 'moment';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Icons
import DateIcon from '@material-ui/icons/DateRange';
import LocationIcon from '@material-ui/icons/LocationOn';

// Project componets
import ListItem from '../../../components/miscellaneous/ListItem';

const styles = (theme) => ({
  text: {
    color: theme.palette.colors.text.light,
  },
});

function ProfileEvents(props) {
  const { classes } = props;
  const [events, setEvents] = useState([]);
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
      {events &&
        events.map((event) => {
          if (!event.expired) {
            return (
              <ListItem
                expired={event.expired}
                img={event.image}
                imgAlt={event.image_alt}
                info={[
                  { label: getFormattedDate(moment(event.start_date, ['YYYY-MM-DD HH:mm'], 'nb')), icon: DateIcon },
                  { label: event.location, icon: LocationIcon },
                ]}
                key={event.id}
                link={URLS.events + ''.concat(event.id, '/')}
                title={event.title}
              />
            );
          }
          return '';
        })}
      {events.length < 1 && (
        <Typography align='center' className={classes.text} variant='subtitle1'>
          Du er ikke påmeldt noen kommende arrangementer
        </Typography>
      )}
    </div>
  );
}

ProfileEvents.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ProfileEvents);
