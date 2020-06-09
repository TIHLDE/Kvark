// React
import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// API and store import
import UserService from '../../../api/services/UserService';
import store from '../../../store/store';
import * as UserActions from '../../../store/actions/UserActions';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';

const styles = (theme) => ({
  mt: {
    marginTop: '16px',
  },
  inputWidth: {
    maxWidth: '100%',
    textAlign: 'left',
    '& input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button': {
      appearance: 'none',
      margin: 0,
    },
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    '@media only screen and (max-width: 600px)': {
      flexDirection: 'column',
    },
  },
  selectBox: {
    flex: 1,
    textAlign: 'left',
  },
  centerSelect: {
    '@media only screen and (min-width: 600px)': {
      margin: '16px 5px 8px 5px',
    },
  },
  snackbar: {
    bottom: '20px',
    position: 'fixed',
    borderRadius: theme.sizes.border.radius,
    backgroundColor: theme.colors.background.light,
    color: theme.colors.text.main,
    textAlign: 'center',
    maxWidth: '90%',
    display: 'flex',
    justifyContent: 'center',

    '@media only screen and (min-width: 600px)': {
      whiteSpace: 'nowrap',
    },
  },
});

class ProfileSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      errorMessage: null,
      isLoading: false,
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      cell: '',
      em: '',
      study: 1,
      class: 1,
      gender: 1,
      tool: '',
      allergy: '',

      open: false,
      Transition: Slide,
      snackbarMessage: '',
    };
  }

    loadUserData = () => {
      UserService.getUserData().then((user) => {
        if (user) {
          this.setState({userData: user, userName: user.user_id, firstName: user.first_name, lastName: user.last_name, email: user.email, cell: user.cell, em: user.em_nr, study: user.user_study, class: user.user_class, gender: user.gender, tool: user.tool, allergy: user.allergy});
        }
      });
    }

    componentDidMount() {
      this.loadUserData();
    }

    handleLogOut = () => {
      this.props.logOutMethod();
    }

    getStateNewUserData = () => ({
      cell: this.state.cell,
      em_nr: this.state.em,
      user_study: this.state.study,
      user_class: this.state.class,
      gender: this.state.gender,
      tool: this.state.tool,
      allergy: this.state.allergy,
    });

    updateData = (event) => {
      event.preventDefault();

      if (this.state.isLoading) {
        return;
      }

      this.setState({errorMessage: null, isLoading: true});

      const item = this.getStateNewUserData();

      UserService.updateUserData(this.state.userName, item, (isError, data) => {
        if (!isError) {
          this.setState({snackbarMessage: 'Oppdateringen var vellykket!', open: true, isLoading: false});
          const data = item;
          data.user_id = this.state.userName; data.first_name = this.state.firstName; data.last_name = this.state.lastName; data.email = this.state.email;
          UserActions.setUserData([data])(store.dispatch);
        } else {
          this.setState({snackbarMessage: 'Noe gikk galt', open: true, isLoading: false});
        }
      });
    }

    handleSnackbarClose = () => {
      this.setState({
        open: false,
      });
    }

    render() {
      const {classes} = this.props;

      return (
        <div>
          <form onSubmit={this.updateData}>
            <Grid container direction='column'>
              <TextField disabled className={classes.inputWidth} label='Brukernavn' variant='outlined' margin='normal' value={this.state.userName} InputProps={{readOnly: true}} />
              <TextField disabled className={classes.inputWidth} label='Fornavn' variant='outlined' margin='normal' value={this.state.firstName} InputProps={{readOnly: true}} />
              <TextField disabled className={classes.inputWidth} label='Etternavn' variant='outlined' margin='normal' value={this.state.lastName} InputProps={{readOnly: true}} />
              <TextField disabled className={classes.inputWidth} label='Epost' variant='outlined' margin='normal' value={this.state.email} InputProps={{readOnly: true}} />
              <TextField className={classes.inputWidth} label='Telefon' variant='outlined' margin='normal' value={this.state.cell} InputProps={{type: 'number'}} onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 8);
              }} onChange={(e) => this.setState({cell: e.target.value})} />
              <TextField className={classes.inputWidth} label='EM-nummer (studentkortet)' variant='outlined' margin='normal' value={this.state.em} onChange={(e) => this.setState({em: e.target.value})} />
              <div className={classes.selectContainer}>
                <TextField disabled className={classNames(classes.inputWidth, classes.selectBox)} label='Studie' variant='outlined' margin='normal' value={this.state.study} onChange={(e) => this.setState({study: e.target.value})} select={true}>
                  <MenuItem value={1}>Dataingeniør</MenuItem>
                  <MenuItem value={2}>Digital forretningsutvikling</MenuItem>
                  <MenuItem value={3}>Digital infrastruktur og cybersikkerhet</MenuItem>
                  <MenuItem value={4}>Digital samhandling</MenuItem>
                  <MenuItem value={5}>Drift av datasystemer</MenuItem>
                </TextField>
                <TextField disabled className={classNames(classes.inputWidth, classes.selectBox, classes.centerSelect)} label='Klasse' variant='outlined' margin='normal' value={this.state.class} onChange={(e) => this.setState({class: e.target.value})} select={true}>
                  <MenuItem value={1}>1. klasse</MenuItem>
                  <MenuItem value={2}>2. klasse</MenuItem>
                  <MenuItem value={3}>3. klasse</MenuItem>
                  <MenuItem value={4}>4. klasse</MenuItem>
                  <MenuItem value={5}>5. klasse</MenuItem>
                </TextField>
                <TextField className={classNames(classes.inputWidth, classes.selectBox)} label='Kjønn' variant='outlined' margin='normal' value={this.state.gender} onChange={(e) => this.setState({gender: e.target.value})} select={true}>
                  <MenuItem value={1}>Mann</MenuItem>
                  <MenuItem value={2}>Kvinne</MenuItem>
                  <MenuItem value={3}>Annet</MenuItem>
                </TextField>
              </div>
              <TextField className={classes.inputWidth} label='Kjøkkenredskap' variant='outlined' margin='normal' value={this.state.tool} onChange={(e) => this.setState({tool: e.target.value})} />
              <TextField className={classes.inputWidth} label='Evt allergier og annen info' variant='outlined' margin='normal' multiline={true} rows={3} value={this.state.allergy} onChange={(e) => this.setState({allergy: e.target.value})} onInput={(e) => {
                e.target.value = (e.target.value).slice(0, 250);
              }} />
              <Button className={classes.mt} variant='contained' color='primary' disabled={this.state.isLoading} type='submit'>
                            Oppdater
              </Button>
            </Grid>
          </form>
          <Snackbar open={this.state.open} onClose={this.handleSnackbarClose} TransitionComponent={this.state.Transition} autoHideDuration={3000}>
            <SnackbarContent className={classes.snackbar} message={this.state.snackbarMessage} />
          </Snackbar>
        </div>
      );
    }
}

ProfileSettings.propTypes = {
  classes: PropTypes.object,
  logOutMethod: PropTypes.func,
};

export default withStyles(styles)(ProfileSettings);
