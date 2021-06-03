import { ReactNode } from 'react';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Button, ButtonProps, Theme, Collapse } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

export type PaginationProps = ButtonProps & {
  children?: ReactNode;
  nextPage: () => void;
  hasNextPage?: boolean | string | number | null;
  isLoading?: boolean;
  label?: string;
};

const Pagination = ({ children, isLoading, nextPage, hasNextPage, label = 'Vis flere elementer', ...props }: PaginationProps) => {
  const classes = useStyles();
  return (
    <>
      <div>{children}</div>
      <Collapse in={Boolean(hasNextPage && !isLoading)}>
        <Button className={classes.button} onClick={nextPage} variant='outlined' {...props}>
          {label}
        </Button>
      </Collapse>
    </>
  );
};

export default Pagination;
