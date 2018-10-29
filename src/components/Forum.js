import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import FORMHANDLER from '../api/formhandler';

// Material UI Components
import {TextField, Typography} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

// Icons

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
    console.log(list);
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
        data: {}
    };

    handleChange = (event) => {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value || event.target.checked
            }
        })
    };

    setMessage = message => {
        this.setState({
            message: message
        })
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setMessage("Sender...");

        const response = FORMHANDLER.formhandler(this.state.data).response();

        response.then((data) => {
                if (response.isError === false && data) {
                    console.log(data);
                    this.setMessage("Sendt! Takk for interressen")
                } else {
                    this.setMessage("Noe gikk galt, prøv senere")
                }
            });

    };

    render() {
        const {classes, firstTextFieldRef} = this.props;
        // const {data} = this.props;
        
        return (
            <form className={classes.root} onSubmit={this.handleSubmit}>
                <Typography variant='display1' gutterBottom>Meld interesse:</Typography>
                <Inputter required handleChange={this.handleChange} data={{header: 'Bedrift: ', placeholder: 'Bedrift Navnet', id: 'bedrift'}} firstTextFieldRef={firstTextFieldRef} />
                <Inputter required handleChange={this.handleChange} data={{header: 'Kontaktperson: ', placeholder: 'Navn', id: 'kontaktperson'}} />
                <Inputter required handleChange={this.handleChange} data={{header: 'Epost: ', placeholder: 'Skriv Epost her', id: 'epost'}} />
                <div className ={classes.grid}>
                    <Listing handleChange={this.handleChange} header="SEMESTER" list={semester}/>
                    <Listing handleChange={this.handleChange} header="ARRANGEMENTER" list={arrangementer}/>
                </div>
                <Divider/>
                {/* <Typography variant='subheading'>
                    {data.forumText1}
                </Typography>
                <br/>
                <Typography variant='subheading'>
                    {data.forumText2}
                </Typography>
                <Divider/> */}
                <TextField
                    onChange={this.handleChange}
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
                <Typography>{this.state.message}</Typography>
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



