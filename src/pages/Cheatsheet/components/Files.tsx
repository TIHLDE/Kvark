import GitHub from '~/assets/icons/github.svg';
import { PaginateButton } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import useMediaQuery, { MEDIUM_SCREEN } from '~/hooks/MediaQuery';
import type { Cheatsheet } from '~/types';
import { CheatsheetType } from '~/types/Enums';
import { ExternalLink, File, Link, ShieldCheck } from 'lucide-react';
import { Fragment } from 'react';

export type FilesProps = {
  files: Array<Cheatsheet>;
  hasNextPage: boolean | undefined;
  getNextPage: () => void;
  isLoading: boolean;
};

const Files = ({ files, hasNextPage, getNextPage, isLoading }: FilesProps) => {
  const isDesktop = useMediaQuery(MEDIUM_SCREEN);

  const Icon = ({ cheatsheet }: { cheatsheet: Cheatsheet }) => {
    if (cheatsheet.type === CheatsheetType.FILE) {
      return <File />;
    } else if (cheatsheet.type === CheatsheetType.GITHUB) {
      return <img src={GitHub} />;
    } else if (cheatsheet.type === CheatsheetType.LINK) {
      return <Link />;
    } else {
      return <ExternalLink />;
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className='text-start w-full'>Tittel:</h1>
        {isDesktop && <h1 className='text-start w-full'>Av:</h1>}
        <h1 className='text-start w-full'>Fag:</h1>
      </div>

      <Separator className='my-2' />

      {!files.length && <h1 className='text-center pt-4'>Fant ingen oppskrifter</h1>}

      {files.length > 0 && (
        <div className='space-y-2'>
          {files.map((file, index) => (
            <Fragment key={index}>
              <a
                className='flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-black dark:text-white'
                href={file.url}
                rel='noopener noreferrer'
                target='_blank'
              >
                <div className='flex items-center space-x-2 justify-start w-full'>
                  <Icon cheatsheet={file} />
                  <p>{file.title}</p>
                </div>

                {isDesktop && (
                  <div className='flex items-center space-x-2 justify-start w-full'>
                    <h1>{file.creator}</h1>
                    {file.official && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <ShieldCheck />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Laget av NTNU</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}

                <div className='flex items-center space-x-2 justify-start w-full'>
                  <h1>{file.course}</h1>
                  {file.official && isDesktop && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <ShieldCheck />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Laget av NTNU</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </a>
              {index !== files.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
      )}

      {hasNextPage && <PaginateButton className='mt-2 w-full' isLoading={isLoading} nextPage={getNextPage} />}
    </div>
  );
};

export default Files;
