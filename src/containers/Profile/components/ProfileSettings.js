// React
import React, { Component } from 'react';
import classNames from 'classnames';

// API and store import
import UserService from '../../../api/services/UserService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme) => ({
    paper: {
        width: '90%',
        maxWidth: 750,
        margin: 'auto',
        position: 'absolute',
        left: 0,
        right: 0,
        top: '-60px',
        padding: '28px',
        paddingTop: '110px',
        textAlign: 'center',
    },
    profileCircle: {
        border: '1px solid #222222',
        borderRadius: '50%',
        backgroundColor: 'peru',
        fontSize: '65px',
        paddingTop: '50px',
        color: 'black',
        height: '200px',
        width: '200px',
        textAlign: 'center',
        margin: 'auto',
        position: 'absolute',
        left: '0',
        right: '0',
        top: '-100px',
    },
    profileCircleImage: {
        backgroundImage: 'url(https://thenypost.files.wordpress.com/2019/09/takes-donald-trump.jpg?quality=90&strip=all&w=618&h=410&crop=1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#00000000',
    },
    mt: {
        marginTop: '16px'
    },
    tabs: {
        marginTop: '10px',
        marginBottom: 1,
        backgroundColor: 'white',
    },
    button: {
        marginTop: '15px',
    },
    formControl: {
        minWidth: 120,
    },
    radioInput: {
        border: '1px solid #d9d9d9',
        padding: '5px',
        borderRadius: '4px',
        marginTop: '5px',
        marginBottom: '5px',
    },
    radioInputCenter: {
        marginRight: '2px',
        marginLeft: '2px',
    },
    radioContainer: {
        justifyContent: 'space-around',
        display: 'flex',
        marginTop: '16px',
        marginBottom: '8px',
        '@media only screen and (max-width: 400px)': {
            flexDirection: 'column',
        },
    },
    inputWidth: {
        maxWidth: '100%',
        textAlign: 'left',
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
    }
});

class ProfileSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            errorMessage: null,
            isLoading: false,
            userName: "",
            firstName: "",
            lastName: "",
            email: "",
            cell: "",
            em: "",
            study: 1,
            class: 1,
            gender: 1,
            tool: "",
            allergy: "",
        }
    }

    loadUserData = () => {
        UserService.getUserData().then((user) => {
            if (user) {
                this.setState({ userData: user, userName: user.user_id, firstName: user.first_name, lastName: user.last_name, email: user.email, cell: user.cell, em: user.em_nr, study: user.user_study, class: user.user_class, gender: user.gender, tool: user.tool, allergy: user.allergy });
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

        this.setState({ errorMessage: null, isLoading: true });

        const item = this.getStateNewUserData();

        UserService.updateUserData(this.state.userName, item, (isError, data) => {
            if(!isError) {
                this.setState({ errorMessage: null, isLoading: false });
            } else {
                this.setState({ errorMessage: 'Noe gikk galt', isLoading: false });
            }
            this.setState({isLoading: false});
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <form onSubmit={this.updateData}>
                    <Grid container direction='column'>
                        <TextField disabled className={classes.inputWidth} label='Brukernavn' variant='outlined' margin='normal' value={this.state.userName} InputProps={{readOnly: true}} />
                        <TextField disabled className={classes.inputWidth} label='Fornavn' variant='outlined' margin='normal' value={this.state.firstName} InputProps={{readOnly: true}} />
                        <TextField disabled className={classes.inputWidth} label='Etternavn' variant='outlined' margin='normal' value={this.state.lastName} InputProps={{readOnly: true}} />
                        <TextField disabled className={classes.inputWidth} label='Epost' variant='outlined' margin='normal' value={this.state.email} InputProps={{readOnly: true}} />
                        <TextField className={classes.inputWidth} label='Telefon' variant='outlined' margin='normal' value={this.state.cell} InputProps={{type: 'number',}} onInput={(e)=>{e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,8)}} onChange={(e) => this.setState({ cell: e.target.value })} />
                        <TextField className={classes.inputWidth} label='EM-nummer (studentkortet)' variant='outlined' margin='normal' value={this.state.em} InputProps={{type: 'number',}} onInput={(e)=>{e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)}} onChange={(e) => this.setState({ em: e.target.value })} />
                        <div className={classes.selectContainer}>
                            <TextField className={classNames(classes.inputWidth, classes.selectBox)} label='Studie' variant='outlined' margin='normal' value={this.state.study} onChange={(e) => this.setState({ study: e.target.value })} select={true}>
                                <MenuItem value={1}>Dataing</MenuItem>
                                <MenuItem value={2}>DigFor</MenuItem>
                                <MenuItem value={3}>DigInc</MenuItem>
                                <MenuItem value={4}>DigSam</MenuItem>
                            </TextField>
                            <TextField className={classNames(classes.inputWidth, classes.selectBox, classes.centerSelect)} label='Klasse' variant='outlined' margin='normal' value={this.state.class} onChange={(e) => this.setState({ class: e.target.value })} select={true}>
                                <MenuItem value={1}>1. klasse</MenuItem>
                                <MenuItem value={2}>2. klasse</MenuItem>
                                <MenuItem value={3}>3. klasse</MenuItem>
                                <MenuItem value={4}>4. klasse</MenuItem>
                                <MenuItem value={5}>5. klasse</MenuItem>
                            </TextField>
                            <TextField className={classNames(classes.inputWidth, classes.selectBox)} label='Kjønn' variant='outlined' margin='normal' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} select={true}>
                                <MenuItem value={1}>Mann</MenuItem>
                                <MenuItem value={2}>Kvinne</MenuItem>
                                <MenuItem value={3}>Annet</MenuItem>
                            </TextField>
                        </div>
                        <TextField className={classes.inputWidth} label='Kjøkkenredskap' variant='outlined' margin='normal' value={this.state.tool} onChange={(e) => this.setState({ tool: e.target.value })} />
                        <TextField className={classes.inputWidth} label='Evt allergier og annen info' variant='outlined' margin='normal' multiline={true} rows={3} value={this.state.allergy} onChange={(e) => this.setState({ allergy: e.target.value })} onInput={(e)=>{e.target.value = (e.target.value).slice(0,250)}} />
                        <Button className={classes.mt} variant='contained' color='primary' disabled={this.state.isLoading} type='submit'>
                            Oppdater
                        </Button>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(ProfileSettings);