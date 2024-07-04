import ChangelogCard from 'pages/Wiki/specials/Index/ChangelogCard';
import ErrorCard from 'pages/Wiki/specials/Index/ErrorCard';

import InfoCard from 'components/layout/InfoCard';

const FRONTEND_URL = 'https://raw.githubusercontent.com/TIHLDE/Kvark/master/CHANGELOG.md';
const BACKEND_URL = 'https://raw.githubusercontent.com/TIHLDE/Lepton/master/CHANGELOG.md';

const AboutIndex = () => (
  <>
    <InfoCard header='Tegnforklaring'>
      <div>
        <p>✨ Ny funksjonalitet</p>
        <p>⚡ Forbedret funksjonalitet</p>
        <p>🦟 Fikset en bug</p>
        <p>🎨 Designendringer</p>
      </div>
    </InfoCard>
    <ChangelogCard changelogURL={FRONTEND_URL} title='Hva har vi gjort i frontend?' />
    <ChangelogCard changelogURL={BACKEND_URL} title='Hva har vi gjort i backend?' />
    <ErrorCard />
  </>
);

export default AboutIndex;
