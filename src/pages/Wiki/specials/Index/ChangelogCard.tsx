import { Code } from 'lucide-react';
import { useQuery } from 'react-query';

import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import Expandable from 'components/ui/expandable';

const LATEST_VERSION_INDEX = 3;
const MARKDOWN_HEADER_DELIMITER = /(?=\n##\s *)/g;

export type ChangelogCardProps = {
  changelogURL: string;
  title: string;
  className?: string;
};

const getReleaseAsStringArray = async (changelogURL: string) => {
  const res = await fetch(changelogURL);
  const text = await res.text();
  return text.split(MARKDOWN_HEADER_DELIMITER);
};

const paragraphToArray = (changelog: string) => changelog.split('\n').filter((text) => text.trim() !== '');

const getReleaseTitle = (changelog: string) => paragraphToArray(changelog)[0].substring(3);

const getReleaseBody = (changelog: string) => paragraphToArray(changelog).slice(1).join('\n');

const ChangelogCard = ({ title, changelogURL, className }: ChangelogCardProps) => {
  const { data = [] } = useQuery(['changelog', changelogURL], () => getReleaseAsStringArray(changelogURL));
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer className='mb-4' value={data[LATEST_VERSION_INDEX]} />
        <Expandable icon={<Code className='h-4 w-4 stroke-[1.5px]' />} title='Tidligere endringer'>
          {data.slice(LATEST_VERSION_INDEX + 1).map((field, i) => (
            <Expandable icon={<Code className='h-4 w-4 stroke-[1.5px]' />} key={i} title={getReleaseTitle(field)}>
              <MarkdownRenderer value={getReleaseBody(field)} />
            </Expandable>
          ))}
        </Expandable>
      </CardContent>
    </Card>
  );
};

export default ChangelogCard;
