import { FileMultipleUpload } from '~/components/inputs/Upload';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useUploadPictures } from '~/hooks/Gallery';
import type { Gallery } from '~/types';
import { UploadCloud, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export type PictureUploadProps = {
  id: Gallery['id'];
};

const PictureUpload = ({ id }: PictureUploadProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const upload = useUploadPictures(id);
  const [files, setFiles] = useState<File[]>([]);

  const submit = () => {
    if (upload.isPending || !files) {
      return;
    }
    upload.mutate(
      { files },
      {
        onSuccess: (data) => {
          toast.success(data.detail);
          setOpen(false);
          setFiles([]);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  };

  const PictureView = () => (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      {files.map((file, index) => (
        <div className='relative' key={index}>
          <Button className='absolute top-2 right-2' onClick={() => setFiles(files.filter((_, i) => i !== index))} size='icon' variant='ghost'>
            <X className='w-5 h-5 stroke-[1.5px]' />
          </Button>
          <img alt={file.name} className='h-32 w-full object-cover rounded-md' src={URL.createObjectURL(file)} />
        </div>
      ))}
    </div>
  );

  const OpenButton = (
    <Button variant='outline'>
      <UploadCloud className='mr-2 w-5 h-5' />
      Last opp bilder
    </Button>
  );

  return (
    <ResponsiveDialog description='Last opp bilder til galleriet.' onOpenChange={setOpen} open={open} title='Last opp bilder' trigger={OpenButton}>
      <ScrollArea className='h-[60vh]'>
        <div className='space-y-4'>
          <FileMultipleUpload fileTypes={{ 'image/jpeg': ['.jpeg'], 'image/png': ['.png'] }} label='Last opp eller dra bilder hit' setFiles={setFiles} />

          <PictureView />

          <Button className='w-full' disabled={files.length < 1 || upload.isPending} onClick={submit}>
            {upload.isPending ? 'Laster opp...' : 'Last opp bilder'}
          </Button>
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default PictureUpload;
