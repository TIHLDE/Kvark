import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ScrollArea } from 'components/ui/scroll-area';
import { Separator } from 'components/ui/separator';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Base: Story = {
  render: (args) => (
    <ScrollArea className='h-72 w-48 rounded-md border border-slate-100 dark:border-slate-700'>
      <div className='p-4'>
        <h4 className='mb-4 text-sm font-medium leading-none'>Tags</h4>
      </div>
    </ScrollArea>
  ),
  args: {},
};
