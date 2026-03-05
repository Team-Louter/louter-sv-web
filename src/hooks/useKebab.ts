import { useState } from 'react';
import { useClickOutside } from './useClickOutside';

export const useKebab = () => {
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const kebabRef = useClickOutside(() => setIsKebabOpen(false));

  return { isKebabOpen, setIsKebabOpen, kebabRef };
};