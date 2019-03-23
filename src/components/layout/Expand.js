import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

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
    root: {
        maxWidth: '100%',
        overflow: 'hidden',
    },
    heading: {
        flexShrink: 1,
        fontWeight: 'bold',
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
    },
    summary: {
        '@media only screen and (max-width: 600px)': {
            padding: 0,
            paddingRight: 20,
        }
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
        <ExpansionPanel className={classNames(classes.root, props.flat ? classes.flat : null)} expanded={props.expand}>
            <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMoreIcon />} onClick={props.customCallback}>
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
