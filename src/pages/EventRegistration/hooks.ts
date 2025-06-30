import QrScanner from 'qr-scanner';
import { useEffect } from 'react';

export type ScannerOptions = {
  color?: 'dark' | 'light' | 'both';
  onResult?: (result: QrScanner.ScanResult) => void;
  onError?: (error: Error | string) => void;
  maxScansPerSecond?: number;
  cameraPreference?: QrScanner.FacingMode | QrScanner.DeviceId;
};

// Sourced from: https://github.com/jakub-ucinski/qr-scanner-react/blob/cf465602c9967b71717c271d32892cfeb14ff7c9/src/hooks/useScanner.tsx
export function useScanner(
  vid: React.RefObject<HTMLVideoElement>,
  { onResult = () => {}, color = 'both', maxScansPerSecond = 5, onError = () => {}, cameraPreference = 'environment' }: ScannerOptions,
) {
  const inversion = (color && color === 'dark' && 'original') || (color && color === 'light' && 'invert') || 'both';

  useEffect(() => {
    let qrScanner: QrScanner | null = null;

    if (vid.current) {
      qrScanner = new QrScanner(vid.current, onResult, {
        onDecodeError: onError,
        maxScansPerSecond,
        preferredCamera: cameraPreference,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });

      if (!QrScanner.hasCamera()) {
        onError('Device has no camera');
      } else {
        qrScanner.setInversionMode(inversion);
        qrScanner.start();
      }
    }

    return (): void => {
      qrScanner?.stop();
      qrScanner?.destroy();
      qrScanner = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vid.current]);
}
