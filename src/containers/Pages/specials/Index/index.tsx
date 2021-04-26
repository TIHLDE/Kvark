import ErrorCard from 'containers/Pages/specials/Index/ErrorCard';
import WorkDoneCard from 'containers/Pages/specials/Index/WorkDoneCard';
import MembersCard from 'containers/Pages/specials/Index/MembersCard';
import { useMemberships } from 'api/hooks/Membership';

const AboutIndex = () => {
  const { data } = useMemberships('index');
  const members = data?.map((member) => `${member.user.first_name} ${member.user.last_name}`);
  return (
    <>
      <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Kvark/dev/CHANGELOG.md'} title={'Hva har vi gjort i frontend?'} />
      <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Lepton/dev/CHANGELOG.md'} title={'Hva har vi gjort i backend?'} />
      <ErrorCard />
      <MembersCard members={members || []} />
    </>
  );
};

export default AboutIndex;
