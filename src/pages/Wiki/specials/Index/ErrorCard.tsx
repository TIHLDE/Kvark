import { Github, Mail, Slack } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const LINKS = [
  { link: 'https://tihlde.slack.com/archives/C01CJ0EQCFM', label: 'Kontakt oss på Slack', icon: Slack },
  { link: 'mailto:index@tihlde.org', label: 'Kontakt oss med epost', icon: Mail },
  { link: 'https://github.com/TIHLDE/Kvark/issues/new/choose', label: 'Lag et issue i Github', icon: Github },
];

const ErrorCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feil på siden?</CardTitle>
      </CardHeader>
      <CardContent>
        {LINKS.map((link, index) => (
          <div className='flex items-center space-x-2' key={index}>
            <link.icon className='w-5 h-5' />
            <a className='underline' href={link.link} rel='noopener noreferrer' target='_blank'>
              {link.label}
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ErrorCard;
