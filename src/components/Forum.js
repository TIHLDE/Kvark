import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress';

// Project Components
import MessageIndicator from '../components/MessageIndicator';

const styles = {
    root: {
        width: '100%',
        height: 'auto',
        margin: 0,
    },
    wrapper :{
        padding:'30px 30px 30px 30px',
        display: 'flex',
        flexDirection: 'column'
    },
    grid: {
        padding: '30px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
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

class CustomListItem extends Component {
    state = {
        checked: false
    };

    handleClick = (event) => {
        this.setState({
            checked: !this.state.checked
        });
        this.props.handleChange(event);
    };

    render(){
        return(
            <ListItem dense button onClick={this.handleClick}>
                    <Checkbox
                        name={this.props.value.name}
                        checked={this.state.checked}
                    />
                <ListItemText primary={this.props.value.name}/>
            </ListItem>
        )
    }
}

const Listing = withStyles(styles)((props) => {
    const {list, header, classes} = props;
    return (
        <div className={classes.item}>
            <Typography variant='subheading' >{header}</Typography>
            <Divider/>
            <List>
                {list.map((value) => {

                    return <CustomListItem key={value.name} handleChange={props.handleChange} value={value}/>
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
            comment: ""
        },
    };

    handleChange = (part) => (event) => {


        if (part === "info") {
            this.setState({
                data: {
                    ...this.state.data,
                    ["info"]: {
                        ...this.state.data["info"],
                        [event.target.name]: event.target.value
                    }
                }
            })
        }
        else if (part === "comment") {
            this.setState({
                data: {
                    ...this.state.data,
                    ["comment"]: event.target.value
                }
            })
        }
        else if (part === "type") {
            if (event.target.checked) {
                this.setState({
                    data: {
                        ...this.state.data,
                        ["type"]: [...this.state.data["type"], event.target.name]
                    }
                })
            } else {
                this.setState({
                    data: {
                        ...this.state.data,
                        ["type"]: this.state.data["type"].filter(it => it != event.target.name)
                    }
                })
            }
        }
        else if (part === "time") {
            if (event.target.checked) {
                this.setState({
                    data: {
                        ...this.state.data,
                        ["time"]: [...this.state.data["time"], event.target.name]
                    }
                })
            } else {
                this.setState({
                    data: {
                        ...this.state.data,
                        ["time"]: this.state.data["time"].filter(it => it != event.target.name)
                    }
                })
            }
        }
    };

    handleToggleChange = (name) => () => {
        this.setState({[name]: !this.state[name]});
    };

    setMessage = message => {
        this.setState({
            message: message
        })
    };

    handleSubmitted = (name) => () => {
        this.setState({
            [name]: !this.state[name],
            data: {
                info: {},
                time: [],
                type: [],
                comment: ""
            }
        });
    };

    handleSubmit = (event) => {

        console.log(this.state);

        event.preventDefault();

        
        
        if(this.props.scrollToForm) {
            this.props.scrollToForm();
        }
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
                    <Button variant='raised' onClick={this.handleSubmitted('isFormSent')} color='primary'>Mottatt</Button>
                </div>
            )
        }

        return (
            <div className={classNames(classes.root,this.props.className)} >
                <form className={classes.wrapper} onSubmit={this.handleSubmit}>
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



