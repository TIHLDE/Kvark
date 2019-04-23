import React from 'react';
import PropTypes, { array } from 'prop-types';
import moment from 'moment';
import './style.css';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Next from '@material-ui/icons/NavigateNext';
import Before from '@material-ui/icons/NavigateBefore';

// Project componets/services
import CalendarListView from './CalendarListView';
import Schedule from '@material-ui/icons/Schedule';


// Icons
import Reorder from '@material-ui/icons/Reorder';
import DateRange from '@material-ui/icons/DateRange';

// Styles
const styles = (theme) => ({
  event: {
    width: '100%',
<<<<<<< HEAD
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    listStyle: 'none',
=======
    color: '#1d448c',
    backgroundColor: 'rgba(110,176,214, 0.15)',
    padding: '5px',
    marginBottom: '3px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: '12px',
    textOverflow: 'ellipsis',
>>>>>>> 711b61ab3e10fa928f90d876e7706d153b895ca5
  },
  list: {
    width: '100%',
    position: 'absolute',
    top: '10%',
<<<<<<< HEAD
  },
  link: {
    color: '#777',
    fontSize: '12px',
    padding: '10px',
    textDecoration: 'none',
    backgroundColor: 'rgba(29,68,140, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(29,68,140, 0.7)',
      cursor: 'pointer',
      color: 'white',
    },
=======
>>>>>>> 711b61ab3e10fa928f90d876e7706d153b895ca5
  }
});

class CalendarGridView extends React.Component {

  renderHeader() {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
<<<<<<< HEAD
            <Before />
=======
            <Before/>
>>>>>>> 711b61ab3e10fa928f90d876e7706d153b895ca5
          </div>
        </div>
        <div className="col col-center">
          <span>
            {moment(this.state.currentMonth).format(this.state.dateFormat)}
            {this.state.count}
          </span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
<<<<<<< HEAD
          <div className="icon"><Next /></div>
=======
          <div className="icon"><Next/></div>
>>>>>>> 711b61ab3e10fa928f90d876e7706d153b895ca5
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];
    let startDate = moment(this.state.currentMonth).startOf('month');
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {moment(startDate).add(i, 'days').format(dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = moment(currentMonth).startOf('month');
    const monthEnd = moment(currentMonth).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).startOf('week');
    const dateFormat = "D";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = moment(day).format(dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !moment(day).isSame(moment(monthStart), 'month')
                ? "disabled"
                : moment(day).isSame(moment(selectedDate), 'days') ? "selected" : ""
<<<<<<< HEAD
              }`}
=======
            }`}
>>>>>>> 711b61ab3e10fa928f90d876e7706d153b895ca5
            key={day}
            onClick={() => this.onDateClick(moment(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            {this.displayEvent(day)}
          </div>
        );
        day = moment(day).add(1, 'days');
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      // selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: moment(this.state.currentMonth).add(1, 'months').format(this.state.dateFormat),
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: moment(this.state.currentMonth).subtract(1, 'months').format(this.state.dateFormat),
    });
  };

  displayEvent(date) {
    const { classes } = this.props;
    date = moment(date).format('DD-MM-YY');
    const eventText = [];
<<<<<<< HEAD
    if (this.props.events !== null) {
      this.props.events.forEach(event => {
        let eventDate = moment(event.start).format('DD-MM-YY');
        if (eventDate === date) {
          eventText.push(
            <li className={classes.event}><a className={classes.link} href={'/arrangementer/' + event.id + '/'}>{event.title}</a></li>,
          )
        }
      });
      if (eventText.length > 0) {
=======
    if(this.props.events !== null){
      this.props.events.forEach(event => {
          let eventDate = moment(event.start).format('DD-MM-YY');
          if(eventDate === date){
            eventText.push(
              <li className={classes.event}>{event.title}</li>,
            )
          }
      });
      if(eventText.length > 0){
>>>>>>> 711b61ab3e10fa928f90d876e7706d153b895ca5
        return <ul className={classes.list}>{eventText}</ul>;
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      dateFormat: "YYYY MMMM",
    };
  }

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

CalendarGridView.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array,
};

export default withStyles(styles)(CalendarGridView);
