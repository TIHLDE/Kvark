import { CloudUploadIcon, FilePlus } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import API from 'api/api';

import { useAnalytics } from 'hooks/Utils';

import { blobToFile, getCroppedImgAsBlob, readFile } from 'components/inputs/ImageUploadUtils';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Label } from 'components/ui/label';

type FormImageMultipleUploadProps = {
  fileTypes: DropzoneOptions['accept'];
  setFiles: Dispatch<SetStateAction<File[]>>;
  label?: string;
};

// File multiple upload
export const FileMultipleUpload = ({ fileTypes, setFiles, label = 'Velg eller dra filer hit' }: FormImageMultipleUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...Array.from(acceptedFiles)]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: fileTypes });

  return (
    <div {...getRootProps()} className='flex items-center justify-center w-full'>
      <label
        className='cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-background md:hover:bg-secondary md:dark:hover:border-gray-600'
        htmlFor='image-upload-button'>
        <div className='flex flex-col items-center justify-center pt-5 pb-6 space-y-4'>
          <CloudUploadIcon className='w-10 h-10 text-gray-400 dark:text-gray-300 stroke-[1.5]' />
          <p className='mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold'>{label}</p>
        </div>
        <input hidden />
        <input {...getInputProps()} hidden id='file-multiple-upload-button' />
      </label>
    </div>
  );
};

type FormImageUploadProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  ratio?: `${number}:${number}`;
};

// Image upload for react-hook-form
export const FormImageUpload = <TFormValues extends FieldValues>({ form, name, label = 'Velg bilde', ratio }: FormImageUploadProps<TFormValues>) => {
  const url = form.watch(name);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { event } = useAnalytics();

  const ratioFloat = ratio
    ?.split(':')
    .map(Number)
    .reduce((previousValue, currentValue) => previousValue / currentValue);

  const closeDialog = () => {
    setDialogOpen(false);
    setImgSrc('');
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    setImageFile(undefined);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setImageFile(file);
        if (ratio) {
          const imageDataUrl = await readFile(file);
          setImgSrc(imageDataUrl);
          setDialogOpen(true);
        } else {
          uploadFile(file);
        }
      }
    } catch (e) {
      toast.error(e.detail);
    }
  };

  const dialogConfirmCrop = async () => {
    try {
      setIsLoading(true);
      const file = await getCroppedImgAsBlob(imgSrc, croppedAreaPixels, imageFile?.type);
      await uploadFile(file);
      toast.success('Bilde lastet opp');
    } catch (e) {
      toast.error(e.detail);
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      form.setValue(name, data.url);
      toast.success('Bilde ble lastet opp');
    } catch (e) {
      toast.error(e.detail);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImg = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    form.setValue(name, '');
  };

  const UploadButton = () => {
    return (
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
          <input disabled={isLoading} hidden {...form.register} />
          <input accept='image/*' disabled={isLoading} hidden id='image-upload-button' onChange={onSelect} type='file' />
        </label>
      </div>
    );
  };

  const ImgDisplay = () => {
    return (
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label>Valgt bilde</Label>

          <Button disabled={isLoading} onClick={removeImg} size='sm' type='button' variant='destructive'>
            Fjern bilde
          </Button>
        </div>
        <div className='p-2 rounded-md border'>
          <img className='max-h-[200px] rounded-md' loading='lazy' src={url as string} />
        </div>
      </div>
    );
  };

  return (
    <>
      {url ? <ImgDisplay /> : <UploadButton />}

      <Dialog onOpenChange={closeDialog} open={dialogOpen}>
        <DialogContent className='max-w-3xl w-full'>
          <DialogHeader>
            <DialogTitle>Tilpass bildet</DialogTitle>
            <DialogDescription>Anbefalt størrelsesforhold: {ratio}</DialogDescription>
          </DialogHeader>
          <div className='relative h-[400px] max-h-[80vh] w-full'>
            <Cropper aspect={ratioFloat} crop={crop} image={imgSrc} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} zoom={zoom} />
          </div>
          <DialogFooter>
            <Button disabled={isLoading} onClick={dialogConfirmCrop} type='button'>
              {isLoading ? 'Laster opp...' : 'Ferdig'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

type FormFileUploadProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  accept?: string;
};

export const FormFileUpload = <TFormValues extends FieldValues>({ form, name, label, accept }: FormFileUploadProps<TFormValues>) => {
  const url = form.watch(name);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const removeFile = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    form.setValue(name, '');
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const data = await API.uploadFile(file);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        form.setValue(name, data.url);
        toast.success('Filen ble opplastet');
      } catch (e) {
        toast.error(e.detail || 'Det oppstod en feil');
      }
      setIsLoading(false);
    }
  };

  const FileDisplay = () => {
    return (
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label>Valgt fil</Label>

          <Button disabled={isLoading} onClick={removeFile} size='sm' type='button' variant='destructive'>
            Fjern fil
          </Button>
        </div>
        <div className='p-2 rounded-md border'>
          <p>{url}</p>
        </div>
      </div>
    );
  };

  const UploadButton = () => {
    return (
      <div className='flex items-center justify-center w-full'>
        <label
          className={
            isLoading
              ? 'cursor-default'
              : 'cursor-pointer' +
                ` flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-background md:hover:bg-secondary md:dark:hover:border-gray-600`
          }
          htmlFor='file-upload-button'>
          <div className='flex flex-col items-center justify-center pt-5 pb-6 space-y-4'>
            <FilePlus className='w-10 h-10 text-gray-400 dark:text-gray-300 stroke-[1.5]' />
            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold'>{label}</p>
          </div>
          <input disabled={isLoading} hidden {...form.register} />
          <input accept={accept} disabled={isLoading} hidden id='file-upload-button' onChange={upload} type='file' />
        </label>
      </div>
    );
  };

  if (url) {
    return <FileDisplay />;
  }

  return <UploadButton />;
};
