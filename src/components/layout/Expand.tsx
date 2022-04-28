import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Collapse,
  CollapseProps,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';

import Paper, { PaperProps } from 'components/layout/Paper';

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

export type StandaloneExpandProps = PaperProps &
  Pick<ListItemTextProps, 'primary' | 'secondary'> & {
    icon: ReactNode;
    children: ReactNode;
    listItemProps?: ListItemProps;
    collapseProps?: CollapseProps;
    expanded?: boolean;
    onExpand?: (expanded: boolean) => void;
  };

export const StandaloneExpand = ({ primary, secondary, icon, children, collapseProps, listItemProps, expanded, onExpand, ...props }: StandaloneExpandProps) => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Paper noOverflow noPadding {...props}>
      <ListItem disablePadding {...listItemProps}>
        <ListItemButton onClick={() => (onExpand ? onExpand(!(expanded !== undefined ? expanded : isExpanded)) : setExpanded((prev) => !prev))}>
          <ListItemIcon sx={{ minWidth: 35 }}>{icon}</ListItemIcon>
          <ListItemText primary={primary} secondary={secondary} />
          <ListItemIcon sx={{ minWidth: 35 }}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Collapse mountOnEnter {...collapseProps} in={expanded !== undefined ? expanded : isExpanded}>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          {children}
        </Stack>
      </Collapse>
    </Paper>
  );
};
