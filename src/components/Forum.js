import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import API from '../api/api';

// Material UI Components
import {TextField, Typography} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Project Components
import MessageIndicator from '../components/MessageIndicator';

const styles = {
    root: {
        width: '100%',
        height: 'auto',
        margin: 0,
        /* padding: '10px 10px', */
        display: 'flex',
        flexDirection: 'column'
    },
    grid: {
        display: 'flex',
        flexDirection: 'row',
    },
    item: {
        flexGrow: 1,
        margin: '10px 10px',
    },
    progress: {
        minHeight: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 28,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    }
};

const semester = [
    {name: 'Høst 2018'},
    {name: 'Vår 2019'},
];

const arrangementer =[
    {name: 'Faglig Arrangement'},
    {name: 'Bedex'},
    {name: 'Annet'},
];


const Inputter = withStyles(styles)((props) => {
    const {data, firstTextFieldRef, handleChange} = props;
    return (
        <div >
            <Typography variant='subheading' color='textPrimary'> {data.header}</Typography>
            <TextField
                inputRef={firstTextFieldRef}
                id={data.id}
                name={data.id}
                label={data.header}
                placeholder={data.placeholder}
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleChange}
                required={props.required}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </div>
    );
});

const Listing = withStyles(styles)((props) => {
    const {list, header, classes} = props;
    return (
        <div className={classes.item}>
            <Typography variant='subheading' >{header}</Typography>
            <Divider/>
            <List>
                {list.map((value) => (
                    <ListItem key={value.name} dense >
                        <ListItemText primary={value.name} />
                        <ListItemSecondaryAction>
                            <Checkbox
                                name={value.name}
                                onChange={props.handleChange}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
});

class Forum extends Component {
    state = {
        isLoading: false,
        isFormSent: false,
        data: {

        },
    };

    handleChange = (part) => (event) => {
        this.setState({
            data: {
                ...this.state.data,
                [part]: {
                    ...this.state.data[part],
                    [event.target.name]: event.target.value || event.target.checked
                }
            }
        })
    };

    handleToggleChange = (name) => () => {
        this.setState({[name]: !this.state[name]});
    }

    setMessage = message => {
        this.setState({
            message: message
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({isLoading: true});

        const response = API.emailForm(this.state.data).response();
        response.then((data) => {
            if (response.isError === false && data) {
                console.log(data);
                this.setMessage("Sendt! Takk for interressen");
            } else {
                this.setMessage("Noe gikk galt, prøv senere")
            }
            this.setState({isLoading: false, isFormSent: true});
        });
    };

    render() {
        const {classes, firstTextFieldRef} = this.props;
        // const {data} = this.props;

        if(this.state.isLoading) {
            return (
                <div className={classes.progress}>
                    <CircularProgress />
                    <Typography variant='title'>{'Laster...'}</Typography>
                </div>
            )
        } else if(this.state.isFormSent) {
            return (
                <div className={classes.progress}>
                    <MessageIndicator header={this.state.message} variant='headline'/>
                    <Button variant='raised' onClick={this.handleToggleChange('isFormSent')} color='primary'>Mottatt</Button>
                </div>
            )
        }
        
        return (
            <form className={classes.root} onSubmit={this.handleSubmit}>
                <Typography variant='display1' gutterBottom>Meld interesse:</Typography>
                <Inputter required handleChange={this.handleChange("info")} data={{header: 'Bedrift: ', placeholder: 'Bedrift Navnet', id: 'bedrift'}} firstTextFieldRef={firstTextFieldRef} />
                <Inputter required handleChange={this.handleChange("info")} data={{header: 'Kontaktperson: ', placeholder: 'Navn', id: 'kontaktperson'}} />
                <Inputter required handleChange={this.handleChange("info")} data={{header: 'Epost: ', placeholder: 'Skriv Epost her', id: 'epost'}} />
                <div className ={classes.grid}>
                    <Listing handleChange={this.handleChange("time")} header="SEMESTER" list={semester}/>
                    <Listing handleChange={this.handleChange("type")} header="ARRANGEMENTER" list={arrangementer}/>
                </div>
                <Divider/>
                <TextField
                    onChange={this.handleChange("comment")}
                    name="kommentar"
                    label='Kommentar'
                    id="multiline"
                    multiline
                    rows={3}
                    rowsMax={6}
                    margin="normal"
                    variant="outlined"
                />
                <Button variant="contained" color="primary" type="submit" className={classes.item}>Send inn forum</Button>
            </form>
        );
    }
}

Forum.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
    firstTextFieldRef: PropTypes.object,
};

export default withStyles(styles)(Forum);



