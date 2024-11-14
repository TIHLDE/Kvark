import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from 'components/ui/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
    },
  },

  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'click me!',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'click me!',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'click me!',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'click me!',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'click me!',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'click me!',
  },
};
