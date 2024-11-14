import { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from 'components/ui/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Base: Story = {
  render: (args) => (
    <div className='items-top flex space-x-2'>
      <Checkbox {...args} id='terms1' />
      <div className='grid gap-1.5 leading-none'>
        <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='terms1'>
          Accept terms and conditions
        </label>
        <p className='text-sm text-slate-500 dark:text-slate-400'>You agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  ),
  args: {},
};
export const Disabled: Story = {
  render: (args) => (
    <div className='flex items-center space-x-2'>
      <Checkbox {...args} id='terms2' />
      <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='terms2'>
        Accept terms and conditions
      </label>
    </div>
  ),
  args: {
    disabled: true,
  },
};
