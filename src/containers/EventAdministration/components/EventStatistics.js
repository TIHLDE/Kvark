import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis} from 'recharts';

const styles = {
  statistics: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '@media only screen and (max-width: 800px)': {
      flexDirection: 'column',
    },
  },
  statisticsInner: {
    width: '100%',
  },
};

const EventParticipants = (props) => {
  const {classes, participants} = props;

  const attendedNo = (attended) => {
    return (participants.filter((x) => x.has_attended === attended).length);
  };
  const classNo = (userClass) => {
    const no = (participants.filter((x) => x.user_info.user_class === userClass).length);
    return no > 0 ? no: '';
  };
  const studyNo = (userStudy) => {
    const no = (participants.filter((x) => x.user_info.user_study === userStudy).length);
    return no > 0 ? no: '';
  };
  const classData = [{name: '1. klasse', 'c': classNo(1)}, {name: '2. klasse', 'c': classNo(2)}, {name: '3. klasse', 'c': classNo(3)}, {name: '4. klasse', 'c': classNo(4)}, {name: '5. klasse', 'c': classNo(5)}];
  const studyData = [{name: 'Data', 'c': studyNo(1)}, {name: 'DigFor', 'c': studyNo(2)}, {name: 'DigInc', 'c': studyNo(3)}, {name: 'DigSam', 'c': studyNo(4)}, {name: 'Drift', 'c': studyNo(5)}];

  return (
    <React.Fragment>
      <Typography>Ankommet: {attendedNo(true) + '/' + attendedNo(false)}</Typography>
      <div className={classes.statistics}>
        <div className={classes.statisticsInner}>
          <Typography variant='h6'>Klasse:</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => (value + ' stk')} allowEscapeViewBox={{x: false, y: true}} />
              <Bar label dataKey="c" fill="#f5af19"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={classes.statisticsInner}>
          <Typography variant='h6'>Studie:</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={studyData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => (value + ' stk')} allowEscapeViewBox={{x: false, y: true}} />
              <Bar label dataKey="c" fill="#2ebf91"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </React.Fragment>
  );
};

EventParticipants.propTypes = {
  classes: PropTypes.object,
  participants: PropTypes.array,
};

export default withStyles(styles)(EventParticipants);
