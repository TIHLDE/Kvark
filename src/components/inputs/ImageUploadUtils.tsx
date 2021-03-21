const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Noo'));
        }
      },
      false,
    );
    reader.readAsDataURL(file);
  });
};

/**
 * Converts the cropped img to a blob which can be uploaded
 * @param {string} imageSrc - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {string} imgType - type of image
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCroppedImgAsBlob = async (imageSrc: string, pixelCrop: any, imgType = 'image/png'): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error(`Could not load canvas`));
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x), Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y));

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Error creating file'));
      }
    }, imgType);
  });
};

export const blobToFile = (blob: Blob, name: string, type: string): File => {
  return new File([blob], name, { type });
};
