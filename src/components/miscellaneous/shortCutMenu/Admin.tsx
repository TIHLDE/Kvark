import URLS from '~/URLS';
import { HavePermission } from '~/hooks/User';
import { PermissionApp } from '~/types/Enums';

import type { ShortCutMenuProps } from '.';
import ShortCutLink from './Item';
import ShortCutSectionWrapper from './SectionWrapper';

const ShortCutAdmin = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const links = [
    {
      apps: [PermissionApp.EVENT],
      title: 'Arrangementer',
      path: URLS.eventAdmin,
    },
    {
      apps: [PermissionApp.GROUP],
      title: 'Grupper',
      path: URLS.groups.index,
    },
    {
      apps: [PermissionApp.JOBPOST],
      title: 'Jobbannonser',
      path: URLS.jobpostsAdmin,
    },
    {
      apps: [PermissionApp.USER],
      title: 'Medlemmer',
      path: URLS.userAdmin,
    },
    {
      apps: [PermissionApp.NEWS],
      title: 'Nyheter',
      path: URLS.newsAdmin,
    },
    {
      apps: [PermissionApp.STRIKE],
      title: 'Prikker',
      path: URLS.strikeAdmin,
    },
    {
      apps: [PermissionApp.BANNERS],
      title: 'Bannere',
      path: URLS.bannerAdmin,
    },
  ];

  return (
    <ShortCutSectionWrapper title='Admin'>
      {links.map((link, index) => (
        <HavePermission apps={link.apps} key={index}>
          <ShortCutLink setOpen={setOpen} {...link} />
        </HavePermission>
      ))}
    </ShortCutSectionWrapper>
  );
};

export default ShortCutAdmin;
