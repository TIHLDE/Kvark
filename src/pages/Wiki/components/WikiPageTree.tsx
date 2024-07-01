import { ChevronDown, ChevronRight, Folder, Layout, Plus, Workflow } from 'lucide-react';
import { useEffect, useState } from 'react';

import { WikiPage, WikiTree } from 'types';

import { useWikiTree } from 'hooks/Wiki';

import Expandable from 'components/ui/expandable';
import { Tree } from 'components/ui/tree';

type WikiPageTreeProps = {
  selectedNode: string;
  setSelectedNode: (newNode: string) => void;
  page: WikiPage;
};

const data = [
  { id: '1', name: 'Unread' },
  { id: '2', name: 'Threads' },
  {
    id: '3',
    name: 'Chat Rooms',
    children: [
      { id: 'c1', name: 'General' },
      { id: 'c2', name: 'Random' },
      { id: 'c3', name: 'Open Source Projects' },
    ],
  },
  {
    id: '4',
    name: 'Direct Messages',
    children: [
      {
        id: 'd1',
        name: 'Alice',
        children: [
          { id: 'd11', name: 'Alice2', icon: Layout },
          { id: 'd12', name: 'Bob2' },
          { id: 'd13', name: 'Charlie2' },
        ],
      },
      { id: 'd2', name: 'Bob', icon: Layout },
      { id: 'd3', name: 'Charlie' },
    ],
  },
  {
    id: '5',
    name: 'Direct Messages',
    children: [
      {
        id: 'e1',
        name: 'Alice',
        children: [
          { id: 'e11', name: 'Alice2' },
          { id: 'e12', name: 'Bob2' },
          { id: 'e13', name: 'Charlie2' },
        ],
      },
      { id: 'e2', name: 'Bob' },
      { id: 'e3', name: 'Charlie' },
    ],
  },
  {
    id: '6',
    name: 'Direct Messages',
    children: [
      {
        id: 'f1',
        name: 'Alice',
        children: [
          { id: 'f11', name: 'Alice2' },
          { id: 'f12', name: 'Bob2' },
          { id: 'f13', name: 'Charlie2' },
        ],
      },
      { id: 'f2', name: 'Bob' },
      { id: 'f3', name: 'Charlie' },
    ],
  },
];

const WikiPageTree = ({ selectedNode, setSelectedNode, page }: WikiPageTreeProps) => {
  const { data, error, isLoading } = useWikiTree();
  const [viewTree, setViewTree] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>('Admin Page');

  const renderTree = (node: WikiTree, parentPath: string) => {
    const id = `${parentPath}${node.slug}${node.slug === '' ? '' : '/'}`;
    if (id === page.path) {
      return null;
    }

    if (node.children.length <= 0) {
      return <div>{node.title}</div>;
    }

    return (
      <div className='space-y-2'>
        <div className='flex justify-between items-center hover:bg-muted p-2 cursor-pointer rounded-sm' onClick={() => setIsOpen(!isOpen)}>
          <h1>{node.title}</h1>

          {!isOpen ? <ChevronRight /> : <ChevronDown />}
        </div>

        {isOpen && <div className='pl-4'>{node.children.map((childNode) => renderTree(childNode, id))}</div>}
      </div>
    );
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return <h1 className='text-center'>{error.detail}</h1>;
  }

  if (!data) {
    return null;
  }

  return (
    <Expandable description='Trykk på mappen du vil flytte denne siden til' icon={<Plus />} title='Flytt siden'>
      {/* <div>
                {renderTree({ ...data, slug: '' }, '')}
            </div> */}
      <Tree
        className='flex-shrink-0 w-full h-[260px]'
        data={[data]}
        folderIcon={Folder}
        itemIcon={Workflow}
        onSelectChange={(item) => setContent(item?.title ?? '')}
      />
    </Expandable>
  );
};

export default WikiPageTree;
