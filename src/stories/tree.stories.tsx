import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Alert } from 'components/ui/alert';

const meta = {
  title: 'Components/Tree*',
  component: Alert,
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
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};
