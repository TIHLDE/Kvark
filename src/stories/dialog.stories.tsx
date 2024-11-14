import { Meta, StoryObj } from '@storybook/react';

import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Base: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Endre profil</DialogTitle>
          <DialogDescription>Teksty tekst</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='text-right' htmlFor='name'>
              Name
            </Label>
            <Input className='col-span-3' id='name' value='Pedro Duarte' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='text-right' htmlFor='username'>
              Username
            </Label>
            <Input className='col-span-3' id='username' value='@peduarte' />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  args: {},
};
