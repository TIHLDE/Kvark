import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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
        width: 'auto',
        height: 'auto',
        margin: 0,
    },
    wrapper: {
        margin: '10px 10px 10px 10px',
        display: 'flex',
        flexDirection: 'column',
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
    {name: 'høst 2018'},
    {name: 'vår 2019'},
];

const arrangementer =[
    {name: 'Faglig Arrangement'},
    {name: 'Bedex'},
    {name: 'annet'},
];


const Inputter = withStyles(styles)((props) => {
    const {data, firstTextFieldRef} = props;
    return (
        <div >
            <Typography variant='subheading' color='textPrimary'> {data.header}</Typography>
            <TextField
                inputRef={firstTextFieldRef}
                id={data.id}
                label={data.header}
                placeholder={data.placeholder}
                fullWidth
                margin="normal"
                variant="outlined"
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

                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
});

class Forum extends Component {
    render() {
        const {classes, data, firstTextFieldRef} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Typography variant='display1'>Meld interesse:</Typography>
                    <Inputter data={{header: 'bedrift: ', placeholder: 'Bedrift Navnet', id: 'bedrift'}} firstTextFieldRef={firstTextFieldRef} />
                    <Inputter data={{header: 'Kontaktperson: ', placeholder: 'Navn', id: 'kontaktperson'}} />
                    <Inputter data={{header: 'Epost: ', placeholder: 'Skriv Epost her', id: 'epost'}} />
                    <div className ={classes.grid}>
                        <Listing header="SEMESTER" list={semester}/>
                        <Listing header="ARRANGEMENTER" list={arrangementer}/>
                    </div>
                    <Divider/>
                    <Typography variant='subheading'>
                        {data.forumText1}
                    </Typography>
                    <br/>
                    <Typography variant='subheading'>
                        {data.forumText2}
                    </Typography>
                    <Divider/>
                    <TextField
                        id="multiline"
                        multiline
                        placeholder='kommentar'
                        margin="normal"
                        variant="outlined"
                    />
                    <Button variant="contained" color="primary" className={classes.item}>Send inn forum</Button>
                </div>
            </div>
        );
    }
}

Forum.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
    firstTextFieldRef: PropTypes.object,
};

export default withStyles(styles)(Forum);



