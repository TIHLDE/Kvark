import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import ShortCutNavigation, { ShortCutExternalNavigation } from './Navigation';

const meta: Meta<typeof ShortCutNavigation> = {
  component: ShortCutNavigation,
  title: 'Miscellaneous/ShortCutMenu/Navigation',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className='p-4 border rounded'>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ShortCutNavigation>;

export const InternalNavigation: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(true);
    return <ShortCutNavigation setOpen={setOpen} />;
  },
};

export const ExternalNavigation: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(true);
    return <ShortCutExternalNavigation setOpen={setOpen} />;
  },
};
