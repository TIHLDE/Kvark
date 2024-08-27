import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Button } from "./button";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "lib/utils";


type ExpandableProps = {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    children: ReactNode;
    extra?: ReactNode;
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

const Expandable = ({
    title,
    description,
    icon,
    extra,
    children,
    className,
    open,
    onOpenChange,
}: ExpandableProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <Collapsible
            className={cn('w-full bg-white dark:bg-inherit border border-secondary rounded-md', className)}
            onOpenChange={onOpenChange || setExpanded}
            open={open || expanded}
        >
            <CollapsibleTrigger asChild>
                <Button
                    className={cn('whitespace-normal py-8 w-full rounded-t-md rounded-b-none bg-white dark:bg-inherit dark:hover:bg-secondary border-none flex justify-between items-center rounded-sm', expanded && 'rounded-b-none' )}
                    variant='outline'
                >
                    <div className='flex items-center space-x-2 md:space-x-4 w-full overflow-hidden'>
                        { icon }
                        <div className='text-start break-words'>
                            {typeof title === 'string'
                                ? <h1 className='text-sm md:text-base'>{ title }</h1>
                                : title
                            }
                            {typeof description === 'string'
                                ? <h1 className='text-xs md:text-sm'>{ description }</h1>
                                : description
                            }
                        </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                        { extra }
                        {expanded || open ? <ChevronDownIcon className='stroke-[1.5px]' /> : <ChevronRightIcon className='stroke-[1.5px]' />}
                    </div>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='border border-t-secondary border-b-0 border-x-0 [&>*]:p-2 md:[&>*]:p-4'>
                { children }
            </CollapsibleContent>
        </Collapsible>
    );
};


export default Expandable;
