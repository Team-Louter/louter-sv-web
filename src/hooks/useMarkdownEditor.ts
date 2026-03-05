import type { RefObject } from 'react';
import { MARKDOWN_TOOLS } from '@/constants/Community';

export const useMarkdownEditor = (
  content: string,
  setContent: (content: string) => void,
  textareaRef: RefObject<HTMLTextAreaElement|null>,
) => {
  const insert = (before: string, after = '', block = false) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end);

    if (block) {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const currentLine = content.substring(lineStart);
      if (currentLine.startsWith(before)) {
        const newValue = content.substring(0, lineStart) + content.substring(lineStart + before.length);
        setContent(newValue);
        requestAnimationFrame(() => {
          el.focus();
          el.setSelectionRange(Math.max(lineStart, start - before.length), Math.max(lineStart, end - before.length));
        });
        return;
      }
    } else if (after) {
      const beforeSelected = content.substring(start - before.length, start);
      const afterSelected = content.substring(end, end + after.length);
      if (beforeSelected === before && afterSelected === after) {
        const newValue = content.substring(0, start - before.length) + selected + content.substring(end + after.length);
        setContent(newValue);
        requestAnimationFrame(() => {
          el.focus();
          el.setSelectionRange(start - before.length, end - before.length);
        });
        return;
      }
    }

    let newValue: string;
    let cursorStart: number;
    let cursorEnd: number;

    if (block) {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      newValue = content.substring(0, lineStart) + before + content.substring(lineStart);
      cursorStart = start + before.length;
      cursorEnd = end + before.length;
    } else {
      newValue = content.substring(0, start) + before + selected + after + content.substring(end);
      cursorStart = start + before.length;
      cursorEnd = selected ? end + before.length : start + before.length;
    }

    setContent(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const handleToolClick = (tool: typeof MARKDOWN_TOOLS[number], onImageClick?: () => void, onFileClick?: () => void) => {
    if (tool.type === 'image') onImageClick?.();
    else if (tool.type === 'file') onFileClick?.();
    else insert(tool.before, tool.after, tool.block);
  };

  return { insert, handleToolClick };
};