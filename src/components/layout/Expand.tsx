import { ReactNode } from 'react';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

// Material UI Components
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    overflow: 'hidden',
    background: theme.palette.background.smoke,
  },
  heading: {
    flexShrink: 1,
    fontWeight: 'bold',
  },
  summary: {
    [theme.breakpoints.down('lg')]: {
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
  children?: ReactNode;
  className?: string;
};

const Expansion = ({ className, flat, header, children }: ExpansionProps) => {
  const classes = useStyles();
  return (
    <Accordion className={classNames(classes.root, flat && classes.flat, className)}>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{header}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.expansionDetails}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default Expansion;
