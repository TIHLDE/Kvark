import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './sonner';
import { Button } from './button';
import { toast } from 'sonner';
import { ThemeProvider } from 'next-themes';

const meta: Meta<typeof Toaster> = {
  component: Toaster,
  title: 'UI/Sonner',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>
          <Story />
          <Toaster />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button onClick={() => toast('Event has been created')}>
        Show Toast
      </Button>
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 21st at 11:30 PM',
          })
        }
      >
        With Description
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 21st at 11:30 PM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        With Action
      </Button>
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast('This is a default toast')}>Default</Button>
      <Button onClick={() => toast.success('This is a success toast')}>
        Success
      </Button>
      <Button onClick={() => toast.error('This is an error toast')}>
        Error
      </Button>
      <Button onClick={() => toast.warning('This is a warning toast')}>
        Warning
      </Button>
      <Button onClick={() => toast.info('This is an info toast')}>
        Info
      </Button>
      <Button
        onClick={() =>
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: 'Loading...',
              success: 'Promise resolved!',
              error: 'Promise rejected!',
            }
          )
        }
      >
        Promise
      </Button>
    </div>
  ),
}; 