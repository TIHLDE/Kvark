import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta = {
  component: Separator,
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {};

export const Primary: Story = {
  args: {
    primary: true,
  },
};
