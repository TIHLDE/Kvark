import type { FileObject } from '~/components/inputs/Upload';
import { toast } from 'sonner';

import API from './api';

type UploadWithSonnerResult = { success: true; url: string } | { success: false };
type UploadWithSonnerOptions = {
  loading?: string;
  success?: string | ((url: string) => string);
  error?: string | ((error: unknown) => string);
};

export function uploadFileWithToaster(file: File, options: UploadWithSonnerOptions = {}): Promise<UploadWithSonnerResult> {
  return new Promise((res) => {
    toast.promise(API.uploadFile(file), {
      loading: options.loading ?? 'Laster opp fil...',
      success: ({ url }) => {
        res({ success: true, url });
        if (typeof options.success === 'function') {
          return options.success(url);
        } else {
          return options.success ?? `Fil lastet opp`;
        }
      },
      error: (error) => {
        res({ success: false });
        if (typeof options.error === 'function') {
          return options.error(error);
        } else {
          return options.error ?? `Kunne ikke laste opp fil`;
        }
      },
    });
  });
}

/**
 * If the FileObject contains a file, upload it and return the URL
 * If the FileObject is a string, return it as is
 * @param image the FileObject to potentially upload
 * @returns image url or undefined (image is undefined)
 */
export async function uploadFormImage(image?: FileObject) {
  if (!image) {
    return undefined;
  }
  if (typeof image === 'string') {
    return image;
  }
  if (image?.file instanceof File) {
    const result = await uploadFileWithToaster(image.file, {
      loading: 'Laster opp bilde...',
      success: 'Bilde lastet opp',
      error: 'Kunne ikke laste opp bildet',
    });
    if (result.success) {
      return result.url;
    }
  }
  return undefined;
}
