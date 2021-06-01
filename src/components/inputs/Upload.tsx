import { useState, useCallback } from 'react';
import { RegisterOptions, UseFormMethods } from 'react-hook-form';
import Cropper from 'react-easy-crop';
import useShare from 'use-share';
import API from 'api/api';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  ButtonProps,
  FormHelperText,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';

// Icons
import ShareIcon from '@material-ui/icons/ShareRounded';

// Project components
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import { getCroppedImgAsBlob, blobToFile, readFile } from 'components/inputs/ImageUploadUtils';

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
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    height: 50,
  },
  cropper: {
    position: 'relative',
    width: '100%',
    height: 400,
    maxHeight: '90vh',
  },
  remove: {
    color: theme.palette.error.main,
  },
  links: {
    display: 'grid',
    gap: theme.spacing(1),
  },
  file: {
    background: theme.palette.background.default,
  },
  link: {
    wordWrap: 'break-word',
  },
}));

export type ImageUploadProps = ButtonProps &
  Pick<UseFormMethods, 'register' | 'watch' | 'setValue' | 'errors'> & {
    rules?: RegisterOptions;
    name: string;
    label?: string;
    ratio?: number;
  };

export const ImageUpload = ({ register, watch, setValue, name, errors = {}, rules = {}, label = 'Last opp fil', ratio, ...props }: ImageUploadProps) => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const url = watch(name);
  const [imageSrc, setImageSrc] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const closeDialog = () => {
    setDialogOpen(false);
    setImageSrc('');
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    setImageFile(undefined);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (ratio) {
          setImageFile(file);
          const imageDataUrl = await readFile(file);
          setImageSrc(imageDataUrl);
          setDialogOpen(true);
        } else {
          uploadFile(file);
        }
      }
    } catch (e) {
      showSnackbar(e.detail, 'error');
    }
  };
  const dialogConfirmCrop = async () => {
    try {
      setIsLoading(true);
      const file = await getCroppedImgAsBlob(imageSrc, croppedAreaPixels, imageFile?.type);
      await uploadFile(file);
    } catch (e) {
      showSnackbar(e.detail, 'error');
    }
    closeDialog();
  };
  const uploadFile = async (file: File | Blob) => {
    setIsLoading(true);
    try {
      const { default: compressImage } = await import('browser-image-compression');
      const compressedImage = await compressImage(file as File, { maxSizeMB: 0.8, maxWidthOrHeight: 1500 });
      const newFile = blobToFile(compressedImage, imageFile?.name || '', imageFile?.type || '');
      const data = await API.uploadFile(newFile);
      setValue(name, data.url);
    } catch (e) {
      showSnackbar(e.detail, 'error');
    }
    setIsLoading(false);
  };
  return (
    <>
      <Paper className={classes.paper}>
        {url && <img className={classes.img} src={url} />}
        <div>
          <input hidden name={name} ref={register && register(rules)} />
          <input accept='image/*' hidden id='image-upload-button' onChange={onSelect} type='file' />
          <label htmlFor='image-upload-button'>
            <Button className={classes.button} color='primary' component='span' disabled={isLoading} fullWidth variant='contained' {...props}>
              {label}
            </Button>
          </label>
        </div>
        {Boolean(errors[name]) && <FormHelperText error>{errors[name]?.message}</FormHelperText>}
        {url && (
          <Button className={classes.remove} color='primary' disabled={isLoading} fullWidth onClick={() => setValue(name, '')}>
            Fjern bilde
          </Button>
        )}
      </Paper>
      <Dialog
        closeText='Avbryt'
        confirmText='Ferdig'
        disabled={isLoading}
        onClose={closeDialog}
        onConfirm={() => dialogConfirmCrop()}
        open={dialogOpen}
        titleText='Tilpass bildet'>
        <div className={classes.cropper}>
          <Cropper aspect={ratio} crop={crop} image={imageSrc} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} zoom={zoom} />
        </div>
        {isLoading && <LinearProgress />}
      </Dialog>
    </>
  );
};

export type FormFileUploadProps = Omit<ImageUploadProps, 'ratio'>;

export const FormFileUpload = ({ register, watch, setValue, name, errors = {}, rules = {}, label = 'Last opp fil', ...props }: FormFileUploadProps) => {
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
        setValue(name, data.url);
        showSnackbar('Filen ble lastet opp, husk å trykk lagre', 'info');
      } catch (e) {
        showSnackbar(e.detail, 'error');
      }
      setIsLoading(false);
    }
  };
  return (
    <Paper className={classes.paper}>
      {url && (
        <Typography>
          Fil: <a href={url}>{url}</a>
        </Typography>
      )}
      <div>
        <input hidden name={name} ref={register && register(rules)} />
        <input hidden id='file-upload-button' onChange={upload} type='file' />
        <label htmlFor='file-upload-button'>
          <Button className={classes.button} color='primary' component='span' disabled={isLoading} fullWidth variant='contained' {...props}>
            {label}
          </Button>
        </label>
      </div>
      {Boolean(errors[name]) && <FormHelperText error>{errors[name]?.message}</FormHelperText>}
      {url && (
        <Button className={classes.remove} color='primary' disabled={isLoading} fullWidth onClick={() => setValue(name, '')}>
          Fjern fil
        </Button>
      )}
    </Paper>
  );
};

export type FileUploadProps = Pick<ImageUploadProps, 'label'> & ButtonProps;

export const FileUpload = ({ label = 'Last opp filer', ...props }: FileUploadProps) => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState<Array<string>>([]);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      try {
        const data = await Promise.all(Array.from(files).map((file) => API.uploadFile(file)));
        setUploaded(data.map((file) => file.url));
        showSnackbar('Filen(e) ble lastet opp', 'info');
      } catch (e) {
        showSnackbar(e.detail, 'error');
      }
      setIsLoading(false);
    }
  };

  const File = ({ url }: { url: string }) => {
    const { share } = useShare({
      title: 'Del fil',
      url,
    });
    return (
      <Paper className={classes.file} noPadding>
        <ListItem>
          <ListItemText
            className={classes.link}
            primary={
              <a href={url} rel='noopener noreferrer' target='_blank'>
                {url}
              </a>
            }
          />
          <ListItemSecondaryAction>
            <IconButton onClick={share}>
              <ShareIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </Paper>
    );
  };

  return (
    <Paper className={classes.paper}>
      <List className={classes.links} disablePadding>
        {uploaded.map((url, i) => (
          <File key={i} url={url} />
        ))}
      </List>
      <div>
        <input hidden id='files-upload-button' multiple onChange={upload} type='file' />
        <label htmlFor='files-upload-button'>
          <Button className={classes.button} color='primary' component='span' disabled={isLoading} fullWidth variant='contained' {...props}>
            {label}
          </Button>
        </label>
      </div>
    </Paper>
  );
};
