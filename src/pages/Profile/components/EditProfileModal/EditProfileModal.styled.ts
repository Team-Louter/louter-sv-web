import styled from 'styled-components';
import * as token from '@/styles/values/token';

/* ─── 크롭 모달 ─── */
export const CropOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  ${token.flexCenter}
  z-index: 1100;
`;

export const CropModal = styled.div`
  background: ${token.colors.main.white};
  border-radius: 12px;
  padding: 28px 28px 24px;
  width: 520px;
  ${token.flexColumn}
  gap: 0;
  ${token.elevation('black_3')}
`;

export const CropTitle = styled.h3`
  ${token.typography('heading', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
  margin: 0 0 16px;
`;

export const CropArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
`;

export const CropZoomRow = styled.div`
  ${token.flexRow}
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const CropZoomLabel = styled.span`
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.coolGray};
  flex-shrink: 0;
`;

export const CropZoomSlider = styled.input`
  flex: 1;
  accent-color: ${token.colors.main.yellow};
  cursor: pointer;
`;

export const CropButtonRow = styled.div`
  ${token.flexRow}
  justify-content: flex-end;
  gap: 12px;
`;

/* ─── 오버레이 ─── */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  ${token.flexCenter}
  z-index: 1000;
`;

/* ─── 모달 본체 ─── */
export const Modal = styled.div`
  background-color: ${token.colors.main.white};
  border-radius: 12px;
  padding: 40px 40px 36px;
  width: 600px;
  ${token.flexColumn}
  gap: 0;
  ${token.elevation('black_3')}
  max-height: 90vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

/* ─── 제목 ─── */
export const Title = styled.h2`
  ${token.typography('heading', 'md', 'semibold')}
  color: ${token.colors.text.dark};
  margin: 0 0 32px;
`;

/* ─── 행 (레이블 + 입력값) ─── */
export const Row = styled.div`
  ${token.flexRow}
  align-items: center;
  margin-bottom: 24px;
  gap: 0;
`;

export const Label = styled.span`
  ${token.typography('body', 'md', 'medium')}
  color: ${token.colors.fill.slate};
  min-width: 100px;
  flex-shrink: 0;
`;

/* ─── 텍스트 입력 ─── */
export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

export const Input = styled.input`
  width: 100%;
  height: 35px;
  padding: 0px 12px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 5px;
  background-color: ${token.colors.main.white};
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &::placeholder {
    color: ${token.colors.text.lightGray};
  }

  &:focus {
    border-color: ${token.colors.main.yellow};
  }
`;

export const CharCount = styled.span`
  position: absolute;
  bottom: 10px;
  right: 12px;
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.text.lightGray};
  pointer-events: none;
`;

/* ─── 전공 드롭다운 ─── */
export const MajorContainer = styled.div`
  position: relative;
  flex: 1;
`;

export const MajorDropdownButton = styled.button<{
  $isOpen: boolean;
  $hasSelection: boolean;
}>`
  width: 100%;
  height: 35px;
  padding: 5px 12px;
  border: 1px solid ${token.colors.line.light};
  border-radius: 5px;
  background-color: ${token.colors.background.white};
  ${token.flexBetween}
  align-items: center;
  cursor: pointer;
  ${token.typography('body', 'sm', 'medium')}
  color: ${({ $hasSelection }) =>
    $hasSelection ? token.colors.text.dark : token.colors.text.coolGray};
  text-align: left;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${token.colors.line.highlight};
  }
`;

export const MajorArrow = styled.span<{ $isOpen: boolean }>`
  font-size: 13px;
  color: ${token.colors.text.dark};
  transition: transform 0.3s;
  transform: ${({ $isOpen }) =>
    $isOpen ? 'rotate(270deg)' : 'rotate(180deg)'};
  flex-shrink: 0;
`;

export const MajorDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: ${token.colors.background.white};
  border: 1px solid #dfdfdf;
  border-radius: ${token.shapes.xsmall};
  max-height: 260px;
  overflow-y: auto;
  z-index: 10;
  padding: 10px;
  ${token.flexColumn}
  gap: 6px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const MajorItem = styled.div<{ $selected: boolean }>`
  ${token.flexBetween}
  align-items: center;
  padding: 5px 12px;
  border: 1px solid ${token.colors.line.light};
  border-radius: 5px;
  cursor: pointer;
  background: ${({ $selected }) =>
    $selected ? token.colors.background.yellow : token.colors.background.white};
  transition: background 0.15s;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? token.colors.background.yellow : token.colors.fill.f5};
  }
`;

export const MajorItemLabel = styled.span<{ $selected: boolean }>`
  ${token.typography('caption', 'lg', 'medium')}
  color: ${({ $selected }) =>
    $selected ? token.colors.text.dark : token.colors.text.coolGray};
`;

/* ─── 현재 프로필 이미지 파일명 ─── */
export const ProfileFileName = styled.span`
  ${token.typography('body', 'sm', 'regular')}
  color: ${token.colors.text.coolGray};
  flex: 1;
`;

/* ─── 이미지 업로드 버튼 ─── */
export const UploadButton = styled.label`
  flex: 1;
  height: 35px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 6px;
  background-color: ${token.colors.main.white};
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
  cursor: pointer;
  ${token.flexCenter}
  transition:
    background-color 0.15s,
    border-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.f3};
    border-color: ${token.colors.text.lightGray};
  }

  input[type='file'] {
    display: none;
  }
`;

/* ─── 링크 추가하기 버튼 ─── */
export const LinkToggle = styled.button`
  ${token.flexCenter}
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  ${token.typography('body', 'md', 'medium')}
  color: ${token.colors.text.coolGray};
  padding: 0;
  margin: 0 0 24px;
  transition: color 0.15s;

  &:hover {
    color: ${token.colors.text.dark};
  }
`;

export const LinkToggleIcon = styled.span`
  font-size: 18px;
  line-height: 1;
  color: ${token.colors.text.coolGray};
`;

/* ─── 링크 섹션 ─── */
export const LinkSection = styled.div`
  ${token.flexColumn}
  gap: 0;
  margin-bottom: 8px;
`;

export const LinkRow = styled.div`
  ${token.flexRow}
  align-items: center;
  margin-bottom: 16px;
  gap: 0;
`;

export const LinkIconWrapper = styled.span`
  min-width: 100px;
  flex-shrink: 0;
  ${token.flexRow}
  align-items: center;
  gap: 4px;
  ${token.typography('body', 'md', 'medium')}
  color: ${token.colors.fill.slate};
`;

export const LinkInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 5px;
  background-color: ${token.colors.main.white};
  overflow: hidden;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: ${token.colors.main.yellow};
  }
`;

export const LinkPrefix = styled.span`
  padding: 0 0 0 12px;
  white-space: nowrap;
  flex-shrink: 0;
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
`;

export const LinkInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 35px;
  padding: 0 12px 0 2px;
  border: none;
  background: transparent;
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
  outline: none;

  &::placeholder {
    color: ${token.colors.text.lightGray};
  }
`;

/* ─── 구분선 ─── */
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${token.colors.line.light};
  margin: 8px 0 28px;
`;

/* ─── 버튼 ─── */
export const ButtonRow = styled.div`
  ${token.flexRow}
  justify-content: flex-end;
  gap: 12px;
`;

export const CancelButton = styled.button`
  padding: 10px 0;
  width: 100px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  background-color: ${token.colors.main.white};
  ${token.typography('body', 'md', 'bold')}
  color: ${token.colors.text.dark};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.f3};
  }
`;

export const SaveButton = styled.button`
  padding: 10px 0;
  width: 100px;
  border: none;
  border-radius: 4px;
  background-color: ${token.colors.main.yellow};
  ${token.typography('body', 'md', 'bold')}
  color: ${token.colors.text.strong};
  cursor: pointer;
  transition: opacity 0.15s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #e6c200;
  }
`;
