import ErrorCard from 'pages/Pages/specials/Index/ErrorCard';
import ChangelogCard from 'pages/Pages/specials/Index/ChangelogCard';
import MembersCard from 'pages/Pages/specials/Index/MembersCard';
import { Groups } from 'types/Enums';

const FRONTEND_URL = 'https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md';
const BACKEND_URL = 'https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md';

const AboutIndex = () => {
  return (
    <>
      <ChangelogCard changelogURL={FRONTEND_URL} title='Hva har vi gjort i frontend?' />
      <ChangelogCard changelogURL={BACKEND_URL} title='Hva har vi gjort i backend?' />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
