import ErrorCard from 'containers/Pages/specials/Index/ErrorCard';
import WorkDoneCard from 'containers/Pages/specials/Index/WorkDoneCard';
import MembersCard from 'containers/Pages/specials/Index/MembersCard';
import { Groups } from 'types/Enums';

const AboutIndex = () => {
  return (
    <>
      <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md'} title={'Hva har vi gjort i frontend?'} />
      <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md'} title={'Hva har vi gjort i backend?'} />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
