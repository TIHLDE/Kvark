import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Breadcrumb } from 'components/ui/breadcrumb';

const meta = {
  title: 'Components/Breadcrumb*',
  component: Breadcrumb,
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
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};
