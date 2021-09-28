import ErrorCard from 'pages/Pages/specials/Index/ErrorCard';
import {ChangelogCard, GetReleaseAsStringArray, GetReleaseTitle} from 'pages/Pages/specials/Index/ChangelogCard';
import MembersCard from 'pages/Pages/specials/Index/MembersCard';
import { Groups } from 'types/Enums';
import Expand from 'components/layout/Expand';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import { useEffect, useState } from 'react';

const frontendURL = 'https://raw.githubusercontent.com/tihlde/Kvark/master/CHANGELOG.md';
const backendURL = 'https://raw.githubusercontent.com/tihlde/Lepton/master/CHANGELOG.md';

const AboutIndex = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    GetReleaseAsStringArray(frontendURL).then((logs) => setLogs(logs));
  }, []);

  return (
    <>
      <ChangelogCard changelogURL={frontendURL} title='Hva har vi gjort i frontend?' />
      <Expand header={logs[5]}>
        <p></p>
      </Expand>
      <ChangelogCard changelogURL={backendURL} title='Hva har vi gjort i backend?' />
      <ErrorCard />
      <MembersCard slug={Groups.INDEX} />
    </>
  );
};

export default AboutIndex;
