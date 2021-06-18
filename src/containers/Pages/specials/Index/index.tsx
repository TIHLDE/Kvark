import ErrorCard from 'containers/Pages/specials/Index/ErrorCard';
import Changelog from 'containers/Pages/specials/Index/Changelog';
import MembersCard from 'containers/Pages/specials/Index/MembersCard';
import { Groups } from 'types/Enums';

const AboutIndex = () => {
  return (
    <>
      <Changelog changelogURL='https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md' title='Hva har vi gjort i frontend?' />
      <Changelog changelogURL='https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md' title='Hva har vi gjort i backend?' />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
