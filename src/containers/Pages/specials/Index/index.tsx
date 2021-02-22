import ErrorCard from 'containers/Pages/specials/Index/ErrorCard';
import WorkDoneCard from 'containers/Pages/specials/Index/WorkDoneCard';
import MembersCard from 'containers/Pages/specials/Index/MembersCard';

const AboutIndex = () => {
  // TODO:
  // Get this information from API
  const members = [
    'Eirik Steira',
    'Olaf Rosendahl',
    'Zaim Imran',
    'Mads Lundegaard',
    'Svein Jakob Høie',
    'Omer Jonuzi',
    'Tobias Rødahl Thingnes',
    'Max Torre Schau',
    'Hermann Owren Elton',
    'Henriette Brekke Sunde',
    'Minh Dan Nguyen',
    'Norbert Gørke',
  ];
  return (
    <>
      <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Kvark/dev/CHANGELOG.md'} title={'Hva har vi gjort i frontend?'} />
      <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Lepton/dev/CHANGELOG.md'} title={'Hva har vi gjort i backend?'} />
      <ErrorCard />
      <MembersCard members={members} />
    </>
  );
};

export default AboutIndex;
