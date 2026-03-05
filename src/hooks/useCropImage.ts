import { useState, useCallback } from 'react';
import type { Area } from 'react-easy-crop';
import { getCroppedBlob } from '@/utils/cropImage';
import { uploadFile } from '@/api/Post';
import { toast } from '@/store/toastStore';

interface UseCropImageReturn {
  cropSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  uploading: boolean;
  profileImageUrl: string;
  imageFileName: string;
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  onCropComplete: (_: Area, areaPixels: Area) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCropConfirm: () => Promise<void>;
  handleCropCancel: () => void;
}

export function useCropImage(initialImageUrl: string): UseCropImageReturn {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(initialImageUrl);
  const [imageFileName, setImageFileName] = useState<string>(() => {
    if (initialImageUrl) {
      const parts = initialImageUrl.split('/');
      return parts[parts.length - 1] || '';
    }
    return '';
  });

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels);
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const { url } = await uploadFile(file);
      setProfileImageUrl(url);
      setImageFileName('profile.jpg');
      setCropSrc(null);
      toast.success('이미지가 업로드되었습니다.');
    } catch {
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  return {
    cropSrc,
    crop,
    zoom,
    uploading,
    profileImageUrl,
    imageFileName,
    setCrop,
    setZoom,
    onCropComplete,
    handleFileChange,
    handleCropConfirm,
    handleCropCancel,
  };
}
