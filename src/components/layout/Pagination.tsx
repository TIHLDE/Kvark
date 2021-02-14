import { ReactNode } from 'react';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

export type PaginationProps = {
  fullWidth?: boolean;
  children?: ReactNode;
  nextPage: () => void;
  hasNextPage?: boolean | string | number | null;
  isLoading?: boolean;
};

const Pagination = ({ children, fullWidth, isLoading, nextPage, hasNextPage }: PaginationProps) => {
  const classes = useStyles();
  return (
    <>
      <div>{children}</div>
      {hasNextPage && !isLoading && (
        <Button className={classes.button} fullWidth={fullWidth} onClick={nextPage} variant='outlined'>
          Vis flere elementer
        </Button>
      )}
    </>
  );
};

export default Pagination;
