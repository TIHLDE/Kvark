import { styled } from '@mui/material';

import ChangelogCard from 'pages/Wiki/specials/Index/ChangelogCard';
import ErrorCard from 'pages/Wiki/specials/Index/ErrorCard';

import InfoCard from 'components/layout/InfoCard';

const List = styled('ul')({
  listStyleType: 'none',
  margin: 0,
});

const FRONTEND_URL = 'https://raw.githubusercontent.com/TIHLDE/Kvark/master/CHANGELOG.md';
const BACKEND_URL = 'https://raw.githubusercontent.com/TIHLDE/Lepton/master/CHANGELOG.md';

const AboutIndex = () => (
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
  </>
);

export default AboutIndex;
