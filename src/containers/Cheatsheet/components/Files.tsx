import { Fragment } from 'react';
import classnames from 'classnames';
import { CheatsheetType } from 'types/Enums';
import { Cheatsheet } from 'types/Types';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import { Theme, Divider, useMediaQuery, Typography, List, ListItemButton, Tooltip } from '@material-ui/core';

// Icons
import { ReactComponent as GitHub } from 'assets/icons/github.svg';
import VerifiedIcon from '@material-ui/icons/VerifiedUserRounded';
import DocumentIcon from '@material-ui/icons/DescriptionRounded';
import LinkIcon from '@material-ui/icons/LinkRounded';
import OpenInNewIcon from '@material-ui/icons/OpenInNewRounded';

// Project Components
import Paper from 'components/layout/Paper';
import Pagination from 'components/layout/Pagination';
import { useGoogleAnalytics } from 'api/hooks/Utils';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    width: '100%',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '26px 4fr 2fr 3fr',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '26px 1fr 1fr',
      gridGap: theme.spacing(1),
    },
  },
  filesHeaderContainer: {
    textAlign: 'left',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  filesHeader: {
    fontWeight: 'bold',
  },
  listItem: {
    marginBottom: 0,
    borderRadius: 0,
    border: 'none',
  },
  icon: {
    fill: theme.palette.text.secondary,
    height: 26,
    width: 26,
  },
  verified: {
    fill: theme.palette.success.dark,
    height: 22,
    width: 22,
    margin: `auto 0 auto ${theme.spacing(0.5)}`,
  },
  flex: {
    display: 'flex',
  },
}));

export type FilesProps = {
  files: Array<Cheatsheet>;
  hasNextPage: boolean | undefined;
  getNextPage: () => void;
  isLoading: boolean;
};

const Files = ({ files, hasNextPage, getNextPage, isLoading }: FilesProps) => {
  const classes = useStyles();
  const { event } = useGoogleAnalytics();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const Icon = ({ cheatsheet }: { cheatsheet: Cheatsheet }) => {
    if (cheatsheet.type === CheatsheetType.FILE) {
      return (
        <Tooltip title='Fil'>
          <DocumentIcon className={classes.icon} />
        </Tooltip>
      );
    } else if (cheatsheet.type === CheatsheetType.GITHUB) {
      return (
        <Tooltip title='GitHub'>
          <GitHub className={classes.icon} />
        </Tooltip>
      );
    } else if (cheatsheet.type === CheatsheetType.LINK) {
      return (
        <Tooltip title='Link'>
          <LinkIcon className={classes.icon} />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title='Annet'>
          <OpenInNewIcon className={classes.icon} />
        </Tooltip>
      );
    }
  };

  const onOpenFile = (file: Cheatsheet) => event('open', 'cheatsheet', `Opened ${file.title}, ${file.course}`);

  return (
    <>
      <div className={classnames(classes.grid, classes.filesHeaderContainer)}>
        <div></div>
        <Typography className={classes.filesHeader} variant='subtitle1'>
          Tittel:
        </Typography>
        {!lgDown && (
          <Typography className={classes.filesHeader} variant='subtitle1'>
            Av:
          </Typography>
        )}
        <Typography className={classes.filesHeader} variant='subtitle1'>
          Fag:
        </Typography>
      </div>
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isLoading} nextPage={getNextPage}>
        {files.length ? (
          <List aria-label='Filer'>
            {files.map((file, index) => (
              <Fragment key={index}>
                <Divider />
                <Paper className={classes.listItem} noPadding>
                  <ListItemButton component='a' href={file.url} onClick={() => onOpenFile(file)} rel='noopener noreferrer' target='_blank'>
                    <div className={classes.grid}>
                      <Icon cheatsheet={file} />
                      <Typography variant='subtitle1'>
                        <strong>{file.title}</strong>
                      </Typography>
                      {!lgDown && (
                        <div className={classes.flex}>
                          <Typography variant='subtitle1'>{file.creator}</Typography>
                          {file.official && (
                            <Tooltip title='Laget av NTNU'>
                              <VerifiedIcon className={classnames(classes.icon, classes.verified)} />
                            </Tooltip>
                          )}
                        </div>
                      )}
                      <div className={classes.flex}>
                        <Typography variant='subtitle1'>{file.course}</Typography>
                        {file.official && lgDown && (
                          <Tooltip title='Laget av NTNU'>
                            <VerifiedIcon className={classnames(classes.icon, classes.verified)} />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </ListItemButton>
                </Paper>
                {index === files.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        ) : (
          <Typography align='center'>Fant ingen oppskrifter</Typography>
        )}
      </Pagination>
    </>
  );
};

export default Files;
