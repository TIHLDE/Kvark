import { PlusCircle } from "lucide-react";
import { ShortCutMenuProps } from "..";


const ShortCutAddFine = ({ setTab }: Pick<ShortCutMenuProps, 'setTab'>) => {
    return (
        <div 
            className='flex items-center text-sm p-2 rounded-md hover:bg-secondary cursor-pointer'
            onClick={() => setTab('Fine')}
        >
            <PlusCircle className='mr-2 w-4 h-4 stroke-[1.5px]' />
            <h1>
                Opprett bot
            </h1>
        </div>
    );
};


export default ShortCutAddFine;