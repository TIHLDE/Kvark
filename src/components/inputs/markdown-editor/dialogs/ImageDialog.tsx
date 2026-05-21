import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ImageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (args: { src: string; alt: string }) => void;
};

function isLikelyUrl(value: string): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ImageDialog({ open, onOpenChange, onSubmit }: ImageDialogProps) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => {
    if (open) {
      setSrc('');
      setAlt('');
      setPreviewFailed(false);
    }
  }, [open]);

  useEffect(() => {
    setPreviewFailed(false);
  }, [src]);

  const submit = () => {
    const s = src.trim();
    if (!s) return;
    onSubmit({ src: s, alt: alt.trim() });
    onOpenChange(false);
  };

  const showPreview = isLikelyUrl(src.trim());

  return (
    <ResponsiveDialog
      description='Lim inn URL til bildet og legg til alternativ tekst (anbefalt for tilgjengelighet).'
      onOpenChange={onOpenChange}
      open={open}
      title='Sett inn bilde'
      trigger={<span style={{ display: 'none' }} />}>
      <form
        className='space-y-3'
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}>
        <div className='space-y-1'>
          <Label htmlFor='img-src'>Bilde-URL</Label>
          <Input autoFocus id='img-src' onChange={(e) => setSrc(e.target.value)} placeholder='https://...' type='url' value={src} />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='img-alt'>Alternativ tekst</Label>
          <Input id='img-alt' onChange={(e) => setAlt(e.target.value)} placeholder='Beskriv bildet kort' value={alt} />
        </div>
        <div className='rounded-md border bg-muted/30 p-2'>
          <div className='mb-1 text-xs text-muted-foreground'>Forhåndsvisning</div>
          {showPreview && !previewFailed ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img alt={alt || 'Forhåndsvisning'} className='max-h-48 w-auto rounded-md object-contain' onError={() => setPreviewFailed(true)} src={src.trim()} />
          ) : (
            <div className='flex h-24 items-center justify-center gap-2 text-sm text-muted-foreground'>
              <ImageOff className='size-4' />
              {previewFailed ? 'Klarte ikke laste bildet' : 'Skriv inn en gyldig URL for å se forhåndsvisning'}
            </div>
          )}
        </div>
        <div className='flex justify-end gap-2'>
          <Button onClick={() => onOpenChange(false)} type='button' variant='ghost'>
            Avbryt
          </Button>
          <Button disabled={src.trim() === ''} type='submit'>
            Sett inn
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
