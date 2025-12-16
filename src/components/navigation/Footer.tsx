import { Link } from '@tanstack/react-router';
import NITO from '~/assets/img/nito.svg';
import { Separator } from '~/components/ui/separator';
import { useAnalytics } from '~/hooks/Utils';
import URLS from '~/URLS';

import { DiscordIcon, FacebookIcon, InstagramIcon, NotionIcon } from '../icons';
import { ExternalLink } from '../ui/external-link';

const mediaList = [
  { Icon: FacebookIcon, link: 'https://www.facebook.com/tihlde/' },
  { Icon: InstagramIcon, link: 'https://www.instagram.com/tihlde/' },
  { Icon: NotionIcon, link: 'https://www.notion.so/tihlde/invite/442710f897b596ecd4f8e078cb25fcf76045125a' },
  { Icon: DiscordIcon, link: 'https://discord.gg/HNt5XQdyxy' },
];

const attributes = [
  { key: 'e-post', value: 'hs@tihlde.org' },
  { key: 'lokasjon', value: 'c/o IDI NTNU' },
  { key: 'organisasjonsnummer', value: '989 684 183' },
];

const Footer = () => {
  const { event } = useAnalytics();

  const someAnalytics = (some: string) => event('open', 'social-media', `Click on: ${some}`);

  return (
    <div className='pt-6 pb-32 md:py-20 px-12 md:px-40 bg-white dark:bg-transparent text-black dark:text-white border-t space-y-12'>
      <div className='flex flex-col space-y-12 lg:space-y-0 lg:flex-row md:justify-between'>
        <div className='order-last lg:order-first space-y-4 lg:w-[250px]'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-semibold text-center'>Kontakt</h1>
          </div>
          {attributes.map((attribute, index) => (
            <div className='text-center' key={index}>
              <h1 className='font-semibold uppercase'>{attribute.key}</h1>
              <h1>{attribute.value}</h1>
            </div>
          ))}
          <h1 className='text-center'>
            <ExternalLink href={URLS.external.wiki.CONTACT_US}>Kontakt oss</ExternalLink>
          </h1>
        </div>

        <div className='space-y-12 lg:max-w-sm w-full'>
          <div className='space-y-4'>
            <a className='mx-auto flex justify-center' href='https://www.dnv.no/' rel='noopener noreferrer' target='_blank'>
              <div className='dark:bg-white p-2 w-fit rounded-md'>
                <img
                  alt='Sponsor'
                  className='w-60 md:w-72 mx-auto'
                  loading='lazy'
                  src='https://cdn.onedesign.dnv.com/onedesigncdn/3.7.0/images/DNV_logo_RGB.svg'
                />
              </div>
            </a>
            <h1 className='mt-5 text-lg text-center'>Hovedsamarbeidspartner</h1>
          </div>

          <div className='space-y-4'>
            <Separator className='bg-black dark:bg-white' />
            <div className='grid grid-cols-2 place-items-center gap-y-6 lg:flex lg:items-center'>
              {mediaList.map((media, index) => (
                <a className='mx-8' href={media.link} key={index} onClick={() => someAnalytics(media.link)} rel='noopener noreferrer' target='_blank'>
                  <media.Icon className='size-8 dark:fill-white' />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='lg:w-[250px] pb-12 lg:pb-0'>
          <div className='space-y-1 mb-4'>
            <h1 className='text-3xl font-semibold text-center'>Samarbeid</h1>
          </div>
          <a href='https://www.nito.no/' rel='noopener noreferrer' target='_blank'>
            <img alt='NITO' className='w-28 md:w-28 mx-auto mt-4' loading='lazy' src={NITO} width={250} />
          </a>
        </div>
      </div>

      <div>
        <h1 className='text-center'>
          Feil på siden?{' '}
          <Link className='text-blue-500' to='/tilbakemelding'>
            Rapporter til Index
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Footer;
