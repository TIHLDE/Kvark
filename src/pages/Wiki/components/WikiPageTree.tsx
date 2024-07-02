import { Folder, Plus, Workflow } from 'lucide-react';

import { WikiTree } from 'types';

import { useWikiTree } from 'hooks/Wiki';

import Expandable from 'components/ui/expandable';
import { Tree, TreeDataItem } from 'components/ui/tree';

type WikiPageTreeProps = {
  setSelectedNode: (newNode: string) => void;
  selectedNode: string;
};

const WikiPageTree = ({ setSelectedNode, selectedNode }: WikiPageTreeProps) => {
  const { data, error, isLoading } = useWikiTree();

  const createNodes = (node: WikiTree, parentPath: string): TreeDataItem => {
    const id = `${parentPath}${node.slug}${node.slug === '' ? '' : '/'}`;

    return {
      id,
      title: node.title,
      children: node.children.map((childNode: WikiTree) => createNodes(childNode, id)),
    };
  };

  const cleansePath = (path: string) => {
    const index = path.indexOf('/');
    const cleanedPath = path.substring(index + 1);
    return cleanedPath;
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
      <div className='space-y-4'>
        <h1>
          Valgt side: <span className='font-bold'>{selectedNode}</span>
        </h1>
        <Tree
          className='flex-shrink-0 w-full h-[260px]'
          data={[createNodes(data, '')]}
          folderIcon={Folder}
          itemIcon={Workflow}
          onSelectChange={(item) => setSelectedNode(cleansePath(item?.id || ''))}
        />
      </div>
    </Expandable>
  );
};

export default WikiPageTree;
