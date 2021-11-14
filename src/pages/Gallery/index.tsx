import { useState, useMemo } from 'react';
import * as React from 'react';

// Components
import { ImageList, ImageListItem, Theme, useMediaQuery, Drawer, Button, List, Box, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Http404 from 'pages/Http404';
// Hooks
import { useGoogleAnalytics } from 'hooks/Utils';
import { useAlbumPictures, useAlbums, useAlbumsById } from 'hooks/Gallery';
// Styles
import { makeStyles } from '@mui/styles';
// Types
import { Gallery, Picture } from 'types';
// Icons
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';

export type GalleryPicturesProps = {
  gallery: Gallery;
};

export type GalleryProps = {
  gallery: Gallery;
};

const GalleryPictures = ({ gallery }: GalleryPicturesProps) => {
  const { event } = useGoogleAnalytics();
  const { data } = useAlbumPictures(gallery.slug);
  const pictures = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <ImageList cols={3} gap={8} variant='masonry'>
      {pictures.map((item) => (
        <ImageListItem key={item.id}>
          <img alt={item?.image_alt} loading='lazy' src={item.image} srcSet={item.image}></img>
        </ImageListItem>
      ))}
    </ImageList>
  );
};

const GalleryPicturesLoading = () => (
  <ImageList cols={3} gap={8} variant='masonry'>
    <ImageListItem key={''}>
      <img loading='lazy' src={`?w=248&fit=crop&auto=format`} srcSet={`?w=248&fit=crop&auto=format&dpr=2 2x`} />
    </ImageListItem>
  </ImageList>
);

const GalleryRenderer = ({ gallery }: GalleryProps) => {
  const [openPicture, setOpenPicture] = useState(null);
  const { event } = useGoogleAnalytics();
  const { data, isLoading, isError } = useAlbumsById(gallery.slug);
  const classes = useStyles();
  const getTotalPictures = (items: Picture[]) => items.reduce((ack: number) => ack + 1, 0);

  return (
    <>
      {isLoading && <GalleryPicturesLoading />}
      {isError && <Http404 />}
      <GalleryPictures gallery={gallery} />
    </>
  );
};

const Galleries = () => {
  const { data, isLoading, isError } = useAlbums();
  const albums = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const { event } = useGoogleAnalytics();
  type Anchor = 'left';
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <>
      <Box onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)} role='presentation' sx={{ width: 250 }}>
        <List>
          {albums?.map((item) => (
            <ListItem button key={item.slug}>
              <ListItemIcon>
                <PhotoLibraryRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} sx={{ mt: 30 }}>
            Vis meny
          </Button>
          <Drawer anchor={anchor} onClose={toggleDrawer(anchor, false)} open={state[anchor]}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Galleries;
