import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Button } from "./button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "lib/utils";


type ExpandableProps = {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
    className?: string;
};

const Expandable = ({ title, description, icon, children, className }: ExpandableProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <Collapsible className={cn('w-full bg-white dark:bg-inherit border border-secondary rounded-md', className)} onOpenChange={setExpanded} open={expanded}>
            <CollapsibleTrigger asChild>
                <Button
                    className='whitespace-normal py-8 w-full rounded-t-md rounded-b-none bg-white dark:bg-inherit dark:hover:bg-secondary border-none flex justify-between items-center rounded-md'
                    variant='outline'
                >
                    <div className='flex items-center space-x-4'>
                        { icon }
                        <div className='text-start break-words'>
                            <h1>{ title }</h1>
                            <h1 className='text-sm'>{ description }</h1>
                        </div>
                    </div>
                    <div>
                        {expanded ? <ChevronDownIcon className='stroke-[1.5px]' /> : <ChevronRightIcon className='stroke-[1.5px]' />}
                    </div>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='border border-t-secondary border-b-0 border-x-0 p-4'>
                { children }
            </CollapsibleContent>
        </Collapsible>
    );
};


export default Expandable;