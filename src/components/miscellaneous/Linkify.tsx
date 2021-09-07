import ReactLinkify, { Props } from 'react-linkify';
import { styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { isExternalURL } from 'utils';

const NativeLink = styled('a')({ color: 'inherit' });
const InternalLink = styled(Link)({ color: 'inherit' });

const Linkify = (props: Props) => (
  <ReactLinkify
    componentDecorator={(href, text) => (isExternalURL(href) ? <NativeLink href={href}>{text}</NativeLink> : <InternalLink to={href}>{text}</InternalLink>)}
    {...props}
  />
);

export default Linkify;
