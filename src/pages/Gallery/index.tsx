import React, { useState } from 'react';
import { Theme, useMediaQuery } from '@mui/material';
import { useGoogleAnalytics } from 'hooks/Utils';
import { makeStyles } from '@mui/styles';
import { useAlbums } from 'hooks/Gallery';
import { Gallery } from 'types';

const useStyles = makeStyles((theme) => ({
  image: {
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export type GalleryProps = {
  data: Gallery;
};

const GalleryRenderer = ({ data }: GalleryProps) => {
  const { event } = useGoogleAnalytics();
  const { data } = useAlbums();
  const classes = useStyles();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
};

export default PhotoAlbum;
