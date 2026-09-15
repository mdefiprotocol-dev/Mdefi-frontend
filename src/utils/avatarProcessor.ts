/**
 * Utility for processing, cropping, resizing and compressing user profile avatars client-side.
 * 
 * Complies with strict avatar requirements:
 * - Square center crop for circular avatar rendering
 * - Max dimension 512x512
 * - WebP compression with JPEG fallback
 * - Memory safe and non-blocking
 * - Rejects non-image files with clear errors
 */

export interface AvatarProcessResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  dimensions: string;
}

/**
 * Resizes and compresses an uploaded image file into a square avatar data URL.
 */
export async function processAvatarImage(file: File, maxDimension = 512, quality = 0.85): Promise<AvatarProcessResult> {
  // Validate file type
  if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|bmp|svg|avif)$/i.test(file.name)) {
    throw new Error('Please select a valid image file (JPG, PNG, or WebP).');
  }

  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          throw new Error('Image dimensions could not be read.');
        }

        // Center square crop coordinates
        const minSide = Math.min(width, height);
        const sx = (width - minSide) / 2;
        const sy = (height - minSide) / 2;

        // Scale to maxDimension (e.g. 512x512)
        const targetSize = Math.min(minSide, maxDimension);

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas rendering is not supported by your browser.');
        }

        // Better scaling quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the square cropped portion
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);

        // Try WebP compression first
        let compressedDataUrl = canvas.toDataURL('image/webp', quality);
        
        // Fallback to JPEG if WebP export is unsupported
        if (!compressedDataUrl.startsWith('data:image/webp')) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl: compressedDataUrl,
          originalSizeKb,
          compressedSizeKb,
          dimensions: `${targetSize}×${targetSize}`,
        });
      } catch (err: any) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(err?.message || 'Failed to process avatar image.'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read image file. It may be corrupted or in an unsupported format.'));
    };

    img.src = objectUrl;
  });
}
