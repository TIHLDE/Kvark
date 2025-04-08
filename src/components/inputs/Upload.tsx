import { useDropzone } from '@uploadthing/react';
import { CloudUploadIcon, FilePlus } from 'lucide-react';
import { ImagePlus, Trash2, Upload, X } from 'lucide-react';
import { type Dispatch, type SetStateAction, useCallback, useState } from 'react';
import { type ChangeEvent, useEffect, useMemo, useRef } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import API from '~/api/api';
import { blobToFile, getCroppedImgAsBlob, readFile } from '~/components/inputs/ImageUploadUtils';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useAnalytics } from '~/hooks/Utils';
import { cn } from '~/lib/utils';
import { uuidv4 } from '~/utils';

import { FormField } from '../ui/form';
import { FormInputBase } from './Input';

type FormImageMultipleUploadProps = {
  fileTypes: Record<string, string[]>;
  setFiles: Dispatch<SetStateAction<File[]>>;
  label?: string;
};

// File multiple upload
export const FileMultipleUpload = ({ fileTypes, setFiles, label = 'Velg eller dra filer hit' }: FormImageMultipleUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...Array.from(acceptedFiles)]);
    },
    [setFiles],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: fileTypes });

  return (
    <div {...getRootProps()} className='flex items-center justify-center w-full'>
      <label
        className='cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-background md:hover:bg-secondary md:dark:hover:border-gray-600'
        htmlFor='image-upload-button'
      >
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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
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

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
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
                'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-background md:hover:bg-secondary md:dark:hover:border-gray-600'
          }
          htmlFor='image-upload-button'
        >
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
          <img className='max-h-[200px] rounded-md' alt='current' loading='lazy' src={url as string} />
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
    // @ts-ignore
    form.setValue(name, '');
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const data = await API.uploadFile(file);

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
                ' flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-background md:hover:bg-secondary md:dark:hover:border-gray-600'
          }
          htmlFor='file-upload-button'
        >
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

const zodFile = z.instanceof(File).refine((f) => f instanceof File, { message: 'Invalid file' });

export const FileObjectSchema = z.object({
  id: z.string(),
  file: z.union([zodFile, z.string()]),
  name: z.string().nonempty(),
});

export type FileObject = z.infer<typeof FileObjectSchema>;

export function useImageUpload({ value }: { value?: FileObject[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileObject[]>([]);

  const prevValue = useRef<FileObject[] | undefined>(undefined);

  useEffect(() => {
    if (value && prevValue.current === undefined) {
      setFiles(value);
    }
  }, [value]);
  useEffect(() => {
    prevValue.current = value?.length ? value : undefined;
  }, [value]);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target?.files ?? []);
    if (files.length > 0) {
      const fileObjects = files.map((f) => ({
        id: uuidv4(),
        file: f,
        name: f.name,
      }));
      setFiles(fileObjects);
    }
  }, []);

  const handleRemove = useCallback((id?: string) => {
    if (id) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      setFiles([]);
    }
  }, []);

  return {
    files,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  };
}

type SupportedImageFormats = '.jpeg' | '.jpg' | 'png' | 'gif';
type AcceptImageFormats = SupportedImageFormats[] | 'image/*';

type ImageUploadProps = {
  title?: string;
  description?: string;
  multiple?: boolean;
  accept?: AcceptImageFormats;
  value?: FileObject[];
  onChange?: (files: FileObject[]) => void;
};

// TODO: Fix this component. Some times it doesnt change the files when clicked. Works alwats when dragging.
export function ImageUpload(props: ImageUploadProps) {
  const { files, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload({ value: props.value });

  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewFile = useMemo(() => {
    return files.find((f) => f.id === previewId);
  }, [files, previewId]);

  useEffect(() => {
    if (files.length > 0 && !previewFile) {
      setPreviewId(files[0].id);
    }
    if (!files.length) {
      setPreviewId(null);
    }
  }, [files, previewFile]);

  useEffect(() => {
    props.onChange?.(files);
  }, [files, props.onChange]);

  const accept = Array.isArray(props.accept) ? `image/${props.accept.map((v) => `.${v}`).join(', ')}` : (props.accept ?? 'image/*');

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileChange({
          target: {
            files,
          } as unknown as EventTarget & HTMLInputElement,
        } as unknown as ChangeEvent<HTMLInputElement>);
      }
    },
    [handleFileChange],
  );

  return (
    <div>
      <Input accept={accept} className='hidden' multiple={props.multiple} onChange={handleFileChange} ref={fileInputRef} type='file' />
      {!previewFile ? (
        // biome-ignore lint: Button with on click this is a file drop field
        <div
          className={cn(
            'flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted',
            isDragging && 'border-primary/50 bg-primary/5',
          )}
          onClick={handleThumbnailClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className='rounded-full bg-background p-3 shadow-sm'>
            <ImagePlus className='h-6 w-6 text-muted-foreground' />
          </div>
          <div className='text-center'>
            <p className='text-sm font-medium'>{props.title ?? `Last opp ${props.multiple ? 'bilde(r)' : 'et bilde'}`} </p>
            <p className='text-xs text-muted-foreground'>{props.description ?? 'Dra filer her eller klikk for å laste opp'}</p>
          </div>
        </div>
      ) : (
        <div className='relative'>
          <div className='group relative h-64 overflow-hidden rounded-lg border'>
            <FileImage
              alt='Preview'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              src={previewFile?.file}
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100' />
            <div className='absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
              <Button className='h-9 w-9 p-0' onClick={handleThumbnailClick} size='sm' variant='secondary'>
                <Upload className='h-4 w-4' />
              </Button>
              <Button className='h-9 p-0 flex items-center gap-2 px-2' onClick={() => handleRemove()} size='sm' variant='destructive'>
                <Trash2 className='h-4 w-4' /> {files.length > 1 && <span>{files.length}</span>}
              </Button>
            </div>
          </div>
          {files.map((file) => (
            <div className='mt-2 flex items-center gap-2 text-sm text-muted-foreground' key={file.id}>
              <div className='flex gap-2 items-center'>
                <Button
                  className='h-10 w-10 p-0 overflow-hidden'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPreviewId(file.id);
                  }}
                  variant='ghost'
                >
                  <FileImage alt={`preview-${file.id}`} className='h-full w-full' src={file.file} />
                </Button>
                <span className='truncate'>{file.name}</span>
              </div>
              <button className='ml-auto rounded-full p-1 hover:bg-muted' onClick={() => handleRemove(file.id)}>
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type NewFormImageUploadProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  title?: string;
  dropZoneDescription?: string;
  description?: string;
  multiple?: boolean;
  accept?: AcceptImageFormats;
  required?: boolean;
};
export function NewFormImageUpload<TFieldValues extends FieldValues>(props: NewFormImageUploadProps<TFieldValues>) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormInputBase description={props.description} label={props.label} required={props.required}>
          <ImageUpload
            accept={props.accept}
            description={props.dropZoneDescription}
            multiple={props.multiple}
            onChange={field.onChange}
            title={props.title}
            value={field.value}
          />
        </FormInputBase>
      )}
    />
  );
}

type FileImageProps = Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'> & {
  src?: File | string;
};

export function FileImage(props: FileImageProps) {
  const { src, ...imgProps } = props;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!src || typeof src === 'string') {
      return;
    }
    const url = URL.createObjectURL(src);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [src]);

  return <img {...imgProps} alt='upload preview' src={typeof src === 'string' ? src : (previewUrl ?? '')} />;
}

type FileImagePreviewProps = {
  file?: File | string;
  render: (url: string | undefined) => React.ReactNode;
};
export function FileImagePreview({ file, render }: FileImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!file || typeof file === 'string') {
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(undefined);
    };
  }, [file]);
  return render(previewUrl ?? (typeof file === 'string' ? file : undefined));
}
