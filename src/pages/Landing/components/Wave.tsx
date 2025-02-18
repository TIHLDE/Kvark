import WaveBottom from '~/assets/img/waves/wave-bottom.svg';
import WaveMid from '~/assets/img/waves/wave-mid.svg';
import WaveTop from '~/assets/img/waves/wave-top.svg';
import TihldeLogo from '~/components/miscellaneous/TihldeLogo';
import { Button } from '~/components/ui/button';
import { useIsAuthenticated } from '~/hooks/User';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';
import { isAfterDateOfYear, isBeforeDateOfYear } from '~/utils';
import { LogIn, Plus, User } from 'lucide-react';
import { Link } from 'react-router';

const Wave = () => {
  const { event } = useAnalytics();
  const isAuthenticated = useIsAuthenticated();

  const analytics = (page: string) => event('go-to-page', 'wave', `Go to ${page}`);

  return (
    <div className='w-full h-[600px]'>
      <div className='overflow-hidden absolute w-full h-[600px] bg-gradient-to-tr from-indigo-200 to-white dark:from-indigo-900 dark:to-background'>
        <div className='max-w-[920px] relative z-20 pt-[150px] px-[15px] pb-[100px] m-auto'>
          <TihldeLogo className='w-[70vw] max-w-[450px] min-w-[250px] max-h-[90px] text-primary' size='large' />
          <h1 className='text-center md:text-lg py-2'>
            Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Digital transformasjon og
            Informasjonsbehandling ved NTNU
          </h1>
          <div className='flex items-center space-x-4 justify-center mt-4'>
            {isAuthenticated ? (
              <Button asChild className='text-black dark:text-white' onClick={() => analytics('profile')} variant='outline'>
                <Link to={URLS.profile}>
                  <User className='mr-2 w-5 h-5 stroke-[1.5px]' />
                  Min profil
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild className='text-black dark:text-white' onClick={() => analytics('profile')} variant='outline'>
                  <Link to={URLS.profile}>
                    <LogIn className='mr-2 w-5 h-5 stroke-[1.5px]' />
                    Logg inn
                  </Link>
                </Button>
                <Button asChild className='text-black dark:text-white' onClick={() => analytics('profile')} variant='ghost'>
                  <Link to={URLS.signup}>
                    <Plus className='mr-2 w-5 h-5 stroke-[1.5px]' />
                    Opprett bruker
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
        {/* Show snow if between November 15th and February 1st */}
        {(isAfterDateOfYear(10, 15) || isBeforeDateOfYear(1, 1)) && (
          <>
            <div className='rain rain--far' />
            <div className='rain rain--mid' />
            <div className='rain rain--near' />
          </>
        )}

        <div className='absolute left-0 right-0 bottom-0 w-full overflow-hidden h-[130px] z-[15]'>
          <div className='absolute left-0 bottom-0 w-[200%] h-full fill-[#f2f2f2] dark:fill-[#071a2d] animate-wave-top z-10 opacity-50 origin-bottom'>
            <img className='absolute w-full h-[200px]' src={WaveTop} />
            <img className='absolute w-full h-[200px]' src={WaveTop} />
          </div>
          <div className='absolute left-0 bottom-0 w-[200%] h-full fill-[#f2f2f2] dark:fill-[#071a2d] animate-wave-middle z-5 opacity-60 origin-bottom-left'>
            <img className='absolute w-full h-[200px]' src={WaveMid} />
            <img className='absolute w-full h-[200px]' src={WaveMid} />
          </div>
          <div className='absolute left-0 bottom-0 w-[280%] h-full fill-[#f2f2f2] dark:fill-[#071a2d] animate-wave-bottom z-1 opacity-70 origin-bottom-right'>
            <img className='absolute w-full h-[200px]' src={WaveBottom} />
            <img className='absolute w-full h-[200px]' src={WaveBottom} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wave;
