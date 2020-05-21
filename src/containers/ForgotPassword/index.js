import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import URLS from '../../URLS';
import classNames from 'classnames';

// Service and action imports
import AuthService from '../../api/services/AuthService';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Icons
import TIHLDE_LOGO from '../../assets/img/TIHLDE_LOGO_B.png';

// Project Components
import Navigation from '../../components/navigation/Navigation';

const styles = {
  root: {
    minHeight: '100vh',
    width: '100%',
  },
  top: {
    height: 220,
    backgroundImage: 'radial-gradient(circle at bottom, #C6426E, #642B73)',
  },
  main: {
    maxWidth: 1000,
    margin: 'auto',
    position: 'relative',
  },
  paper: {
    width: '90%',
    maxWidth: 460,
    margin: 'auto',
    position: 'relative',
    left: 0, right: 0,
    top: '-60px',
    padding: 28,
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
  logo: {
    height: '32px',
    maxHeight: '32px !important',
    margin: 'auto',
    display: 'block',
    marginBottom: 10,
  },
  mt: {
    marginTop: 16,
    width: '100%',
  },
  progress: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  buttonLink: {
    textDecoration: 'none',
    width: '100%',
  },
  button: {
    width: '100%',
  },
  snackbar: {
    // marginBottom: 20,
    backgroundColor: 'white',
    color: 'black',
  },
};

class ForgotPassword extends Component {

  constructor() {
    super();
    this.state = {
      errorMessage: null,
      snackMessage: null,
      isLoading: false,
    };

    this.email = React.createRef();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

    handleChange = (event) => {
      this.setState({errorMessage: null});
    }

    onSubmit = (event) => {
      event.preventDefault();

      if (this.state.isLoading) {
        return;
      }

      const email = this.email.value;

      this.setState({errorMessage: null, isLoading: true});
      AuthService.forgotPassword(email).then((data) => {
        if (data) {
          this.setState({showSnackbar: true, snackMessage: 'Vi har sendt en link til eposten din der du kan opprette et nytt passord', isLoading: false});
        } else {
          this.setState({showSnackbar: true, snackMessage: null, errorMessage: 'Vi fant ingen brukere med denne eposten', isLoading: false});
        }
      });
    }

    toggleSnackbar = () => {
      this.setState({showSnackbar: !this.state.showSnackbar});
    }

    render() {
      const {classes} = this.props;

      return (
        <Navigation footer fancyNavbar>
          <Snackbar
            open={this.state.showSnackbar}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={this.toggleSnackbar}>
            <SnackbarContent
              className={classes.snackbar}
              message={this.state.snackMessage}/>
          </Snackbar>
          <div className={classes.root}>
            <div className={classes.top}>

            </div>
            <div className={classes.main}>
              <div className={classes.paper}>
                {this.state.isLoading && <LinearProgress className={classes.progress} />}
                <img className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo'/>
                <Typography variant='h6'>Glemt passord</Typography>

                <form onSubmit={this.onSubmit}>
                  <Grid container direction='column'>
                    <TextField
                      onChange={this.handleChange}
                      inputRef={(e) => this.email = e}
                      error={this.state.errorMessage !== null}
                      label='Epost'
                      variant='outlined'
                      margin='normal'
                      helperText={this.state.errorMessage}
                      type='email'
                      required/>
                    <Button className={classes.mt}
                      variant='contained'
                      color='primary'
                      disabled={this.state.isLoading}
                      type='submit'>
                                    Få nytt passord
                    </Button>
                    <Link to={URLS.login} className={classNames(classes.buttonLink, classes.mt)}>
                      <Button
                        className={classes.button}
                        color='primary'
                        disabled={this.state.isLoading}
                        type='submit'>
                                            Logg inn
                      </Button>
                    </Link>
                  </Grid>
                </form>
              </div>
            </div>
          </div>
        </Navigation>
      );
    }
}

ForgotPassword.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ForgotPassword);

