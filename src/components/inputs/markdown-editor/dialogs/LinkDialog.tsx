import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useEffect, useState } from 'react';

export type LinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialUrl?: string;
  hasSelection: boolean;
  onSubmit: (args: { url: string; text?: string }) => void;
  onUnset?: () => void;
};

export default function LinkDialog({ open, onOpenChange, initialUrl, hasSelection, onSubmit, onUnset }: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      setUrl(initialUrl ?? '');
      setText('');
    }
  }, [open, initialUrl]);

  const submit = () => {
    const trimmed = url.trim();
    if (trimmed === '' && initialUrl) {
      onUnset?.();
      onOpenChange(false);
      return;
    }
    if (trimmed === '') return;
    onSubmit({ url: trimmed, text: hasSelection ? undefined : text.trim() || undefined });
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      description='Lim inn URL og legg eventuelt til hvilken tekst som skal vises for lenken.'
      onOpenChange={onOpenChange}
      open={open}
      title={initialUrl ? 'Rediger lenke' : 'Sett inn lenke'}
      trigger={<span style={{ display: 'none' }} />}>
      <form
        className='space-y-3'
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}>
        <div className='space-y-1'>
          <Label htmlFor='link-url'>URL</Label>
          <Input autoFocus id='link-url' onChange={(e) => setUrl(e.target.value)} placeholder='https://...' type='url' value={url} />
        </div>
        {!hasSelection && (
          <div className='space-y-1'>
            <Label htmlFor='link-text'>Visningstekst (valgfritt)</Label>
            <Input id='link-text' onChange={(e) => setText(e.target.value)} placeholder='F.eks. TIHLDE-nettsiden' value={text} />
            <p className='text-xs text-muted-foreground'>La stå tom for å bruke selve URL-en som tekst.</p>
          </div>
        )}
        <div className='flex justify-between gap-2'>
          <div>
            {initialUrl && onUnset && (
              <Button
                onClick={() => {
                  onUnset();
                  onOpenChange(false);
                }}
                type='button'
                variant='ghost'>
                Fjern lenke
              </Button>
            )}
          </div>
          <div className='flex gap-2'>
            <Button onClick={() => onOpenChange(false)} type='button' variant='ghost'>
              Avbryt
            </Button>
            <Button disabled={url.trim() === ''} type='submit'>
              {initialUrl ? 'Oppdater' : 'Sett inn'}
            </Button>
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
