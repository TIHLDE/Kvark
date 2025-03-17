import type { ShortCutMenuProps } from '.';
import HotKey from './HotKey';
import ShortCutLink from './Item';
import ShortCutSectionWrapper from './SectionWrapper';

const ShortCutNavigation = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const links = [
    {
      title: 'Hjem',
      path: '/',
    },
    {
      title: 'Profil',
      path: '/profil',
    },
    {
      title: 'Arrangementer',
      path: '/arrangementer',
    },
    {
      title: 'Nyheter',
      path: '/nyheter',
    },
    {
      title: 'Stillingsannonser',
      path: '/stillingsannonser',
    },
    {
      title: 'Wiki',
      path: 'https://wiki.tihlde.org/',
    },
    {
      title: 'Grupper',
      path: '/grupper',
    },
    {
      title: 'Galleri',
      path: '/galleri',
    },
  ];

  return (
    <ShortCutSectionWrapper title='Navigering'>
      {links.map((link, index) => (
        <ShortCutLink key={index} setOpen={setOpen} {...link} />
      ))}
    </ShortCutSectionWrapper>
  );
};

export const ShortCutExternalNavigation = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const links = [
    {
      title: 'GitHub',
      path: 'https://github.com/TIHLDE',
    },
    {
      title: 'Fondet',
      path: 'https://fondet.tihlde.org/',
      hotKey: <HotKey letter='f' modifiers={['shift', 'ctrl']} />,
    },
    {
      title: 'Kontres',
      path: 'https://kontres.tihlde.org/',
      hotKey: <HotKey letter='q' modifiers={['shift', 'ctrl']} />,
    },
    {
      title: 'Pythons Herrer',
      path: 'https://pythons.tihlde.org/',
      hotKey: <HotKey letter='p' modifiers={['shift', 'ctrl']} />,
    },
    {
      title: 'Pythons Damer',
      path: 'https://pythons-damer.tihlde.org/',
      hotKey: <HotKey letter='g' modifiers={['shift', 'ctrl']} />,
    },
  ];

  return (
    <ShortCutSectionWrapper title='Eksterne lenker'>
      {links.map((link, index) => (
        <ShortCutLink key={index} setOpen={setOpen} {...link} external />
      ))}
    </ShortCutSectionWrapper>
  );
};

export default ShortCutNavigation;
