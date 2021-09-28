import ErrorCard from 'pages/Pages/specials/Index/ErrorCard';
import ChangelogCard from 'pages/Pages/specials/Index/ChangelogCard';
import MembersCard from 'pages/Pages/specials/Index/MembersCard';
import { Groups } from 'types/Enums';

const frontendURL = 'https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md';
const backendURL = 'https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md';

const AboutIndex = () => {
  return (
    <>
      <ChangelogCard changelogURL={frontendURL} title='Hva har vi gjort i frontend?' />
      <ChangelogCard changelogURL={backendURL} title='Hva har vi gjort i backend?' />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
