import { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as React from 'react';

// Material UI Components
import { ImageList, ImageListItem, Theme, useMediaQuery, Drawer, Button, List, Box, ListItem, ListItemIcon, ListItemText } from '@mui/material';

// Components
import Http404 from 'pages/Http404';
import { ImageUpload } from 'components/inputs/Upload';

// Hooks
import { useGoogleAnalytics } from 'hooks/Utils';
import { useSnackbar } from 'hooks/Snackbar';
import {
  useAlbumPictures,
  useAlbums,
  useAlbumsById,
  useCreateAlbum,
  useCreatePicture,
  useUpdateAlbum,
  useDeleteAlbum,
  useDeletePicture,
  useUpdatePicture,
} from 'hooks/Gallery';

// Styles
import { makeStyles } from '@mui/styles';

// Types
import { Gallery, Picture } from 'types';

// Icons
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';

const useStyles = makeStyles((theme) => ({
  image: {
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export type GalleryPicturesProps = {
  gallery: Gallery;
};

export type GalleryProps = {
  gallery: Gallery;
};

export type PictureEditorProps = {
  id: string | '';
  goToPicture: (newPicture: string) => void;
};

type FormValues = Omit<Picture, 'id' | 'created_at' | 'updated_at'>;

const PictureEditor = ({ id, goToPicture }: PictureEditorProps) => {
  const { event } = useGoogleAnalytics();
  const { data, isLoading, isError } = useAlbumPictures(id);
  const pictures = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const createPicture = useCreatePicture();
  const updatePicture = useUpdatePicture(id || '');
  const deletePicture = useDeletePicture(id || '');
  const showSnackbar = useSnackbar();

  const { handleSubmit, register, watch, control, formState, getValues, reset, setValue } = useForm<FormValues>();
  const submit: SubmitHandler<FormValues> = async (data) => {
    const picture = {
      ...data,
    } as Picture;
    if (id) {
      await updatePicture.mutate(picture, {
        onSuccess: () => {
          showSnackbar('Bildet ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    } else {
      await createPicture.mutate(picture, {
        onSuccess: (newPicture) => {
          showSnackbar('Bildet ble opprettet', 'success');
          goToPicture(newPicture.id);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)}>
      <ImageUpload formstate={formState} label='Velg bilde' register={register('image')} setValue={setValue} watch={watch} />
      <ImageList cols={3} gap={8} variant='masonry'>
        {pictures.map((item) => (
          <ImageListItem key={item.id}>
            <img alt={item?.image_alt} loading='lazy' src={item.image} srcSet={item.image}></img>
          </ImageListItem>
        ))}
      </ImageList>
    </form>
  );
};

const GalleryPicturesLoading = () => (
  <ImageList cols={3} gap={8} variant='masonry'>
    <ImageListItem key={''}>
      <img loading='lazy' src={''} srcSet={''} />
    </ImageListItem>
  </ImageList>
);

const CreateGallery = () => {};

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
