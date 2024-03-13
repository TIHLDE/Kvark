import ShareIcon from '@mui/icons-material/ShareRounded';
import {
  ButtonProps,
  FormHelperText,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Button as MuiButton,
  styled,
  Typography,
} from '@mui/material';
import { CloudUploadIcon } from 'lucide-react';
import { forwardRef, useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { FieldError, FieldValues, Path, PathValue, UnpackNestedValue, UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';

import API from 'api/api';

import { useSnackbar } from 'hooks/Snackbar';
import { useAnalytics, useShare } from 'hooks/Utils';

import { blobToFile, getCroppedImgAsBlob, readFile } from 'components/inputs/ImageUploadUtils';
import Dialog from 'components/layout/Dialog';
import Paper, { PaperProps } from 'components/layout/Paper';
import { Button } from 'components/ui/button';

const UploadPaper = styled(Paper)(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spacing(1),
  padding: theme.spacing(2),
  background: theme.palette.background.default,
}));

const Img = styled('img')(({ theme }) => ({
  margin: 'auto',
  maxHeight: 200,
  width: 'auto',
  maxWidth: '100%',
  borderRadius: theme.shape.borderRadius,
}));

const CropperWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  height: 400,
  maxHeight: '90vh',
});

export type ImageUploadProps<FormValues extends FieldValues = FieldValues> = ButtonProps &
  Pick<UseFormReturn<FormValues>, 'formState' | 'watch' | 'setValue'> & {
    register: UseFormRegisterReturn;
    label?: string;
    ratio?: `${number}:${number}`;
    paperProps?: PaperProps;
  };

export const GenericImageUpload = <FormValues extends FieldValues>({
  register,
  watch,
  setValue,
  formState,
  label = 'Last opp fil',
  ratio,
}: ImageUploadProps<FormValues>) => {
  const name = register.name as Path<FormValues>;
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  const showSnackbar = useSnackbar();
  const url = watch(name);
  const [imageSrc, setImageSrc] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { event } = useAnalytics();

  const ratioFloat = ratio
    ?.split(':')
    .map(Number)
    .reduce((previousValue, currentValue) => previousValue / currentValue);
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
        setImageFile(file);
        if (ratio) {
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
      const newFile = blobToFile(compressedImage, file instanceof File ? file.name : imageFile?.name || '', imageFile?.type || file.type || '');
      const data = await API.uploadFile(newFile);
      event('upload', 'file-upload', 'Uploaded file');
      setValue(name, data.url as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>);
    } catch (e) {
      showSnackbar(e.detail, 'error');
    }
    setIsLoading(false);
  };
  return (
    <>
      <div className='space-y-2 py-4'>
        {url ? (
          <Img loading='lazy' src={url as string} />
        ) : (
          <div className='flex items-center justify-center w-full'>
            <label
              className={
                isLoading
                  ? 'cursor-default'
                  : 'cursor-pointer' +
                    ` flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-background md:hover:bg-secondary md:dark:hover:border-gray-600`
              }
              htmlFor='image-upload-button'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6 space-y-4'>
                <CloudUploadIcon className='w-10 h-10 text-gray-400 dark:text-gray-300 stroke-[1.5]' />
                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold'>{label}</p>
              </div>
              <input disabled={isLoading} hidden {...register} />
              <input accept='image/*' disabled={isLoading} hidden id='image-upload-button' onChange={onSelect} type='file' />
            </label>
          </div>
        )}
        {Boolean(error) && <FormHelperText error>{error?.message}</FormHelperText>}
        {url && (
          <Button
            className='w-full font-semibold'
            disabled={isLoading}
            onClick={() => setValue(name, '' as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>)}
            size='lg'
            variant='destructive'>
            Fjern bilde
          </Button>
        )}
      </div>
      <Dialog
        closeText='Avbryt'
        confirmText='Ferdig'
        disabled={isLoading}
        onClose={closeDialog}
        onConfirm={() => dialogConfirmCrop()}
        open={dialogOpen}
        titleText='Tilpass bildet'>
        <>
          <CropperWrapper>
            <Cropper
              aspect={ratioFloat}
              crop={crop}
              image={imageSrc}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoom={zoom}
            />
          </CropperWrapper>
          <Typography textAlign='center'>Anbefalt størrelsesforhold: {ratio}</Typography>
        </>
        {isLoading && <LinearProgress />}
      </Dialog>
    </>
  );
};

export const ImageUpload = forwardRef(GenericImageUpload) as <FormValues>(
  props: ImageUploadProps<FormValues> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof GenericImageUpload>;

export type FormFileUploadProps<FormValues> = Omit<ImageUploadProps<FormValues>, 'ratio'> & {
  accept?: React.InputHTMLAttributes<HTMLInputElement>['accept'];
};

export const FormFileUpload = <FormValues extends FieldValues>({
  register,
  watch,
  setValue,
  formState,
  label = 'Last opp fil',
  paperProps,
  accept,
  ...props
}: FormFileUploadProps<FormValues>) => {
  const name = register.name as Path<FormValues>;
  const { [name]: fieldError } = formState.errors;
  const error = fieldError as FieldError;
  const showSnackbar = useSnackbar();
  const url = watch(name);
  const [isLoading, setIsLoading] = useState(false);
  const { event } = useAnalytics();

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const data = await API.uploadFile(file);
        event('upload', 'file-upload', 'Uploaded file');
        setValue(name, data.url as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>);
        showSnackbar('Filen ble lastet opp, husk å trykk lagre', 'info');
      } catch (e) {
        showSnackbar(e.detail, 'error');
      }
      setIsLoading(false);
    }
  };
  return (
    <UploadPaper {...paperProps}>
      {url && (
        <Typography>
          Fil:{' '}
          <Typography component='a' href={url as string} sx={{ wordBreak: 'break-word' }}>
            {url as string}
          </Typography>
        </Typography>
      )}
      <div>
        <input hidden {...register} />
        <input accept={accept} hidden id='file-upload-button' onChange={upload} type='file' />
        <label htmlFor='file-upload-button'>
          <MuiButton component='span' disabled={isLoading} fullWidth variant='contained' {...props}>
            {label}
          </MuiButton>
        </label>
      </div>
      {Boolean(error) && <FormHelperText error>{error?.message}</FormHelperText>}
      {url && (
        <MuiButton
          color='error'
          disabled={isLoading}
          fullWidth
          onClick={() => setValue(name, '' as UnpackNestedValue<PathValue<FormValues, Path<FormValues>>>)}>
          Fjern fil
        </MuiButton>
      )}
    </UploadPaper>
  );
};

export type FileUploadProps<FormValues> = Pick<ImageUploadProps<FormValues>, 'label' | 'paperProps'> &
  ButtonProps &
  Pick<FormFileUploadProps<FormValues>, 'accept'>;

export const FileUpload = <FormValues extends FieldValues>({ label = 'Last opp filer', accept, paperProps, ...props }: FileUploadProps<FormValues>) => {
  const { event } = useAnalytics();
  const showSnackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState<Array<string>>([]);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      try {
        const data = await Promise.all(Array.from(files).map((file) => API.uploadFile(file)));
        event('upload', 'file-upload', 'Uploaded file');
        setUploaded(data.map((file) => file.url));
        showSnackbar('Filen(e) ble lastet opp', 'info');
      } catch (e) {
        showSnackbar(e.detail, 'error');
      }
      setIsLoading(false);
    }
  };

  const File = ({ url }: { url: string }) => {
    const { share } = useShare(
      {
        title: 'Del fil',
        url,
      },
      'Link til filen ble kopiert til utklippstavlen',
      () => event('share-uploaded-file', 'share', url),
    );
    return (
      <Paper bgColor='default' noPadding>
        <ListItem>
          <ListItemText
            primary={
              <a href={url} rel='noopener noreferrer' target='_blank'>
                {url}
              </a>
            }
            sx={{ wordBreak: 'break-word' }}
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
    <UploadPaper {...paperProps}>
      <List disablePadding sx={{ display: 'grid', gap: 1 }}>
        {uploaded.map((url, i) => (
          <File key={i} url={url} />
        ))}
      </List>
      <div>
        <input accept={accept} hidden id='files-upload-button' multiple onChange={upload} type='file' />
        <label htmlFor='files-upload-button'>
          <MuiButton component='span' disabled={isLoading} fullWidth variant='contained' {...props}>
            {label}
          </MuiButton>
        </label>
      </div>
    </UploadPaper>
  );
};
