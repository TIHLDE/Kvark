import { Gallery, GalleryRequired, PaginationResponse, Picture, RequestResponse } from 'types';

import { IFetch } from 'api/fetch';

import { GALLERY_ENDPOINT, PICTURE_ENDPOINT } from './api';

export const GALLERY_API = {
  getGallery: (gallerySlug: string) => IFetch<Gallery>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${gallerySlug}/` }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGallerys: (filters?: any) => IFetch<PaginationResponse<Gallery>>({ method: 'GET', url: `${GALLERY_ENDPOINT}/`, data: filters || {} }),
  createGallery: (item: GalleryRequired) => IFetch<Gallery>({ method: 'POST', url: `${GALLERY_ENDPOINT}/`, data: item }),
  updateGallery: (gallerySlug: string, item: Partial<Gallery>) => IFetch<Gallery>({ method: 'PUT', url: `${GALLERY_ENDPOINT}/${gallerySlug}/`, data: item }),
  deleteGallery: (gallerySlug: string) => IFetch<RequestResponse>({ method: 'DELETE', url: `${GALLERY_ENDPOINT}/${gallerySlug}/` }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGalleryPictures: (gallerySlug: string, filters?: any) =>
    IFetch<PaginationResponse<Picture>>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${gallerySlug}/${PICTURE_ENDPOINT}/`, data: filters || {} }),
  getPicture: (gallerySlug: string, id: string) => IFetch<Picture>({ method: 'GET', url: `${GALLERY_ENDPOINT}/${gallerySlug}/${PICTURE_ENDPOINT}/${id}` }),
  createPicture: (gallerySlug: string, files: File | File[] | Blob) =>
    IFetch<RequestResponse>({ method: 'POST', url: `${GALLERY_ENDPOINT}/${gallerySlug}/${PICTURE_ENDPOINT}/`, file: files }),
  updatePicture: (gallerySlug: string, id: string, item: Partial<Picture>) =>
    IFetch<Picture>({ method: 'PUT', url: `${GALLERY_ENDPOINT}/${gallerySlug}/${PICTURE_ENDPOINT}/${id}/`, data: item }),
  deletePicture: (gallerySlug: string, id: string) =>
    IFetch<RequestResponse>({ method: 'DELETE', url: `${GALLERY_ENDPOINT}/${gallerySlug}/${PICTURE_ENDPOINT}/${id}` }),
};
