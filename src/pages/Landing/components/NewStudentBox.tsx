import { Link } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';
import { SHOW_FADDERUKA_INFO, SHOW_NEW_STUDENT_INFO } from '~/constant';
import { useIsAuthenticated, useUser } from '~/hooks/User';
import { useAnalytics, usePersistedState } from '~/hooks/Utils';
import URLS from '~/URLS';
import { getYear } from 'date-fns';
import { ArrowRight, ArrowUpRightFromSquare } from 'lucide-react';
import { useMemo } from 'react';

const NewStudentBox = () => {
  const { event } = useAnalytics();
  const { data: user, isLoading } = useUser();
  const isAuthenticated = useIsAuthenticated();
  const [shouldShowBox, setShouldShowBox] = usePersistedState('ShowNewStudentBox', true, 1000 * 3600 * 24 * 60);
  const HEADER = {
    NEW_STUDENT: 'Nye studenter',
    OLD_STUDENT: 'Velkommen tilbake',
  };
  const TEXT = {
    NEW_STUDENT: `Hei, ${user?.first_name} 👋 Velkommen som ny student i TIHLDE! Vi gleder oss til å bli kjent med deg og håper at du vil være med på fadderuka og engasjere deg i linjeforeningen. Les alt på siden for nye studenter ⬇️`,
    OLD_STUDENT: `Hei, ${user?.first_name} 👋 Velkommen tilbake til et nytt semester! Håper du har hatt en strålende sommer og er gira på å komme i gang igjen. Husk at det er lurt å sjekke nettsiden jevnlig for nye kule arrangementer og stillingsannonser 😃`,
    NO_AUTH:
      'Velkommen til alle nye studenter i TIHLDE 👋 Vi gleder oss til å bli kjent med dere og håper at dere vil være med på fadderuka og engasjere dere i linjeforeningen. Les alt om fadderuka, verv og FAQ på siden for nye studenter ⬇️',
  };

  const [header, text] = useMemo(() => {
    if (isLoading && isAuthenticated) {
      return ['', ''];
    } else if (user) {
      if (user.studyyear.group?.name === `${getYear(new Date())}`) {
        return [HEADER.NEW_STUDENT, TEXT.NEW_STUDENT];
      } else {
        return [HEADER.OLD_STUDENT, TEXT.OLD_STUDENT];
      }
    } else {
      return [HEADER.NEW_STUDENT, TEXT.NO_AUTH];
    }
  }, [user, isAuthenticated]);

  if (SHOW_NEW_STUDENT_INFO || header === '' || !shouldShowBox || (isAuthenticated && SHOW_NEW_STUDENT_INFO && !SHOW_FADDERUKA_INFO)) {
    return null;
  }

  const hideBox = () => {
    setShouldShowBox(false);
    event('hide-box', 'new-student', 'Hide new student box on landing page');
  };
  const fadderukaSignupAnalytics = () => event('signup-fadderuka-from-box', 'new-student', 'Clicked on link to signup for fadderuka');

  return (
    <div className='p-4 rounded-md border max-w-2xl w-full mx-auto space-y-4 mt-8'>
      <h1 className='text-center text-3xl font-bold'>{header}</h1>
      <p className='text-center'>{text}</p>
      {header === HEADER.NEW_STUDENT && (
        <div className='space-y-2 md:space-y-0 md:flex md:items-center md:space-x-4 md:justify-center pt-4 pb-2'>
          <Button asChild className='w-full'>
            <Link to={URLS.newStudent}>
              Nye studenter
              <ArrowRight className='ml-2 w-5 h-5 stroke-[1.5px]' />
            </Link>
          </Button>
          {SHOW_FADDERUKA_INFO && (
            <Button asChild className='w-full' variant='outline'>
              <a href='https://forms.gle/oJa8sQrkQfGq6vcNA' onClick={fadderukaSignupAnalytics} rel='noopener noreferrer' target='_blank'>
                Meld deg på fadderuka
                <ArrowUpRightFromSquare className='ml-2 w-5 h-5 stroke-[1.5px]' />
              </a>
            </Button>
          )}
        </div>
      )}
      {isAuthenticated && (
        <Button className='w-full' onClick={hideBox} variant='outline'>
          Ikke vis igjen
        </Button>
      )}
    </div>
  );
};

export default NewStudentBox;
