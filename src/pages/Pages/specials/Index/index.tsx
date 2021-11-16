import ErrorCard from 'pages/Pages/specials/Index/ErrorCard';
import ChangelogCard from 'pages/Pages/specials/Index/ChangelogCard';
import MembersCard from 'pages/GroupAdmin/components/MembersCard';
import { Groups } from 'types/Enums';
import InfoCard from 'components/layout/InfoCard';
import { styled } from '@mui/material';

const List = styled('ul')({
  listStyleType: 'none',
  margin: 0,
});

const FRONTEND_URL = 'https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md';
const BACKEND_URL = 'https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md';

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
      <ChangelogCard changelogURL={FRONTEND_URL} title='Hva har vi gjort i frontend?' />
      <ChangelogCard changelogURL={BACKEND_URL} title='Hva har vi gjort i backend?' />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
