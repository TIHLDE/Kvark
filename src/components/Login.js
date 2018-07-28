// Component used for logging in using
// Currently uses the dummy WebAuth API

import React, { Component, Fragment } from 'react';

import Navigation from '../components/Navigation';

import { withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import WebAuth, {TOKEN} from '../api/webauth';

export default class Login extends Component {
    state = {
        username: '',
        password: '',
        showPassword: false,
    };

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    handleButtonClick = () => {
        WebAuth.auth(this.state.username, this.state.password)
               .then(token => {
                   TOKEN.set(token);
                   console.log(`LOGIN: Got WebAuth token: ${token}`)
                   if (this.props.onLogin) { this.props.onLogin(token) }
               }) // IGNORE catch
    }

    render() {
        return (
            <Paper>
              <FormControl>
                <InputLabel>Username</InputLabel>
                <Input
                  value={this.state.username}
                  onChange={this.handleChange('username')}
                  />
              </FormControl>
              <FormControl>
                <InputLabel>Password</InputLabel>
                <Input
                  id="adornment-password"
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={this.state.password}
                  onChange={this.handleChange('password')}
                  endAdornment={
                          <InputAdornment position="end">
                                <IconButton
                                      aria-label="Toggle password visibility"
                                      onClick={this.handleClickShowPassword}
                                      onMouseDown={this.handleMouseDownPassword}
                                      >
                                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                              </InputAdornment>
                          }
                          />
              </FormControl>
              <Button variant="contained" color="primary" onClick={this.handleButtonClick}>Login</Button>
            </Paper>
        );
    }
}
