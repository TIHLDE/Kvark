import { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';

import { Button } from 'components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Base: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className='w-10 rounded-full p-0' variant='outline'>
          <Plus className='h-4 w-4' />
          <span className='sr-only'>Legg til</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Legg til i bibliotek</p>
      </TooltipContent>
    </Tooltip>
  ),
  args: {},
};
