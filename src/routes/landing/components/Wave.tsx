import { Link } from '@tanstack/react-router';
import TihldeLogo from '~/components/miscellaneous/TihldeLogo';
import { Button } from '~/components/ui/button';
import { useOptionalAuth } from '~/hooks/auth';
import { useAnalytics } from '~/hooks/Utils';
import { LogIn, Plus, User } from 'lucide-react';

const Wave = () => {
  const { event } = useAnalytics();
  const { auth } = useOptionalAuth();
  const isAuthenticated = auth != null;

  const analytics = (page: string) => event('go-to-page', 'wave', `Go to ${page}`);

  return (
    <div className='w-full h-150'>
      <div className='overflow-hidden absolute w-full h-150'>
        <div className='max-w-200 relative z-20 pt-[150px] px-[15px] pb-[100px] m-auto'>
          <TihldeLogo className='w-[70vw] max-w-[450px] min-w-[250px] max-h-[90px] text-primary' size='large' />
          <h1 className='text-center md:text-lg py-2'>
            Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Digital transformasjon og
            Informasjonsbehandling ved NTNU
          </h1>
          <div className='flex items-center space-x-4 justify-center mt-4'>
            {isAuthenticated ? (
              <Button asChild className='text-black dark:text-white' onClick={() => analytics('profile')} variant='outline'>
                <Link to='/profil/{-$userId}'>
                  <User className='mr-2 w-5 h-5 stroke-[1.5px]' />
                  Min profil
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild className='text-black dark:text-white' onClick={() => analytics('profile')} variant='outline'>
                  <Link to='/profil/{-$userId}'>
                    <LogIn className='mr-2 w-5 h-5 stroke-[1.5px]' />
                    Logg inn
                  </Link>
                </Button>
                <Button asChild className='text-black dark:text-white' onClick={() => analytics('profile')} variant='ghost'>
                  <Link to='/ny-bruker'>
                    <Plus className='mr-2 w-5 h-5 stroke-[1.5px]' />
                    Opprett bruker
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wave;
