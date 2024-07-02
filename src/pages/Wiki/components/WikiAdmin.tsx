import { WikiPage } from 'types';
import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';

import CreateWikiPage from './CreateWikiPage';
import UpdateWikiPage from './UpdateWikiPage';

export type IPagesAdminProps = {
  page: WikiPage;
};

const WikiAdmin = ({ page }: IPagesAdminProps) => {
  return (
    <HavePermission apps={[PermissionApp.PAGE]}>
      <div className='w-full space-y-2 flex flex-col'>
        {page.path !== '' && <UpdateWikiPage page={page} />}
        <CreateWikiPage page={page} />
      </div>
    </HavePermission>
  );
};

export default WikiAdmin;
