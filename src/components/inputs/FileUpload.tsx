import { useState } from 'react';
import API from 'api/api';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button, { ButtonProps } from '@material-ui/core/Button';

// Project components
import Paper from 'components/layout/Paper';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
  img: {
    margin: 'auto',
    maxHeight: 200,
    width: 'auto',
    borderRadius: theme.shape.borderRadius,
  },
  ratioImg: {
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    height: 50,
  },
}));

export type IProps = ButtonProps & {
  label?: string;
  onUpload: (url: string) => Promise<void>;
  uploadOnClick?: boolean;
  requiredRatio?: number;
  url?: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FileUpload = ({ label = 'Last opp fil', onUpload, uploadOnClick = false, requiredRatio, url, ...props }: IProps) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const data = await API.uploadFile(file);
        await onUpload(data.data.url);
        // console.log('Yey');
      } catch (e) {
        // console.error(e);
      }
      setIsLoading(false);
    }
  };
  return (
    <Paper className={classes.paper}>
      {url &&
        (requiredRatio ? (
          <AspectRatioImg alt='Forhåndsvisning' imgClassName={classes.ratioImg} ratio={requiredRatio} src={url} />
        ) : (
          <img className={classes.img} src={url} />
        ))}
      <div>
        <input accept='image/*' hidden id='contained-button-file' onChange={upload} type='file' />
        <label htmlFor='contained-button-file'>
          <Button className={classes.button} color='primary' component='span' disabled={isLoading} fullWidth variant='contained' {...props}>
            {label}
          </Button>
        </label>
      </div>
    </Paper>
  );
};

export default FileUpload;
