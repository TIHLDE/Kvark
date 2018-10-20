import React, { Component } from 'react';

import htmlReactParser from 'html-react-parser';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';


import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Project Components
import Navigation from '../components/Navigation';
import InfoCard from '../components/InfoCard';
import Banner from '../components/Banner';

import Text from '../text/NewStudentText';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';


const styles = theme => ({
    root: {
        minHeight: '90vh',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    banner: {
        marginTop: 20,
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridAutoFlow: 'row',
        gridGap: '15px',
        margin: '20px auto',

        '@media only screen and (max-width: 700px)': {
            gridTemplateColumns: '1fr'
        },
    },

    heading: {
        flexShrink: 0,
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
        marginTop: 20,
    },
    expansionDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
    }
});





const Expansion = withStyles(styles)(props => {
    const { classes } = props;
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
        </ExpansionPanel>
    )
});





class NewStudent extends Component {


    render() {
        const { classes } = this.props;
        return (
            <Navigation footer whitesmoke>
                <div className={classes.root}>
                    <Banner
                        className={classes.banner}
                        title={Text.banner.header}
                        text={Text.banner.subHeader}
                        image={Text.banner.imageUrl}
                    />

                    <Expansion header={Text.faq.header}>
                        {
                            Object.values(Text.faq.content).map((value, index) => (
                                <Expansion key={index} header={value["header"]} text={value["text"]} />
                            ))
                        }
                        <Typography className={classes.secondaryHeading}>{htmlReactParser(Text.faq.subheader)}</Typography>
                    </Expansion>

                    <div className={classes.content}>
                        {
                            Object.values(Text.content).map((value, index) => (
                                <InfoCard key={index} header={value["header"]} text={value["text"]} justifyText/>
                            ))
                        }
                    </div>

                </div>
            </Navigation>
        )
    }
}


export default withStyles(styles)(NewStudent);
