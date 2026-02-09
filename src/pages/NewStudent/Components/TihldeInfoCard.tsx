import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ExternalLink } from '~/components/ui/external-link';
import { ArrowUpRightFromSquare, Users } from 'lucide-react';

const TihldeInfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary'>
            <Users className='w-5 h-5' />
          </div>
          <CardTitle>Hva er egentlig TIHLDE?</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-muted-foreground leading-relaxed'>TIHLDE er Trondheim Ingeniørhøgskoles Linjeforening for Dannede EDBere.</p>
        <p className='text-muted-foreground leading-relaxed'>
          Vi er en linjeforening som jobber for å gi alle våre EDBere en bedre studieopplevelse, og verdsetter god stemning minst like mye som gode karakterer!
        </p>
        <Button asChild variant='outline'>
          <ExternalLink href='https://wiki.tihlde.org/ny-student' openNewTab>
            Besøk TIHLDEs wiki
            <ArrowUpRightFromSquare className='ml-2 w-4 h-4 stroke-[1.5px]' />
          </ExternalLink>
        </Button>
      </CardContent>
    </Card>
  );
};

export default TihldeInfoCard;
