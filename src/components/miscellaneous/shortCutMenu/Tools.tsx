import { ShortCutMenuProps } from '.';
import ShortCutLink from './Item';
import ShortCutSectionWrapper from './SectionWrapper';
import ShortCutAddFine from './tools/Fine';

const ShortCutTools = ({ setOpen, setTab }: ShortCutMenuProps) => {
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
      <ShortCutAddFine setTab={setTab} />
      {links.map((link, index) => (
        <ShortCutLink key={index} setOpen={setOpen} {...link} />
      ))}
    </ShortCutSectionWrapper>
  );
};

export default ShortCutTools;
