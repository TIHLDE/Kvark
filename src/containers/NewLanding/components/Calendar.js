import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Project componets/services
import EventService from '../../../api/services/EventService';
import CalendarListView from './CalendarListView';
import CalendarGridView from './CalendarGridView';

// Icons
import Reorder from '@material-ui/icons/Reorder';
import DateRange from '@material-ui/icons/DateRange';

// Styles
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 0, // MUI Grid requires a padding of half the given spacing.
  },
  paper: {
    padding: theme.spacing.unit,
    color: theme.palette.text.secondary,
    textAlign: 'center',
  },
  container: {
    maxWidth: 700,
    width: '100vw',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  tabs: {
    marginBottom: 1,
    backgroundColor: 'white',
  },
});

class Calender extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      events: null,
      calendarViewMode: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    EventService.getEvents().then((eventObject) => {

      // // Temp code for creating enough test data.
      // for (let i = 0; i < 15; i++) {
      //   eventObject.push(eventObject[0]);
      // }

     this.setState({events: eventObject});
    });
  }

  handleChange(event, newValue) {
    this.setState({calendarViewMode: newValue});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.container}>
          <Tabs centered className={classes.tabs} value={this.state.calendarViewMode} onChange={this.handleChange}>
            <Tab icon={<Reorder/>} label='Listevisning' />
            <Tab icon={<DateRange/>} label='Kalendervisning' />
          </Tabs>
            {this.state.calendarViewMode === 0 ?
            <CalendarListView events={this.state.events} />
            :
            <CalendarGridView events={this.state.events} />
            }
        </Paper>
      </div>
    );
  }
}

Calender.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
};

export default withStyles(styles)(Calender);
