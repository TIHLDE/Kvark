import ErrorCard from 'pages/Pages/specials/Index/ErrorCard';
import Changelog from 'pages/Pages/specials/Index/Changelog';
import MembersCard from 'pages/Pages/specials/Index/MembersCard';
import { Groups } from 'types/Enums';
import InfoCard from 'components/layout/InfoCard';
import { styled } from '@mui/material';

const List = styled('ul')({
  listStyleType: 'none',
});

const AboutIndex = () => {
  return (
    <>
      <InfoCard header='Tegnforklaring'>
        <List>
          <li>✨ Ny funksjonalitet</li>
          <li>⚡ Forbedret funksjonalitet</li>
          <li>🦟 Fikset en bug</li>
          <li>🎨 Designendringer</li>
        </List>
      </InfoCard>
      <Changelog changelogURL='https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md' title='Hva har vi gjort i frontend?' />
      <Changelog changelogURL='https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md' title='Hva har vi gjort i backend?' />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
