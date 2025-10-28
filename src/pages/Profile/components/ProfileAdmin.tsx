import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '~/components/ui/card';
import { HavePermission } from '~/hooks/User';
import { PermissionApp } from '~/types/Enums';
import URLS from '~/URLS';
import { Boxes, BriefcaseBusiness, Calendar, ChevronRightIcon, Grip, Info, LucideIcon, Newspaper, Plus, Users } from 'lucide-react';

const Admin = () => {
  type CardProps = {
    apps: PermissionApp[];
    to: string;
    primary: string;
    secondary: string;
    icon: LucideIcon;
  };

  const AdminCard = ({ apps, icon: Icon, to, primary, secondary }: CardProps) => (
    <HavePermission apps={apps}>
      <Card className='hover:bg-secondary'>
        <CardContent className='p-0'>
          <Link className='flex items-center justify-between p-2 w-full' to={to}>
            <div className='flex items-center space-x-4'>
              <Icon className='w-5 h-5 stroke-[1.5px]' />
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
      icon: Calendar,
      to: URLS.eventAdmin,
      primary: 'Arrangementer',
      secondary: 'Opprett, endre og slett arrangementer',
    },
    {
      apps: [PermissionApp.GROUP],
      icon: Boxes,
      to: URLS.groups.index,
      primary: 'Grupper',
      secondary: 'Se og endre grupper',
    },
    {
      apps: [PermissionApp.JOBPOST],
      icon: BriefcaseBusiness,
      to: URLS.jobpostsAdmin,
      primary: 'Jobbannonser',
      secondary: 'Opprett, endre og slett jobbannonser',
    },
    {
      apps: [PermissionApp.USER],
      icon: Users,
      to: URLS.userAdmin,
      primary: 'Medlemmer',
      secondary: 'Aktiver, rediger og søk etter medlemmer',
    },
    {
      apps: [PermissionApp.NEWS],
      icon: Newspaper,
      to: URLS.newsAdmin,
      primary: 'Nyheter',
      secondary: 'Opprett, endre og slett nyheter',
    },
    {
      apps: [PermissionApp.STRIKE],
      icon: Grip,
      to: URLS.strikeAdmin,
      primary: 'Prikker',
      secondary: 'Se og slett prikker',
    },
    {
      apps: [PermissionApp.BANNERS],
      icon: Info,
      to: URLS.bannerAdmin,
      primary: 'Bannere',
      secondary: 'Opprett, endre og slett bannere',
    },
    {
      apps: [PermissionApp.GROUP],
      icon: Plus,
      to: URLS.newGroupAdmin,
      primary: 'Ny gruppe',
      secondary: 'Legg til en ny gruppe',
    },
    {
      apps: [PermissionApp.OPPTAK],
      icon: Plus,
      to: URLS.opptakAdmin,
      primary: 'Opptak',
      secondary: 'Legg til en ny gruppe',
    },
  ];

  return (
    <ul className='space-y-2'>
      {cards.map((card) => (
        <AdminCard key={card.to} {...card} />
      ))}
    </ul>
  );
};

export default Admin;
