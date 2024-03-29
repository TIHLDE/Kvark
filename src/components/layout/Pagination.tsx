import { Button, ButtonProps, Collapse } from '@mui/material';
import { ReactNode } from 'react';

export type PaginationProps = ButtonProps & {
  children?: ReactNode;
  nextPage: () => void;
  hasNextPage?: boolean | string | number | null;
  isLoading?: boolean;
  label?: string;
};

const Pagination = ({ children, isLoading, nextPage, hasNextPage, label = 'Last inn mer', ...props }: PaginationProps) => (
  <>
    {children}
    <Collapse in={Boolean(hasNextPage && !isLoading)} mountOnEnter unmountOnExit>
      <Button onClick={nextPage} sx={{ backgroundColor: (theme) => theme.palette.background.paper }} variant='outlined' {...props}>
        {label}
      </Button>
    </Collapse>
  </>
);

export default Pagination;
