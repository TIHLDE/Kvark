import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Switch } from './switch';

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'UI/Label',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => <Label>Default Label</Label>,
};

export const ForInput: Story = {
  render: () => (
    <div className="grid w-[300px] gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

export const ForCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const ForSwitch: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
};

export const WithRequiredIndicator: Story = {
  render: () => (
    <div className="grid w-[300px] gap-1.5">
      <Label htmlFor="name">
        Name <span className="text-red-500">*</span>
      </Label>
      <Input id="name" placeholder="Enter your name" required />
    </div>
  ),
}; 