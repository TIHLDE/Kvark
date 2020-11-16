import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Service imports
import API from '../../../api/api';

// Material UI Components
import { TextField, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Project Components
import MessageIndicator from '../../../components/layout/MessageIndicator';

const styles = (theme) => ({
  root: {
    width: '100%',
    height: 'auto',
    margin: 0,
  },
  wrapper: {
    padding: '30px 30px 30px 30px',
    display: 'flex',
    flexDirection: 'column',
  },
  grid: {
    padding: '30px 0px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexGrow: 1,
    margin: '8px 8px',
  },
  progress: {
    minHeight: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  checkBox: {
    padding: 4,
    color: theme.palette.colors.text.light,
  },
  mainText: {
    color: theme.palette.colors.text.main,
  },
  lightText: {
    color: theme.palette.colors.text.light,
  },
});

function sDate(semester) {
  const d = new Date();
  let dateMonth = d.getMonth() + semester * 6;
  let dateYear = d.getFullYear();
  while (dateMonth > 11) {
    dateMonth -= 12;
    dateYear++;
  }
  let returnMonth = 'Vår';
  if (dateMonth > 5) {
    returnMonth = 'Høst';
  }
  return returnMonth + ' ' + dateYear;
}
const semester = [{ name: sDate(0) }, { name: sDate(1) }, { name: sDate(2) }, { name: sDate(3) }];

const arrangementer = [
  { name: 'Bedriftspresentasjon' },
  { name: 'Kurs/Workshop' },
  { name: 'Bedriftsbesøk' },
  { name: 'Annonse' },
  { name: 'Insta-takeover' },
  { name: 'Annet' },
];

const Inputter = withStyles(styles)((props) => {
  const { data, firstTextFieldRef, handleChange } = props;
  return (
    <div>
      <TextField
        fullWidth
        id={data.id}
        InputLabelProps={{
          shrink: true,
        }}
        inputRef={firstTextFieldRef}
        label={data.header}
        margin='normal'
        name={data.id}
        onChange={handleChange}
        placeholder={data.placeholder}
        required={props.required}
        type={data.type || 'text'}
        variant='outlined'
      />
    </div>
  );
});

class CustomListItem extends Component {
  state = {
    checked: false,
  };

  handleClick = async () => {
    await this.setState({
      checked: !this.state.checked,
    });

    // Sends fake event back, because this method was originally connect to
    // The Checkbox component, which actually returned a correct event,
    // but was for some reason moved to ListItem.
    const fakeEvent = { target: { checked: this.state.checked, name: this.props.value.name } };

    this.props.handleChange(fakeEvent);
  };

  render() {
    const { classes } = this.props;
    return (
      <ListItem button dense disableGutters onClick={this.handleClick}>
        <Checkbox checked={this.state.checked} className={classes.checkBox} name={this.props.value.name} />
        <ListItemText className={classes.lightText} primary={this.props.value.name} />
      </ListItem>
    );
  }
}
CustomListItem.propTypes = {
  classes: PropTypes.object,
  value: PropTypes.object,
  handleChange: PropTypes.func,
};

const CustomItem = withStyles(styles)(CustomListItem);

const Listing = withStyles(styles)((props) => {
  const { list, header, classes } = props;
  return (
    <div className={classes.item}>
      <Typography className={classes.lightText} variant='subtitle1'>
        {header}
      </Typography>
      <Divider />
      <List>
        {list.map((value) => {
          return <CustomItem handleChange={props.handleChange} key={value.name} value={value} />;
        })}
      </List>
    </div>
  );
});

class Forum extends Component {
  state = {
    isLoading: false,
    isFormSent: false,
    data: {
      info: {},
      time: [],
      type: [],
      comment: '',
    },
  };

  handleChange = (part) => (event) => {
    if (part === 'info') {
      this.setState({
        data: {
          ...this.state.data,
          info: {
            ...this.state.data['info'],
            [event.target.name]: event.target.value,
          },
        },
      });
    } else if (part === 'comment') {
      this.setState({
        data: {
          ...this.state.data,
          comment: event.target.value,
        },
      });
    } else if (part === 'type') {
      if (event.target.checked) {
        this.setState({
          data: {
            ...this.state.data,
            type: [...this.state.data['type'], event.target.name],
          },
        });
      } else {
        this.setState({
          data: {
            ...this.state.data,
            type: this.state.data['type'].filter((it) => it !== event.target.name),
          },
        });
      }
    } else if (part === 'time') {
      if (event.target.checked) {
        this.setState({
          data: {
            ...this.state.data,
            time: [...this.state.data['time'], event.target.name],
          },
        });
      } else {
        this.setState({
          data: {
            ...this.state.data,
            time: this.state.data['time'].filter((it) => it !== event.target.name),
          },
        });
      }
    }
  };

  handleToggleChange = (name) => () => {
    this.setState({ [name]: !this.state[name] });
  };

  setMessage = (message) => {
    this.setState({
      message: message,
    });
  };

  handleSubmitted = (name) => () => {
    this.setState({
      [name]: !this.state[name],
      data: {
        info: {},
        time: [],
        type: [],
        comment: '',
      },
    });
  };

  arrayToList = (array) => {
    let list = '';
    array.forEach((element) => {
      list += '- ' + element + '%0D%0A';
    });
    return list;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.scrollToForm) {
      this.props.scrollToForm();
    }
    this.setState({ isLoading: true });
    window.gtag('event', 'form', {
      event_category: 'Companies',
      event_label: 'Companies form',
      value: this.state.data.info.bedrift,
    });
    API.emailForm(this.state.data).then((response) => {
      if (!response.isError) {
        this.setMessage('Sendt! Takk for interessen.');
      } else {
        this.setMessage('Noe gikk galt, prøv senere.');
      }
      this.setState({ isLoading: false, isFormSent: true });
    });
  };

  render() {
    const { classes, firstTextFieldRef } = this.props;

    if (this.state.isLoading) {
      return (
        <div className={classes.progress}>
          <CircularProgress />
          <Typography variant='h6'>{'Laster...'}</Typography>
        </div>
      );
    } else if (this.state.isFormSent) {
      return (
        <div className={classes.progress}>
          <MessageIndicator header={this.state.message} variant='h5' />
          <Button color='primary' onClick={this.handleSubmitted('isFormSent')} variant='contained'>
            Mottatt
          </Button>
        </div>
      );
    }

    return (
      <div className={classNames(classes.root)}>
        <form className={classes.wrapper} onSubmit={this.handleSubmit}>
          <Typography className={classes.mainText} gutterBottom variant='h5'>
            Meld interesse:
          </Typography>
          <Inputter
            data={{ header: 'Bedrift: ', placeholder: 'Bedriftnavn', id: 'bedrift' }}
            firstTextFieldRef={firstTextFieldRef}
            handleChange={this.handleChange('info')}
            required
          />
          <Inputter data={{ header: 'Kontaktperson: ', placeholder: 'Navn', id: 'kontaktperson' }} handleChange={this.handleChange('info')} required />
          <Inputter
            data={{ header: 'Epost: ', placeholder: 'Skriv Epost her', id: 'epost', type: 'email' }}
            handleChange={this.handleChange('info')}
            required
          />
          <div className={classes.grid}>
            <Listing handleChange={this.handleChange('time')} header='SEMESTER' list={semester} />
            <Listing handleChange={this.handleChange('type')} header='ARRANGEMENTER' list={arrangementer} />
          </div>
          <Divider />
          <TextField
            id='multiline'
            label='Kommentar'
            margin='normal'
            multiline
            name='kommentar'
            onChange={this.handleChange('comment')}
            rows={3}
            rowsMax={6}
            variant='outlined'
          />
          <Button className={classes.item} color='primary' type='submit' variant='contained'>
            Send
          </Button>
        </form>
      </div>
    );
  }
}

Forum.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  firstTextFieldRef: PropTypes.object,
  scrollToForm: PropTypes.func,
};

export default withStyles(styles)(Forum);
