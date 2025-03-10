import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Sheet> = {
  component: Sheet,
  title: 'UI/Sheet',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Right Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate to different sections of the application.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button variant="ghost" className="justify-start">Home</Button>
          <Button variant="ghost" className="justify-start">Dashboard</Button>
          <Button variant="ghost" className="justify-start">Settings</Button>
          <Button variant="ghost" className="justify-start">Profile</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have 3 unread messages.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium">New message from John</h4>
            <p className="text-sm text-gray-500">Hi there! Just checking in...</p>
          </div>
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium">Project update</h4>
            <p className="text-sm text-gray-500">Your project has been updated.</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Meeting reminder</h4>
            <p className="text-sm text-gray-500">Team meeting at 3 PM today.</p>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Mark all as read</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Share document</SheetTitle>
          <SheetDescription>
            Invite a user to collaborate on this document.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" placeholder="example@company.com" />
          </div>
          <div>
            <Label>Permission level</Label>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1">View</Button>
              <Button variant="outline" className="flex-1">Comment</Button>
              <Button variant="outline" className="flex-1">Edit</Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Share</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}; 