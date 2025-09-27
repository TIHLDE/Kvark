import API from '~/api/api';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { FileUp, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import { FieldBase, type InputBaseProps } from '.';
import { useFieldContext } from '../AppForm';

export type FileUploadFieldProps = InputBaseProps & {
  accept?: string;
};

export function FileUploadField(props: FileUploadFieldProps) {
  const field = useFieldContext<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const data = await API.uploadFile(file);
      field.handleChange(data.url);
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const clear = () => field.handleChange('');

  return (
    <FieldBase description={props.description} label={props.label} required={props.required}>
      <input accept={props.accept} className='hidden' onChange={onFileChange} ref={fileInputRef} type='file' />

      {!field.state.value ? (
        <div
          className={cn(
            'flex h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted',
            isLoading && 'cursor-default opacity-70',
          )}
          onClick={isLoading ? undefined : handleClick}>
          <div className='rounded-full bg-background p-3 shadow-sm'>
            <FileUp className='h-6 w-6 text-muted-foreground' />
          </div>
          <div className='text-center'>
            <p className='text-sm font-medium'>{isLoading ? 'Laster opp...' : 'Last opp fil'}</p>
            <p className='text-xs text-muted-foreground'>Dra filer her eller klikk for å laste opp</p>
          </div>
        </div>
      ) : (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>Valgt fil</Label>
            <div className='flex gap-2'>
              <Button className='h-9 w-9 p-0' onClick={handleClick} size='sm' type='button' variant='secondary'>
                <Upload className='h-4 w-4' />
              </Button>
              <Button className='h-9 w-9 p-0' onClick={clear} size='sm' type='button' variant='destructive'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='rounded-md border p-3 text-sm'>
            <a className='underline' href={field.state.value} rel='noreferrer' target='_blank'>
              {field.state.value}
            </a>
          </div>
        </div>
      )}
    </FieldBase>
  );
}
