import { styled } from '@mui/material';
import ReactLinkify, { Props } from 'react-linkify';
import { Link } from 'react-router-dom';
import { isExternalURL } from 'utils';

const NativeLink = styled('a')({ color: 'inherit' });
const InternalLink = styled(Link)({ color: 'inherit' });

const Linkify = (props: Props) => (
  <ReactLinkify
    componentDecorator={(href, text) => (isExternalURL(href) ? <a className='underline text-blue-500' href={href}>{text}</a> : <Link className='text-red-500' to={href}>{text}</Link>)}
    {...props}
  />
);

export default Linkify;
