import { ReactNode, useState } from 'react';
import { Collapsible, CollapsibleContent } from 'components/ui/collapsible';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

type MenuItemProps = {
  title: string;
  children?: ReactNode;
};

const ShortCutSectionWrapper = ({ title, children }: MenuItemProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Collapsible className='w-full' open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger
        asChild
      >
        <div className='w-full hover:bg-secondary flex items-center justify-between p-2 rounded-md cursor-pointer text-muted-foreground'>
          <h1 className='text-sm'>
            { title }
          </h1>
          <div>
            {expanded ? <ChevronDownIcon className='stroke-[1.5px]' /> : <ChevronRightIcon className='stroke-[1.5px]' />}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='space-y-1 px-4'>
          { children }
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ShortCutSectionWrapper;
