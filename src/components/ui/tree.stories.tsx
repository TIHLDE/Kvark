import type { Meta, StoryObj } from '@storybook/react';
import { File, Folder, Package, Code, User, Settings } from 'lucide-react';
import { Tree } from './tree';

const meta: Meta<typeof Tree> = {
  component: Tree,
  title: 'UI/Tree',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

const fileSystemData = [
  {
    id: 'root',
    title: 'Project Root',
    icon: Package,
    children: [
      {
        id: 'src',
        title: 'src',
        icon: Folder,
        children: [
          {
            id: 'components',
            title: 'components',
            icon: Folder,
            children: [
              { id: 'button.tsx', title: 'button.tsx', icon: File },
              { id: 'card.tsx', title: 'card.tsx', icon: File },
              { id: 'input.tsx', title: 'input.tsx', icon: File },
            ],
          },
          {
            id: 'pages',
            title: 'pages',
            icon: Folder,
            children: [
              { id: 'index.tsx', title: 'index.tsx', icon: File },
              { id: 'about.tsx', title: 'about.tsx', icon: File },
            ],
          },
          { id: 'utils.ts', title: 'utils.ts', icon: File },
        ],
      },
      {
        id: 'public',
        title: 'public',
        icon: Folder,
        children: [
          { id: 'favicon.ico', title: 'favicon.ico', icon: File },
          { id: 'logo.svg', title: 'logo.svg', icon: File },
        ],
      },
      { id: 'package.json', title: 'package.json', icon: File },
      { id: 'tsconfig.json', title: 'tsconfig.json', icon: File },
    ],
  },
];

const menuData = [
  {
    id: 'general',
    title: 'General',
    icon: Settings,
    children: [
      { id: 'profile', title: 'Profile', icon: User },
      { id: 'security', title: 'Security' },
      { id: 'notifications', title: 'Notifications' },
    ],
  },
  {
    id: 'developer',
    title: 'Developer',
    icon: Code,
    children: [
      { id: 'api-keys', title: 'API Keys' },
      { id: 'webhooks', title: 'Webhooks' },
    ],
  },
];

export const FileSystem: Story = {
  args: {
    data: fileSystemData,
    initialSlelectedItemId: 'button.tsx',
    folderIcon: Folder,
    itemIcon: File,
  },
  render: (args) => (
    <div className="border rounded-md w-[300px] h-[400px]">
      <Tree {...args} />
    </div>
  ),
};

export const Menu: Story = {
  args: {
    data: menuData,
    initialSlelectedItemId: 'profile',
  },
  render: (args) => (
    <div className="border rounded-md w-[250px] h-[300px]">
      <Tree {...args} />
    </div>
  ),
};

export const ExpandAll: Story = {
  args: {
    data: fileSystemData,
    expandAll: true,
    folderIcon: Folder,
    itemIcon: File,
  },
  render: (args) => (
    <div className="border rounded-md w-[300px] h-[500px]">
      <Tree {...args} />
    </div>
  ),
}; 