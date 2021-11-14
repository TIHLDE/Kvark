import { ReactNode } from 'react';
import { makeStyles } from 'makeStyles';

// Material UI Components
import { AccordionProps, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';

const useStyles = makeStyles()((theme) => ({
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

export type ExpansionProps = AccordionProps & {
  flat?: boolean;
  header: string;
  children?: ReactNode;
  className?: string;
};

const Expansion = ({ className, flat, header, children, ...props }: ExpansionProps) => {
  const { classes, cx } = useStyles();
  return (
    <Accordion className={cx(classes.root, flat && classes.flat, className)} {...props}>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{header}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.expansionDetails}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default Expansion;
