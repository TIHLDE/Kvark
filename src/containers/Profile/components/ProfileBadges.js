import React, { useState, useEffect } from 'react';
import { useUser } from '../../../api/hooks/User';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '../../../components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 1),
    textAlign: 'start',
    minHeight: 110,
    height: '100%',
  },
  text: {
    color: theme.palette.colors.text.main,
  },
}));

const BadgeItem = (props) => {
  const classes = useStyles();
  const { data } = props;

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={0}>
        <Grid item xs={3}>
          <img alt={data.title} src={data.image} width={64} />
        </Grid>
        <Grid item xs={9}>
          <Typography variant='h6'>
            <strong>{data.title}</strong>
          </Typography>
          <Grid alignItems='center' container direction='row' wrap='nowrap'>
            <Typography variant='body2'>{data.description}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ProfileBadges = (props) => {
  const classes = useStyles();
  const [badges, setBadges] = useState();
  const { getUserData } = useUser();

  useEffect(() => {
    getUserData()
      .then((user) => {
        if (user) {
          setBadges(user.badges);
        }
      })
      .catch(() => {});
  }, [getUserData]);

  return (
    <div className={classes.wrapper}>
      {badges ? (
        <Grid container spacing={1}>
          {badges.map((badgeData, key) => {
            return (
              <Grid item key={key} md={6} xs={12}>
                <BadgeItem data={badgeData} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography align='center' className={classes.text} variant='subtitle1'>
          Du har ingen badges enda
        </Typography>
      )}
    </div>
  );
};

BadgeItem.propTypes = {
  data: PropTypes.object,
};

export default ProfileBadges;
