import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import Navigation from './Navigation';

const meta: Meta<typeof Navigation> = {
  component: Navigation,
  title: 'Navigation/Navigation',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {},
  render: () => (
    <Navigation>
      <div className='container mx-auto py-12'>
        <h1 className='text-2xl font-bold mb-4'>Page Content</h1>
        <p>This is the main content of the page that would appear inside the Navigation component.</p>
        <div className='h-[500px]'></div>
        <p>More content at the bottom of the page to demonstrate scrolling.</p>
      </div>
    </Navigation>
  ),
};
