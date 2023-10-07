import useStyles from './styles';

interface ThreadLineProps {
  indentation: number;
}

/**
 * Vertical line that shows the bounds of a comment thread
 */
export function ThreadLine({ indentation }: ThreadLineProps) {
  const { classes } = useStyles();
  return (
    <div
      className={classes.threadLine}
      style={{
        top: indentation === 0 ? '1rem' : undefined,
        height: indentation === 0 ? `calc(100% - 5.2rem)` : undefined,
      }}></div>
  );
}

/**
 * Horizontal line connecting the comment to each parent thread
 */
export function LocalThreadLine() {
  const { classes } = useStyles();
  return <div className={classes.localThreadLine}></div>;
}
