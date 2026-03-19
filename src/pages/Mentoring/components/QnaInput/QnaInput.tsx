import { useRef, useState, useEffect } from "react";
import * as S from "./QnaInput.styled";
import imageIcon from "@/assets/mentoringImg/img.png";
import codeIcon from "@/assets/mentoringImg/code.png";
import sendIcon from "@/assets/mentoringImg/send.png";
import trashIcon from "@/assets/mentoringImg/trash.png";
import type { AttachedImage } from "@/types/mentoring";

const MAX_LENGTH = 700;

interface QnaInputProps {
  onSubmit: (content: string, images: AttachedImage[]) => Promise<void>;
  placeholder: string;
}

export default function QnaInput({ onSubmit, placeholder }: QnaInputProps) {
  const [value, setValue] = useState("");
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachedImagesRef = useRef<AttachedImage[]>([]);

  useEffect(() => {
    attachedImagesRef.current = attachedImages;
  }, [attachedImages]);

  useEffect(() => {
    return () => {
      attachedImagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  const appendImages = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    const nextImages = imageFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    setAttachedImages((prev) => [...prev, ...nextImages]);
  };

  const handleSubmit = async () => {
    if ((!value.trim() && attachedImages.length === 0) || isLoading) return;

    setIsLoading(true);
    try {
      await onSubmit(value, attachedImages);
      attachedImages.forEach((img) => URL.revokeObjectURL(img.url));
      setValue("");
      setAttachedImages([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("제출 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageInsert = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files ?? []);
      appendImages(files);
    };
    input.click();
  };

  const handleImageRemove = (index: number) => {
    URL.revokeObjectURL(attachedImages[index].url);
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCodeInsert = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    const snippet = `\`\`\`\n${selected}\n\`\`\``;
    const newValue = value.slice(0, start) + snippet + value.slice(end);

    setValue(newValue);

    setTimeout(() => {
      const cursor = start + 4;
      textarea.setSelectionRange(cursor, cursor + selected.length);
      textarea.focus();
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_LENGTH) return;
    setValue(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const imageFiles = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (imageFiles.length === 0) return;

    e.preventDefault();
    appendImages(imageFiles);
  };

  return (
    <S.Wrapper>
      {attachedImages.length > 0 && (
        <S.ImagePreviewArea>
          {attachedImages.map((img, i) => (
            <S.ImagePreviewItem key={i}>
              <S.PreviewImg src={img.url} alt={img.name} />
              <S.RemoveButton
                type="button"
                onClick={() => handleImageRemove(i)}
                disabled={isLoading}
              >
                <S.TrashIcon src={trashIcon} />
              </S.RemoveButton>
            </S.ImagePreviewItem>
          ))}
        </S.ImagePreviewArea>
      )}

      <S.TextareaWrapper>
        <S.Input
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={isLoading ? "전송 중..." : placeholder}
          rows={1}
          disabled={isLoading}
        />
      </S.TextareaWrapper>

      <S.Toolbar>
        <S.ToolLeft>
          <S.IconButton
            type="button"
            onClick={handleImageInsert}
            disabled={isLoading}
          >
            <img src={imageIcon} alt="이미지" width={18} height={18} />
          </S.IconButton>
          <S.IconButton
            type="button"
            onClick={handleCodeInsert}
            disabled={isLoading}
          >
            <img src={codeIcon} alt="코드" width={18} height={18} />
          </S.IconButton>
        </S.ToolLeft>

        <S.ToolRight>
          <S.CharCount $isOver={value.length > MAX_LENGTH}>
            {value.length}/{MAX_LENGTH}
          </S.CharCount>

          <S.IconButton
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <img src={sendIcon} alt="전송" width={18} height={18} />
          </S.IconButton>
        </S.ToolRight>
      </S.Toolbar>
    </S.Wrapper>
  );
}
