import React from 'react';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// External Components
import htmlReactParser from 'html-react-parser';

const styles = (theme) => ({
    heading: {
        flexShrink: 0,
        fontWeight: 'bold',
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    expansionDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    flat: {
        boxShadow: 'none',
    },
});


const Expansion = withStyles(styles)((props) => {
    const { classes } = props;
    return (
        <ExpansionPanel className={props.flat ? classes.flat : null} expanded={props.expand}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={props.customCallback}>
                <Typography className={classes.heading}>{props.header}</Typography>
                { props.subheader ?
                    <Typography className={classes.secondaryHeading}>{htmlReactParser(props.subheader)}</Typography>
                    : null
                }
            </ExpansionPanelSummary>
            { props.text ?
                <ExpansionPanelDetails>
                    <Typography>
                        { htmlReactParser(props.text) }
                    </Typography>
                </ExpansionPanelDetails>
                :
                <ExpansionPanelDetails className={classes.expansionDetails}>
                    { props.children }
                </ExpansionPanelDetails>
            }
            { props.subtext ?
                <ExpansionPanelDetails>
                    <Typography className={classes.secondaryHeading}>{htmlReactParser(props.subtext)}</Typography>
                </ExpansionPanelDetails>
                : null
            }
        </ExpansionPanel>
    );
});



export default withStyles(styles)(Expansion);
