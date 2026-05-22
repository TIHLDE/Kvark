import { useCallback, useEffect, useMemo, useState } from 'react';

export const QR_CODES_STORAGE_KEY = 'kvark.qr-codes.v1';
export const QR_CODE_SHARE_PARAM = 'qr';

export type QRCodeType = 'text' | 'url';

export type QRCodeSharePayload = {
  type: QRCodeType;
  name: string;
  content: string;
};

export type LocalQRCode = QRCodeSharePayload & {
  id: string;
  createdAt: string;
};

const isQRCodeType = (value: unknown): value is QRCodeType => value === 'text' || value === 'url';

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const inferQRCodeType = (content: string): QRCodeType => (isValidUrl(content) ? 'url' : 'text');

const isQRCodePayload = (value: unknown): value is QRCodeSharePayload => {
  if (typeof value !== 'object' || value === null) return false;

  const payload = value as Record<string, unknown>;

  if (!isQRCodeType(payload.type)) return false;
  if (typeof payload.name !== 'string' || payload.name.trim().length === 0) return false;
  if (typeof payload.content !== 'string' || payload.content.trim().length === 0) return false;

  return true;
};

const isLocalQRCode = (value: unknown): value is LocalQRCode => {
  if (typeof value !== 'object' || value === null) return false;

  const qrCode = value as Record<string, unknown>;

  return typeof qrCode.id === 'string' && typeof qrCode.createdAt === 'string' && isQRCodePayload(qrCode);
};

const encodeBase64Url = (value: string) => btoa(encodeURIComponent(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

const decodeBase64Url = (value: string) => {
  const base64 = value
    .replaceAll('-', '+')
    .replaceAll('_', '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');
  return decodeURIComponent(atob(base64));
};

export const encodeQRCodePayload = (payload: QRCodeSharePayload) => encodeBase64Url(JSON.stringify(payload));

export const decodeQRCodePayload = (encodedPayload: string): QRCodeSharePayload | null => {
  try {
    if (encodedPayload.length > 4096) return null;

    const value = JSON.parse(decodeBase64Url(encodedPayload));
    return isQRCodePayload(value) ? value : null;
  } catch {
    return null;
  }
};

const readQRCodes = (): LocalQRCode[] => {
  if (typeof window === 'undefined') return [];

  try {
    const value = localStorage.getItem(QR_CODES_STORAGE_KEY);
    if (!value) return [];

    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isLocalQRCode) : [];
  } catch {
    return [];
  }
};

const writeQRCodes = (qrCodes: LocalQRCode[]) => {
  localStorage.setItem(QR_CODES_STORAGE_KEY, JSON.stringify(qrCodes));
};

const hashCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomHash() {
  let hash = '';
  for (let i = 0; i < 10; i++) {
    hash += hashCharacters.charAt(Math.floor(Math.random() * hashCharacters.length));
  }
  return hash;
}

export const useLocalQRCodes = () => {
  const [qrCodes, setQRCodes] = useState<LocalQRCode[]>([]);

  useEffect(() => {
    setQRCodes(readQRCodes());
  }, []);

  const sortedQRCodes = useMemo(() => [...qrCodes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [qrCodes]);

  const createQRCode = useCallback((payload: QRCodeSharePayload) => {
    let qrId = randomHash();
    while (sortedQRCodes.some((qrCode) => qrCode.id === qrId)) {
      qrId = randomHash();
    }

    const qrCode: LocalQRCode = {
      ...payload,
      id: qrId,
      createdAt: new Date().toISOString(),
    };

    setQRCodes((current) => {
      const next = [qrCode, ...current];
      writeQRCodes(next);
      return next;
    });
  }, []);

  const deleteQRCode = useCallback((id: string) => {
    setQRCodes((current) => {
      const next = current.filter((qrCode) => qrCode.id !== id);
      writeQRCodes(next);
      return next;
    });
  }, []);

  return { qrCodes: sortedQRCodes, createQRCode, deleteQRCode };
};
