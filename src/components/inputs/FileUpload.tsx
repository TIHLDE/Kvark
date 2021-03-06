import { useState } from 'react';
import { RegisterOptions, UseFormMethods } from 'react-hook-form';
import API from 'api/api';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button, { ButtonProps } from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

// Project components
import Paper from 'components/layout/Paper';
import AspectRatioImg from 'components/miscellaneous/AspectRatioImg';
import { Typography } from '@material-ui/core';

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

export type IProps = ButtonProps &
  Pick<UseFormMethods, 'register' | 'watch' | 'setValue' | 'errors'> & {
    rules?: RegisterOptions;
    name: string;
    fileType: 'img' | 'file';
    label?: string;
    requiredRatio?: number;
  };

const FileUpload = ({ fileType, register, watch, setValue, name, errors = {}, rules = {}, label = 'Last opp fil', requiredRatio, ...props }: IProps) => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const url = watch(name);
  const [isLoading, setIsLoading] = useState(false);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const data = await API.uploadFile(file);
        setValue(name, data.data.url);
        showSnackbar('Filen ble lastet opp, husk å trykk lagre', 'info');
      } catch (e) {
        showSnackbar(e.detail, 'error');
      }
      setIsLoading(false);
    }
  };
  return (
    <Paper className={classes.paper}>
      {fileType === 'img' ? (
        url &&
        (requiredRatio ? (
          <AspectRatioImg alt='Forhåndsvisning' imgClassName={classes.ratioImg} ratio={requiredRatio} src={url} />
        ) : (
          <img className={classes.img} src={url} />
        ))
      ) : (
        <Typography>
          Fil: <a href={url}>{url}</a>
        </Typography>
      )}
      <div>
        <input hidden name={name} ref={register && register(rules)} />
        <input accept={fileType === 'img' ? 'image/*' : undefined} hidden id='file-upload-button' onChange={upload} type='file' />
        <label htmlFor='file-upload-button'>
          <Button className={classes.button} color='primary' component='span' disabled={isLoading} fullWidth variant='contained' {...props}>
            {label}
          </Button>
        </label>
      </div>
      {Boolean(errors[name]) && <FormHelperText error>{errors[name]?.message}</FormHelperText>}
    </Paper>
  );
};

export default FileUpload;
