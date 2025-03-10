import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'UI/Input',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input className="w-[300px]" placeholder="Enter your name" />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-[300px] gap-1.5">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => <Input className="w-[300px]" disabled placeholder="Disabled input" />,
};

export const WithDefaultValue: Story = {
  render: () => <Input className="w-[300px]" defaultValue="Default value" />,
};

export const File: Story = {
  render: () => <Input className="w-[300px]" type="file" />,
};

export const TypeExamples: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="text">Text</Label>
        <Input id="text" placeholder="Text input" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Email input" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Password input" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="Number input" />
      </div>
    </div>
  ),
}; 