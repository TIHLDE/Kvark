import NewsIcon from '@mui/icons-material/DescriptionRounded';
import GroupsIcon from '@mui/icons-material/GroupRounded';
import InfoIcon from '@mui/icons-material/InfoRounded';
import UsersIcon from '@mui/icons-material/PermIdentityRounded';
import EventIcon from '@mui/icons-material/TodayRounded';
import JobPostIcon from '@mui/icons-material/WorkOutlineRounded';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { ChevronRightIcon } from 'lucide-react';
import { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';

import { Card, CardContent } from 'components/ui/card';

const Admin = () => {
  type CardProps = {
    apps: PermissionApp[];
    to: string;
    primary: string;
    secondary: string;
    icon: ComponentType;
  };

  const AdminCard = ({ apps, icon: Icon, to, primary, secondary }: CardProps) => (
    <HavePermission apps={apps}>
      <Card className='hover:bg-secondary'>
        <CardContent className='p-0'>
          <Link className='flex items-center justify-between p-2 w-full' to={to}>
            <div className='flex items-center space-x-4'>
              <Icon />
              <div>
                <h1>{primary}</h1>
                <h1 className='text-sm'>{secondary}</h1>
              </div>
            </div>
            <ChevronRightIcon className='stroke-[1.5px]' />
          </Link>
        </CardContent>
      </Card>
    </HavePermission>
  );

  const cards: Array<CardProps> = [
    {
      apps: [PermissionApp.EVENT],
      icon: EventIcon,
      to: URLS.eventAdmin,
      primary: 'Arrangementer',
      secondary: 'Opprett, endre og slett arrangementer',
    },
    {
      apps: [PermissionApp.GROUP],
      icon: GroupsIcon,
      to: URLS.groups.index,
      primary: 'Grupper',
      secondary: 'Se og endre grupper',
    },
    {
      apps: [PermissionApp.JOBPOST],
      icon: JobPostIcon,
      to: URLS.jobpostsAdmin,
      primary: 'Jobbannonser',
      secondary: 'Opprett, endre og slett jobbannonser',
    },
    {
      apps: [PermissionApp.USER],
      icon: UsersIcon,
      to: URLS.userAdmin,
      primary: 'Medlemmer',
      secondary: 'Aktiver, rediger og søk etter medlemmer',
    },
    {
      apps: [PermissionApp.NEWS],
      icon: NewsIcon,
      to: URLS.newsAdmin,
      primary: 'Nyheter',
      secondary: 'Opprett, endre og slett nyheter',
    },
    {
      apps: [PermissionApp.STRIKE],
      icon: WorkspacesIcon,
      to: URLS.strikeAdmin,
      primary: 'Prikker',
      secondary: 'Se og slett prikker',
    },
    {
      apps: [PermissionApp.BANNERS],
      icon: InfoIcon,
      to: URLS.bannerAdmin,
      primary: 'Bannere',
      secondary: 'Opprett, endre og slett bannere',
    },
  ];

  return (
    <ul className='space-y-2'>
      {cards.map((card, i) => (
        <AdminCard key={i} {...card} />
      ))}
      {/* <Paper className={classes.list}>
        <Typography variant='h3'>Filopplastning</Typography>
        <Typography variant='subtitle2'>
          Last opp filer og få en link du kan dele med andre. Bruk <Link to={URLS.shortLinks}>link-forkorteren</Link> hvis du vil ha enda kortere linker.
        </Typography>
        <FileUpload />
      </Paper> */}
    </ul>
  );
};

export default Admin;
