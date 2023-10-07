import { makeStyles } from 'makeStyles';

/**
 * The horizontal space between each level of indentation (sub-comments/threads)
 */
export const INDENTATION_SPACING = 5;

// Styles are used in all of comments components
const useStyles = makeStyles()((theme) => ({
  header: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'start',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  body: {
    flex: 1,
    display: 'block',
    margin: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  card: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
    position: 'relative',
    overflow: 'visible',
    transitionDuration: '300ms',
  },
  collapser: {
    width: '100%',
    marginBottom: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'end',
    maxWidth: '32rem',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  moreButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0),
  },
  thread: {
    paddingTop: theme.spacing(1),
    position: 'relative',
    zIndex: 0,
    overflow: 'visible',
  },
  threadLine: {
    position: 'absolute',
    top: 0,
    left: theme.spacing(INDENTATION_SPACING / 2),
    height: '100%',
    width: theme.spacing(0.15),
    background: theme.palette.divider,
    zIndex: -1,
    // display: 'none',
  },
  localThreadLine: {
    position: 'absolute',
    left: '-1.25rem',
    width: theme.spacing(INDENTATION_SPACING / 2),
    height: theme.spacing(0.15),
    background: theme.palette.divider,
    zIndex: -1,
    bottom: '4.13rem',
    // display: 'none',
  },
  topForm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'end',
    width: '100%',
    gap: theme.spacing(1),
  },
}));

export default useStyles;
