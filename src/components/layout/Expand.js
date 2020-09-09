import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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
    background: theme.colors.background.light,
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
      paddingLeft: 20,
    },
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

const Expansion = (props) => {
  const { classes, flat, expand, customCallback, header, subheader, text, children, subtext } = props;
  return (
    <ExpansionPanel className={classNames(classes.root, flat ? classes.flat : null)} expanded={expand}>
      <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMoreIcon />} onClick={customCallback}>
        <Typography className={classes.heading}>{header}</Typography>
        {subheader && <Typography className={classes.secondaryHeading}>{htmlReactParser(subheader)}</Typography>}
      </ExpansionPanelSummary>
      {text ? (
        <ExpansionPanelDetails>
          <Typography>{htmlReactParser(text)}</Typography>
        </ExpansionPanelDetails>
      ) : (
        <ExpansionPanelDetails className={classes.expansionDetails}>{children}</ExpansionPanelDetails>
      )}
      {subtext && (
        <ExpansionPanelDetails>
          <Typography className={classes.secondaryHeading}>{htmlReactParser(subtext)}</Typography>
        </ExpansionPanelDetails>
      )}
    </ExpansionPanel>
  );
};

Expansion.propTypes = {
  classes: PropTypes.object,
  flat: PropTypes.bool,
  expand: PropTypes.bool,
  customCallback: PropTypes.func,
  header: PropTypes.string,
  subheader: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
  subtext: PropTypes.string,
};

export default withStyles(styles)(Expansion);
