import { FunctionComponent, useState } from 'react';

import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import { ScrollArea } from 'components/ui/scroll-area';

export type RendererPreviewProps<Type> = {
  /** Function to be runned to get the data which can be passed to the renderer-component */
  getContent: () => Type | null;
  /** Component which renders a preview of the given content */
  renderer: FunctionComponent<{ preview: boolean; data: Type }>;
};

/**
 * Preview content. Generic which means that is supports all types as long as it has a component
 * which can be passed the data to preview through the `data`-prop and a `preview`-prop set to `true`.
 */
const RendererPreview = <Type extends unknown>({ getContent, renderer: Renderer }: RendererPreviewProps<Type>) => {
  const [content, setContent] = useState<Type | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    if (isOpen) {
      return setIsOpen(false);
    }

    setContent(getContent());
    setIsOpen(true);
  };

  return (
    <Dialog onOpenChange={handleClickOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className='block w-full md:w-40' type='button' variant='secondary'>
          Forhåndsvis
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-5xl w-full h-[75vh]'>
        <DialogHeader>
          <DialogTitle>Forhåndsvisning</DialogTitle>
        </DialogHeader>

        {!content && <h1 className='text-center'>Ingen innhold å forhåndsvise</h1>}

        {content && (
          <ScrollArea className='h-[60vh] w-full pr-4'>
            <Renderer data={content} preview />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RendererPreview;
