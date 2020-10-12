import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

// External Components
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
  },
});
export type ClickableImageProps = {
  className: string;
  image: string;
  alt: string;
};

function ClickableImage({ className, image, alt }: ClickableImageProps) {
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const toogleOpen = () => {
    setOpen(!open);
  };
  return (
    <Fragment>
      <img alt={alt} className={classNames(classes.root, className)} onClick={toogleOpen} src={image} />
      {open && <Lightbox mainSrc={image} onCloseRequest={() => setOpen(false)} />}
    </Fragment>
  );
}

export default ClickableImage;
