import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import URLS from '../../URLS';
import classNames from 'classnames';

// Service and action imports
import AuthService from '../../api/services/AuthService';
import MiscService from '../../api/services/MiscService';

// Text imports
import Text from '../../text/LogInText';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

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
        height: 160,
        backgroundImage: 'linear-gradient(90deg, #FF8235, #30E8BF)',
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
    buttonsContainer: {
        display: 'flex',
    },
    buttonLink: {
        textDecoration: 'none',
        width: '100%',
    },
    button: {
        width: '100%',
    },
};

class LogIn extends Component {

    constructor() {
        super();
        this.state = {
            errorMessage: null,
            isLoading: false,
            redirectURL: MiscService.getLogInRedirectURL(), // Store redirectURL
        }

        this.username = React.createRef();
        this.password = React.createRef();
        MiscService.setLogInRedirectURL(null); // Reset login URL
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleChange = (event) => {
        this.setState({errorMessage: null})
    }

    onLogIn = (event) => {
        event.preventDefault();

        if(this.state.isLoading) {
            return;
        }

        const username = this.username.value;
        const password = this.password.value;

        this.setState({errorMessage: null, isLoading: true});
        AuthService.logIn(username, password).then((data) => {
            if(data) {
                this.props.history.push(this.state.redirectURL || URLS.landing);
            } else {
                this.setState({errorMessage: Text.wrongCred, isLoading: false})
            }
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <Navigation footer>
                <div className={classes.root}>
                    <div className={classes.top}>
                
                    </div>
                    <div className={classes.main}>
                        <div className={classes.paper}>
                            {this.state.isLoading && <LinearProgress className={classes.progress} />}
                            <img  className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo'/>
                            <Typography variant='h6'>{Text.header}</Typography>
                            
                            <form onSubmit={this.onLogIn}>
                                <Grid container direction='column'>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.username = e}
                                        error={this.state.errorMessage !== null}
                                        label='Brukernavn'
                                        variant='outlined'
                                        margin='normal'
                                        required/>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.password = e}
                                        helperText={this.state.errorMessage}
                                        error={this.state.errorMessage !== null}
                                        label='Password'
                                        variant='outlined'
                                        margin='normal'
                                        type='password'
                                        required/>
                                    <Button className={classes.mt}
                                        variant='contained'
                                        color='primary'
                                        disabled={this.state.isLoading}
                                        type='submit'>
                                    Logg inn
                                    </Button>
                                    <div className={classes.buttonsContainer}>
                                        <Link to={URLS.forgotPassword} className={classNames(classes.buttonLink, classes.mt)}>
                                            <Button
                                                className={classes.button}
                                                color='primary'
                                                disabled={this.state.isLoading}
                                                type='submit'>
                                                Glemt passord?
                                            </Button>
                                        </Link>
                                        <Link to={URLS.signup} className={classNames(classes.buttonLink, classes.mt)}>
                                            <Button
                                                className={classes.button}
                                                color='primary'
                                                disabled={this.state.isLoading}
                                                type='submit'>
                                                Opprett bruker
                                            </Button>
                                        </Link>
                                    </div>
                                </Grid>
                            </form>
                        </div>
                    </div>
                </div>
            </Navigation>
        );
    }
}

LogIn.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(LogIn);

