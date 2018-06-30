import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
    root: {
      width: '300px',
      position: 'absolute',
      right: '0',
      top: '0',
      bottom: '0',
      paddingTop: '10px',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  });

class CMS extends Component {

    mapToJSS(elements) {
        if (elements == null) return null;
        else return elements.map((element) => <Typography key={ null }>Element</Typography>);
    }

    render() {
        const { classes } = this.props;
        const elements = this.mapToJSS(this.props.elements) || <Typography>No elements</Typography>;
        return (
            <Paper className={ classes.root } elevation={ 2 }>
                <Typography variant="headline" component="h3">
                    CMS panel
                </Typography>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Elements</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        { elements }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Grid</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Empty
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Paper>
        );
    }
}

CMS.propTypes = {
    classes: PropTypes.object.isRequired,
    elements: PropTypes.any,
};



export default withStyles(styles)(CMS);
