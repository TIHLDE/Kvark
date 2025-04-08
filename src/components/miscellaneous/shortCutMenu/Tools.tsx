import type { ShortCutMenuProps } from '.';
import ShortCutLink from './Item';
import ShortCutSectionWrapper from './SectionWrapper';

const ShortCutTools = ({ setOpen }: Pick<ShortCutMenuProps, 'setOpen'>) => {
  const links = [
    {
      title: 'Link-forkorter',
      path: '/linker',
    },
    {
      title: 'QR-kode generator',
      path: '/qr-koder',
    },
  ];

  return (
    <ShortCutSectionWrapper title='Verktøy'>
      {links.map((link, index) => (
        <ShortCutLink key={index} setOpen={setOpen} {...link} />
      ))}
    </ShortCutSectionWrapper>
  );
};

export default ShortCutTools;
