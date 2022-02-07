import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';

export type ExpandProps = AccordionProps & {
  header: string;
  children?: ReactNode;
  flat?: boolean;
};

const StyledAccordion = styled(Accordion, { shouldForwardProp: (prop) => prop !== 'flat' })<Pick<ExpandProps, 'flat'>>(({ theme, flat }) => ({
  maxWidth: '100%',
  overflow: 'hidden',
  boxShadow: 'none',
  ...(flat
    ? {
        background: theme.palette.background.smoke,
        border: `1px solid ${theme.palette.divider}`,
      }
    : {}),
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
}));

const Expand = ({ header, children, flat = false, ...props }: ExpandProps) => (
  <StyledAccordion flat={flat} {...props}>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography sx={{ flexShrink: 1, fontWeight: 'bold' }}>{header}</Typography>
    </StyledAccordionSummary>
    <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>{children}</AccordionDetails>
  </StyledAccordion>
);

export default Expand;
