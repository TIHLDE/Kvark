import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
//import './style.css';


// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Next from '@material-ui/icons/NavigateNext';
import Before from '@material-ui/icons/NavigateBefore';

// Project componets/services
import EventService from '../../../api/services/EventService';
import CalendarListView from './CalendarListView';

// Icons
import Reorder from '@material-ui/icons/Reorder';
import DateRange from '@material-ui/icons/DateRange';

// Styles
const styles = (theme) => ({
  body: {
    fontFamily: "'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    fontSize: '1em',
    fontWeight: 300,
    lineHeight: '1.5',
    color: '#777',
    background: '#f9f9f9',
    position: 'relative',
  },
  '*': {
    boxSizing: 'border-box',
  },
  row: {
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  rowMiddle: {
    alignItems: 'center',
  },
  col: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: '100%',
  },
  colStart: {
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  colCenter: {
    justifyContent: 'center',
    textAlign: 'center',
    color: '#000',
  },
  colEnd: {
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  calendar: {
    display: 'block',
    position: 'relative',
    width: '100%',
    background: '#fff',
    border: '1px solid #eee',
  },
  header: {
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: '150%',
    padding: '1.5em 0',
    borderBottom: '1px solid #eee',
  },
  icon: {
    cursor: 'pointer',
    transition: '.15s ease-out',
    '&:hover': {
      transform: 'scale(1.1)',
      transition: '.25s ease-out',
      color: '#6eb0d6',
    },
    '&:first-of-type': {
      marginLeft: '1em',
    },
    '&:last-of-type': {
      marginRight: '1em',
    },
  },
  days: {
    textTransform: 'uppercase',
    fontWeight: 400,
    color: '#ccc',
    fontSize: '70%',
    padding: '.75em 0',
    borderBottom: '1px solid #f9f9f9',
  },
  bodyCell: {
    position: 'relative',
    height: '5em',
    borderRight: '1px solid #eee',
    overflow: 'hidden',
    cursor: 'pointer',
    background: '#fff',
    transition: '0.25s ease-out',
    '&:hover':{
      background: '#f9f9f9',
      transition: '0.5s ease-out',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
  bodySelected:{
    'border-left': '10px solid transparent',
    'border-image': 'linear-gradient(45deg, #1d448c 0%,#53cbf1 40%)',
    'border-image-slice': 1,
  },
  bodyRow: {
    'border-bottom': '1px solid #eee',
    '&:last-child': {
      'border-bottom': 'none',
    },
  },
  bodyCellNumber: {
    position: 'absolute',
    fontSize: '82.5%',
    lineHeight: 1,
    top: '.75em',
    right: '.75em',
    fontWeight: '700',
  },
  disabled: {
    color: '#ccc',
    pointerEvents: 'none',
  },
  bodyCellBG: {
    fontWeight: 700,
    lineHeight: 1,
    color: '#1d448c',
    opacity: 0,
    fontSize: '8em',
    position: 'absolute',
    top: '-.2em',
    right: '-.05em',
    transition: '.25s ease-out',
    letterSpacing: '-.07em',
  },
  bodyCol: {
    flexGrow: 0,
    flexBasis: 'calc(100%/7)',
    width: 'calc(100%/7)',
  },
  bodyCellHoverBG: {
    '&:hover': {
      opacity: 0.05,
      transition: '.5s ease-in',
    }
   },
  selectedBG: {
    opacity: 0.05,
    transition: '.5s ease-in',
  },
});

class Calender extends React.Component {

  
  renderHeader() {
    const { classes } = this.props;
    return (
      <div className={classNames(classes.header, classes.row)}>
        <div className={classNames(classes.col, classes.colStart)}>
          <div className={classes.icon} onClick={this.prevMonth}>
            <Before/>
          </div>
        </div>
        <div className={classNames(classes.col, classes.colCenter)}>
          <span>
            {moment(this.state.currentMonth).format(this.state.dateFormat)}
            {this.state.count}
          </span>
        </div>
        <div className={classNames(classes.col, classes.colEnd)} onClick={this.nextMonth}>
          <div className={classes.icon}><Next/></div>
        </div>
      </div>
    );
  }

  renderDays() {
    const { classes } = this.props;

    const dateFormat = "dddd";
    const days = [];
    let startDate = moment(this.state.currentMonth).startOf('month');
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={classNames(classes.col, classes.colCenter)} key={i}>
          {moment(startDate).add(i, 'days').format(dateFormat)}
        </div>
      );
    }
    return <div className={classNames(classes.days, classes.row)}>{days}</div>;
  }

  renderCells() {
    const { classes } = this.props;

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
            className={classNames(classes.col, classes.bodyCell, classes.bodyCellHoverBG, 
              !moment(day).isSame(moment(monthStart), 'month')
                ? classes.disabled
                : moment(day).isSame(moment(selectedDate), 'days') ? classNames(classes.bodySelected, classes.bodySelected) : ""
            )}
            key={day}
            onClick={() => this.onDateClick(moment(cloneDay))}
          >
            <span className={classes.bodyCellNumber}>{formattedDate}</span>
            <span className={classes.bodyCellBG}>{formattedDate}</span>
          </div>
        );
        day = moment(day).add(1, 'days');
      }
      rows.push(
        <div className={classes.row} key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className={classes.body}>{rows}</div>;
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

  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      dateFormat: "MMMM YYYY",
    };
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.calendar}>
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

Calender.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Calender);
