import { ReactNode } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import classNames from 'classnames';
import htmlReactParser from 'html-react-parser';

// Material UI Components
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';

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
  children?: ReactNode;
  subtext?: string;
  className?: string;
};

const Expansion = ({ className, flat, header, subheader, text, children, subtext }: ExpansionProps) => {
  const classes = useStyles();
  return (
    <Accordion className={classNames(classes.root, flat ? classes.flat : null, className)}>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{header}</Typography>
        {subheader && <Typography className={classes.secondaryHeading}>{htmlReactParser(subheader)}</Typography>}
      </AccordionSummary>
      {text ? (
        <AccordionDetails>
          <Typography>{htmlReactParser(text)}</Typography>
        </AccordionDetails>
      ) : (
        <AccordionDetails className={classes.expansionDetails}>{children}</AccordionDetails>
      )}
      {subtext && (
        <AccordionDetails>
          <Typography className={classes.secondaryHeading}>{htmlReactParser(subtext)}</Typography>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

export default Expansion;
