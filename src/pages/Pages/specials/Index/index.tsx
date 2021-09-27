import ErrorCard from 'pages/Pages/specials/Index/ErrorCard';
import Changelog from 'pages/Pages/specials/Index/Changelog';
import MembersCard from 'pages/Pages/specials/Index/MembersCard';
import { Groups } from 'types/Enums';

import Container from 'components/layout/Container';

const AboutIndex = () => {
  return (
    <>
      <Container>
        <ul style={{listStyle: 'none'}}>
          <li>✨ - Ny funksjonalitet</li>
          <li>⚡ - Forbedret funksjonalitet</li>
          <li>🦟 - Fikset en bug</li>
          <li>🎨 - Designendringer</li>
        </ul>
      </Container>
      <Changelog changelogURL='https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md' title='Hva har vi gjort i frontend?' />
      <Changelog changelogURL='https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md' title='Hva har vi gjort i backend?' />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
