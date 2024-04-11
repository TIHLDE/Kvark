import { ArrowBigUp, Command, Option } from 'lucide-react';
import { ReactNode } from 'react';

type HotKeyProps = {
  modifiers: Array<'shift' | 'alt' | 'ctrl' | undefined>;
  letter: string;
};

const HotKey = ({ modifiers, letter }: HotKeyProps) => {
  const getModifierKey = (modifier: 'shift' | 'alt' | 'ctrl' | undefined): ReactNode | undefined => {
    switch (modifier) {
      case 'shift':
        return <ArrowBigUp className='w-4 h-4 stroke-[1.5px]' />;
      case 'alt':
        return <Option className='w-4 h-4 stroke-[1.5px]' />;
      case 'ctrl':
        return <Command className='w-4 h-4 stroke-[1.5px]' />;
      default:
        return undefined;
    }
  };

  const getModifierKeys = (): ReactNode | undefined => {
    if (modifiers.length === 0) {
      return undefined;
    }
    return modifiers.map((modifier, index) => (
      <span className='mr-1 p-1 border border-primary/30 rounded-md' key={index}>
        {getModifierKey(modifier)}
      </span>
    ));
  };

  return (
    <div className='flex items-center'>
      {getModifierKeys()}
      <span className='font-medium p-1 px-2 text-xs border border-primary/30 rounded-md'>{letter.toUpperCase()}</span>
    </div>
  );
};

export default HotKey;
