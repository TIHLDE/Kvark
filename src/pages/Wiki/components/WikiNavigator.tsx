import { Folder, List, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '~/components/ui/drawer';
import { Tree, type TreeDataItem } from '~/components/ui/tree';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import { useWikiTree } from '~/hooks/Wiki';
import type { WikiTree } from '~/types';

const TreeView = () => {
  const { data } = useWikiTree();
  const navigate = useNavigate();
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

  if (!data) {
    return null;
  }
  return (
    <Tree
      className='h-[300px]'
      data={[createNodes(data, '')]}
      folderIcon={Folder}
      itemIcon={Workflow}
      onSelectChange={(item) => navigate(`/wiki-old/${cleansePath(item?.id || '')}`)}
    />
  );
};

const WikiNavigator = () => {
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  if (!isDesktop) {
    return (
      <Drawer>
        <DrawerTrigger asChild className='fixed bottom-20 right-4 rounded-full z-20'>
          <Button size='icon'>
            <List className='w-5 h-5' />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <TreeView />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className='border rounded-md bg-card p-4'>
      <TreeView />
    </div>
  );
};

export default WikiNavigator;
