import { PercentCrop } from 'react-image-crop';

export default function getCroppedImage(
  imageUrl: string, crop: PercentCrop, fileName: string,
): Promise<File | null> {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    if (!crop.width || !crop.height || !crop.x || !crop.y) {
      return resolve(null);
    }
    const canvas = document.createElement('canvas');

    const image = new Image();
    image.src = imageUrl;

    const scaleX = (image.width * crop.width) / 100;
    const scaleY = (image.height * crop.height) / 100;
    canvas.width = scaleX;
    canvas.height = scaleY;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        image,
        (image.width * crop.x) / 100,
        (image.height * crop.y) / 100,
        scaleX,
        scaleY,
        0,
        0,
        scaleX,
        scaleY,
      );
    }

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], fileName, { type: blob.type }));
      }
    }, 'image/jpeg', 1);
  });
}
