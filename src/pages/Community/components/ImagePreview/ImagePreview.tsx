import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MdClose, MdDownload, MdZoomIn, MdZoomOut, MdChevronLeft, MdChevronRight } from "react-icons/md";
import type { ImagePreviewProps } from "@/types/community";
import * as S from "./ImagePreview.styled";

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const DRAG_THRESHOLD = 4;

function ImagePreview({ open, images, initialIndex, onClose }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const scaleRef = useRef(scale);

  const src = images[currentIndex] ?? "";
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;
  const hasMultiple = images.length > 1;

  // 열릴 때마다 인덱스·줌·위치 초기화
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [open, initialIndex]);

  // 이미지 전환 시 줌·위치 초기화
  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return prev;
      resetView();
      return prev - 1;
    });
  }, [resetView]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= images.length - 1) return prev;
      resetView();
      return prev + 1;
    });
  }, [images.length, resetView]);

  // scale 변경 시 ref 동기화
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  // 드래그 상태 (ref로 관리하여 리렌더링 방지)
  const dragRef = useRef({
    isDragging: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  // 이미지 끝이 화면 중앙까지만 이동 가능하도록 제한
  const clampPosition = useCallback((x: number, y: number, currentScale: number) => {
    const img = imgRef.current;
    if (!img || currentScale <= 1) return { x: 0, y: 0 };

    const maxX = (img.clientWidth * currentScale) / 2;
    const maxY = (img.clientHeight * currentScale) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  // 열릴 때마다 줌·위치 초기화
  useEffect(() => {
    if (open) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // ESC·좌우 화살표 키 처리
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, goToPrev, goToNext]);

  // 스크롤로 줌 조절 (줌 변경 시 위치도 비례 조정 + 범위 제한)
  useEffect(() => {
    if (!open) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((prev) => {
        const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)));
        if (next <= 1) {
          setPosition({ x: 0, y: 0 });
        } else {
          setPosition((pos) => {
            const ratio = next / prev;
            return clampPosition(pos.x * ratio, pos.y * ratio, next);
          });
        }
        return next;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [open, clampPosition]);

  // 드래그 이동 이벤트
  useEffect(() => {
    if (!open) return;

    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag.isDragging) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;

      if (!drag.didDrag && Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
        drag.didDrag = true;
      }

      if (drag.didDrag) {
        const rawX = drag.lastX + dx;
        const rawY = drag.lastY + dy;
        setPosition(clampPosition(rawX, rawY, scaleRef.current));
      }
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [open, clampPosition]);

  // 이미지 영역 마우스 다운 → 드래그 시작
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const drag = dragRef.current;
    drag.isDragging = true;
    drag.didDrag = false;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.lastX = position.x;
    drag.lastY = position.y;
  }, [position]);

  // 오버레이 클릭 (드래그 아닌 클릭만 닫기)
  const handleOverlayClick = useCallback(() => {
    if (!dragRef.current.didDrag) onClose();
  }, [onClose]);

  // 이미지 래퍼 클릭 (드래그 전파 차단)
  const handleWrapperClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 이미지 다운로드
  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const fileName = src.split("/").pop()?.split("?")[0] || "image";

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank");
    }
  }, [src]);

  const zoomIn = useCallback(() => {
    setScale((prev) => {
      const next = Math.min(ZOOM_MAX, prev + ZOOM_STEP);
      setPosition((pos) => clampPosition(pos.x, pos.y, next));
      return next;
    });
  }, [clampPosition]);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(ZOOM_MIN, prev - ZOOM_STEP);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      else setPosition((pos) => clampPosition(pos.x, pos.y, next));
      return next;
    });
  }, [clampPosition]);

  // 이벤트 전파 차단용 핸들러
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!open) return null;

  const canPan = scale > 1;

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.Toolbar onClick={stopPropagation}>
        <S.ToolbarButton onClick={handleDownload} title="다운로드">
          <MdDownload size={22} />
        </S.ToolbarButton>
        <S.ToolbarButton onClick={onClose} title="닫기">
          <MdClose size={22} />
        </S.ToolbarButton>
      </S.Toolbar>

      {hasMultiple && hasPrev && (
        <S.NavButton $direction="left" onClick={(e) => { e.stopPropagation(); goToPrev(); }}>
          <MdChevronLeft size={36} />
        </S.NavButton>
      )}

      <S.ImageWrapper
        $scale={scale}
        $x={position.x}
        $y={position.y}
        $canPan={canPan}
        onClick={handleWrapperClick}
        onMouseDown={handleMouseDown}
      >
        <S.PreviewImage ref={imgRef} src={src} alt="미리보기" draggable={false} />
      </S.ImageWrapper>

      {hasMultiple && hasNext && (
        <S.NavButton $direction="right" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
          <MdChevronRight size={36} />
        </S.NavButton>
      )}

      <S.ZoomControls onClick={stopPropagation}>
        <S.ToolbarButton onClick={zoomOut} title="축소">
          <MdZoomOut size={20} />
        </S.ToolbarButton>
        <S.ZoomLabel>{Math.round(scale * 100)}%</S.ZoomLabel>
        <S.ToolbarButton onClick={zoomIn} title="확대">
          <MdZoomIn size={20} />
        </S.ToolbarButton>
        {hasMultiple && (
          <S.PageIndicator>{currentIndex + 1} / {images.length}</S.PageIndicator>
        )}
      </S.ZoomControls>
    </S.Overlay>
  );
}

export default memo(ImagePreview);
