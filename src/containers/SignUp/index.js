import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import URLS from '../../URLS';

// Service and action imports
import AuthService from '../../api/services/AuthService';
import MiscService from '../../api/services/MiscService';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';

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
        backgroundImage: 'linear-gradient(90deg, #C6426E, #642B73)',
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
    },
    logo: {
        height: '32px',
        maxHeight: '32px !important',
        margin: 'auto',
        display: 'block',
        marginBottom: 10,
    },
    mt: {marginTop: 16},
    progress: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
    }
};

class SignUp extends Component {

    constructor() {
        super();
        this.state = {
            errorMessage: null,
            isLoading: false,
            redirectURL: MiscService.getLogInRedirectURL(), // Store redirectURL
            study: 1,
            class: 1,
        }

        this.firstName = React.createRef();
        this.lastName = React.createRef();
        this.username = React.createRef();
        this.email = React.createRef();
        this.password = React.createRef();
        this.passwordVerify = React.createRef();
        MiscService.setLogInRedirectURL(null); // Reset login URL
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleChange = (event) => {
        this.setState({errorMessage: null})
    }

    onSignUp = (event) => {
        event.preventDefault();

        if(this.state.isLoading) {
            return;
        }

        const firstName = this.firstName.value;
        const lastName = this.lastName.value;
        const username = this.username.value;
        const email = this.email.value;
        const userClass = this.state.class;
        const study = this.state.study;
        const password = this.password.value;
        const passwordVerify = this.passwordVerify.value;

        if (password !== passwordVerify) {
            this.setState({errorMessage: 'Passordene må være like!'});
            return;
        }
        if (username.includes("@")) {
            this.setState({errorMessage: 'Brukernavn må være uten @stud.ntnu.no'});
            return;
        }

        this.setState({errorMessage: null, isLoading: true});

        const userData = {user_id: username, first_name: firstName, last_name: lastName, email: email, user_class: userClass, user_study: study, password: password};
        AuthService.createUser(userData).then((data) => {
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
                        <Paper className={classes.paper} square elevation={3}>
                            {this.state.isLoading && <LinearProgress className={classes.progress} />}
                            <img  className={classes.logo} src={TIHLDE_LOGO} height='30em' alt='tihlde_logo'/>
                            <Typography variant='h6'>Opprett bruker</Typography>
                            
                            <form onSubmit={this.onSignUp}>
                                <Grid container direction='column'>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.firstName = e}
                                        error={this.state.errorMessage !== null}
                                        label='Fornavn'
                                        variant='outlined'
                                        margin='normal'
                                        required/>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.lastName = e}
                                        error={this.state.errorMessage !== null}
                                        label='Etternavn'
                                        variant='outlined'
                                        margin='normal'
                                        required/>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.username = e}
                                        error={this.state.errorMessage !== null}
                                        label='NTNU brukernavn'
                                        variant='outlined'
                                        margin='normal'
                                        required/>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.email = e}
                                        error={this.state.errorMessage !== null}
                                        label='Epost'
                                        variant='outlined'
                                        margin='normal'
                                        type='email'
                                        required/>
                                    <TextField required label='Studie' variant='outlined' margin='normal' value={this.state.study} onChange={(e) => this.setState({ study: e.target.value })} select={true}>
                                        <MenuItem value={1}>Dataingeniør</MenuItem>
                                        <MenuItem value={2}>Digital forretningsutvikling</MenuItem>
                                        <MenuItem value={3}>Digital infrastruktur og cybersikkerhet</MenuItem>
                                        <MenuItem value={4}>Digital samhandling</MenuItem>
                                        <MenuItem value={5}>Drift av datasystemer</MenuItem>
                                    </TextField>
                                    <TextField required label='Klasse' variant='outlined' margin='normal' value={this.state.class} onChange={(e) => this.setState({ class: e.target.value })} select={true}>
                                        <MenuItem value={1}>1. klasse</MenuItem>
                                        <MenuItem value={2}>2. klasse</MenuItem>
                                        <MenuItem value={3}>3. klasse</MenuItem>
                                        <MenuItem value={4}>4. klasse</MenuItem>
                                        <MenuItem value={5}>5. klasse</MenuItem>
                                    </TextField>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.password = e}
                                        helperText={this.state.errorMessage}
                                        error={this.state.errorMessage !== null}
                                        label='Passord'
                                        variant='outlined'
                                        margin='normal'
                                        type='password'
                                        required/>
                                    <TextField
                                        onChange={this.handleChange}
                                        inputRef={(e) => this.passwordVerify = e}
                                        helperText={this.state.errorMessage}
                                        error={this.state.errorMessage !== null}
                                        label='Gjenta passord'
                                        variant='outlined'
                                        margin='normal'
                                        type='password'
                                        required/>
                                    <Button className={classes.mt}
                                        variant='contained'
                                        color='primary'
                                        disabled={this.state.isLoading}
                                        type='submit'>
                                        Opprett bruker
                                    </Button>
                                </Grid>
                            </form>
                        </Paper>
                    </div>
                </div>
            </Navigation>
        );
    }
}

SignUp.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SignUp);
