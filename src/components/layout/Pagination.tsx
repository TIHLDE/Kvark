import { ReactNode } from 'react';

// Material UI Components
import { Button, ButtonProps, Collapse } from '@mui/material';

export type PaginationProps = ButtonProps & {
  children?: ReactNode;
  nextPage: () => void;
  hasNextPage?: boolean | string | number | null;
  isLoading?: boolean;
  label?: string;
};

const Pagination = ({ children, isLoading, nextPage, hasNextPage, label = 'Vis flere elementer', ...props }: PaginationProps) => {
  return (
    <>
      <div>{children}</div>
      <Collapse in={Boolean(hasNextPage && !isLoading)}>
        <Button onClick={nextPage} sx={{ backgroundColor: (theme) => theme.palette.background.paper }} variant='outlined' {...props}>
          {label}
        </Button>
      </Collapse>
    </>
  );
};

export default Pagination;
