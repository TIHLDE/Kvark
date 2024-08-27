import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { useAnalytics } from 'hooks/Utils';

import { Separator } from 'components/ui/separator';

import DISCORD from 'assets/icons/discord.svg';
import FACEBOOK from 'assets/icons/facebook.svg';
import INSTAGRAM from 'assets/icons/instagram.svg';
import SLACK from 'assets/icons/slack.svg';
import SNAPCHAT from 'assets/icons/snapchat.svg';
import TWITTER from 'assets/icons/twitter.svg';
import VERCEL from 'assets/icons/vercel.svg';
import MAINSPONSOR from 'assets/img/mainSponsor.svg';
import NITO from 'assets/img/nito.png';

const Footer = () => {
  const { event } = useAnalytics();

  const mediaList = [
    { img: FACEBOOK, link: 'https://www.facebook.com/tihlde/' },
    { img: INSTAGRAM, link: 'https://www.instagram.com/tihlde/' },
    { img: TWITTER, link: 'https://twitter.com/tihlde' },
    { img: SNAPCHAT, link: 'https://www.snapchat.com/add/tihldesnap' },
    { img: SLACK, link: 'https://tihlde.slack.com' },
    { img: DISCORD, link: 'https://discord.gg/SZR9vTS' },
  ];

  const attributes = [
    { key: 'e-post', value: 'hs@tihlde.org' },
    { key: 'lokasjon', value: 'c/o IDI NTNU' },
    { key: 'organisasjonsnummer', value: '989 684 183' },
  ];

  const someAnalytics = (some: string) => event('open', 'social-media', `Click on: ${some}`);

  return (
    <div className='pt-6 pb-32 md:py-20 px-12 md:px-40 bg-[#011830] text-white border-t space-y-12'>
      <div className='flex flex-col space-y-12 lg:space-y-0 lg:flex-row md:justify-between'>
        <div className='order-last lg:order-first space-y-4 lg:w-[250px]'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-semibold text-center'>Kontakt</h1>
            <Separator className='bg-white' />
          </div>
          {attributes.map((attribute, index) => (
            <div className='text-center' key={index}>
              <h1 className='font-semibold uppercase'>{attribute.key}</h1>
              <h1>{attribute.value}</h1>
            </div>
          ))}
          <h1 className='text-center'>
            <Link className='' to={URLS.contactInfo}>
              Kontakt oss
            </Link>
          </h1>
        </div>

        <div className='space-y-12 lg:max-w-sm w-full'>
          <div className='space-y-4'>
            <a className='mx-auto' href='https://www.lysekonsern.no/' rel='noopener noreferrer' target='_blank'>
              <img alt='Sponsor' className='w-60 md:w-72 mx-auto' loading='lazy' src={MAINSPONSOR} />
            </a>
            <h1 className='text-sm text-center'>Hovedsamarbeidspartner</h1>
          </div>

          <div className='space-y-4'>
            <Separator className='bg-white' />
            <div className='grid grid-cols-3 gap-y-6 lg:flex lg:items-center lg:space-x-8'>
              {mediaList.map((media, index) => (
                <a className='mx-auto' href={media.link} key={index} onClick={() => someAnalytics(media.link)} rel='noopener noreferrer' target='_blank'>
                  <img alt='SoMe' className='w-8' loading='lazy' src={media.img} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='lg:w-[250px] pb-12 lg:pb-0'>
          <div className='space-y-1 mb-4'>
            <h1 className='text-3xl font-semibold text-center'>Samarbeid</h1>
            <Separator className='bg-white' />
          </div>
          <a href='https://vercel.com/?utm_source=kvark&utm_campaign=oss' rel='noopener noreferrer' target='_blank'>
            <img alt='Vercel' className='mx-auto' loading='lazy' src={VERCEL} width={150} />
          </a>
          <a href='https://www.nito.no/' rel='noopener noreferrer' target='_blank'>
            <img alt='NITO' className='w-20 md:w-28 mx-auto mt-4' loading='lazy' src={NITO} width={150} />
          </a>
        </div>
      </div>

      <div>
        <h1 className='text-center'>
          Feil på siden? <Link to={URLS.aboutIndex}>Rapporter til Index</Link>
        </h1>
      </div>
    </div>
  );
};

export default Footer;
