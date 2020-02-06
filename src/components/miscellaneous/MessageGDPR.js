import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';

// Material UI
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Cookie
const cookies = new Cookies();
const COOKIE_ID = 'accepted_analytics';

// Style
const style = {
    root: {
        position: 'sticky',
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'whitesmoke',
        width: '100%',
        height: 'auto',
        padding: 15,
        display: 'flex',
        '@media only screen and (max-width: 700px)': {
            flexDirection: 'column',
        },
    },
    button: {
        minWidth: '15vw',
        maxHeight: 45,
        marginLeft: 15,
        '@media only screen and (max-width: 700px)': {
            minWidth: '100%',
            marginLeft: 0,
            marginTop: 15,
        },
    },
    text: {
        flexGrow: 1,
    },
};

const MessageGDPR = (props) => {
    const {classes} = props;
    const cookieValue = cookies.get(COOKIE_ID) ? false : true;
    const [displayState, setDisplayState] = useState(cookieValue);

    const closeDialog = () => {
        setDisplayState(false);
        cookies.set(COOKIE_ID, true, {path: '/', expires: new Date(Date.now() + 3600 * 24000 * 365)});
    };

    return (
        <React.Fragment>
            {displayState && <div className={classes.root}>
                <Typography className={classes.text}>Denne nettsiden bruker Google Analytics for å forbedre

                hvordan siden brukes. Ved å fortsette å bruke denne siden godtar
                du Googles bruk av denne informasjonen som angitt <a rel='noopener noreferrer' target='_blank' href='https://policies.google.com/technologies/partner-sites?hl=no'>her</a>.
                Du godtar også bruk av informasjonskapsler.</Typography>
                <Button
                    onClick={() => {closeDialog();}}
                    className={classes.button}
                    color='primary'
                    variant='contained'>Ok</Button>
            </div>}
        </React.Fragment>
    );
};

MessageGDPR.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(style)(MessageGDPR);
