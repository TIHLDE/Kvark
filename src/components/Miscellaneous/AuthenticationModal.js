import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// API imports
import AUTH from '../../api/auth';

// Material UI Components
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

// Icons
import Security from '@material-ui/icons/Security';

const styles = {
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: 1,
    },
    root: {
        
        maxWidth: 500,
        minWidth: 400,
        margin: 'auto',

        '&:focus': {
            border: 'none',
        }
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        minWidth: 300,
        color: '#FFFFFF',
        '&$cssFocused': {
            color: '#FFFFFF',
        },
    }
};

class AuthenticationModal extends Component {
    
    constructor() {
        super();
        this.state = {
            password: '',

            error: false,
            errorMessage: '',
        }
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value});
    }

    onPasswordSubmit = (event) => {
        event.preventDefault();
        const password = this.state.password;

        this.setState({error: false, errorMessage: ''});

        const response = AUTH.authenticate(password).response()
        response.then((data) => {
            if(response.isError === false && data) {
                console.log(data.authenticated);
                if(data.authenticated === true && this.props.onClose) {
                    this.props.onClose();
                } else {
                    this.setState({error: true, errorMessage: 'The password was incorrect'});
                }
               
            } else {
                this.setState({error: true, errorMessage: 'An issue occured while sending the request'});
            }
        });

    }

    render() {
        const {classes} = this.props;
        return (
            <Modal className={classes.modal} open={true} hideBackdrop>
                    <form onSubmit={this.onPasswordSubmit}>
                        <TextField
                            className={classes.input}
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            fullWidth
                            error={this.state.error}
                            type='password'
                            label='Password'
                            helperText={this.state.error ? this.state.errorMessage : 'Skriv inn passordet for å komme videre'}
                            required
                            variant='outlined'
                            InputProps={{
                                startAdornment:
                                    <InputAdornment position='start'>
                                        <Security />
                                    </InputAdornment>   
                                
                            }}
                        />
                    </form>
                
            </Modal>
        );
    }
}

AuthenticationModal.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AuthenticationModal);