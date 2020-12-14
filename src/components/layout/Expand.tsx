import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import htmlReactParser from 'html-react-parser';

// Material UI Components
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: '100%',
    overflow: 'hidden',
    background: theme.palette.background.smoke,
  },
  heading: {
    flexShrink: 1,
    fontWeight: 'bold',
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
  summary: {
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0),
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
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
}));

export type ExpansionProps = {
  flat?: boolean;
  header: string;
  subheader?: string;
  text?: string;
  children?: React.ReactNode;
  subtext?: string;
};

const Expansion = ({ flat, header, subheader, text, children, subtext }: ExpansionProps) => {
  const classes = useStyles();
  return (
    <ExpansionPanel className={classNames(classes.root, flat ? classes.flat : null)}>
      <ExpansionPanelSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
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

export default Expansion;
