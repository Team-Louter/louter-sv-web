import { MARKDOWN_TOOLS } from "@/constants/Community";
import * as S from "./Markdown.styled";
import { FaExclamation } from "react-icons/fa6";
import { colors } from "@/styles/values/_foundation";
import type { MarkdownProps } from "@/types/community";

export default function Markdown({ textareaRef, content, setContent, onImageClick, onFileClick }: MarkdownProps) {

    // 마크다운 버튼 클릭 시 마크다운 적용/해제
    const insert = (before: string, after = "", block = false) => {
        const el = textareaRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = content.substring(start, end);

        if (block) { // block 타입 마크다운 이미 적용되어있을 시 해제
            const lineStart = content.lastIndexOf("\n", start - 1) + 1;
            const currentLine = content.substring(lineStart);
            if (currentLine.startsWith(before)) {
                const newValue =
                    content.substring(0, lineStart) +
                    content.substring(lineStart + before.length);
                setContent(newValue);
                requestAnimationFrame(() => {
                    el.focus();
                    el.setSelectionRange(
                        Math.max(lineStart, start - before.length),
                        Math.max(lineStart, end - before.length)
                    );
                });
                return;
            }
        } else if (after) { // 인라인 타입 마크다운 이미 적용되어있을 시 해제
            const beforeSelected = content.substring(start - before.length, start);
            const afterSelected = content.substring(end, end + after.length);
            if (beforeSelected === before && afterSelected === after) {
                const newValue =
                    content.substring(0, start - before.length) +
                    selected +
                    content.substring(end + after.length);
                setContent(newValue);
                requestAnimationFrame(() => {
                    el.focus();
                    el.setSelectionRange(
                        start - before.length,
                        end - before.length
                    );
                });
                return;
            }
        }

        // 마크다운 삽입
        let newValue: string;
        let cursorStart: number;
        let cursorEnd: number;

        if (block) { // block 타입 삽입
            const lineStart = content.lastIndexOf("\n", start - 1) + 1;
            newValue =
                content.substring(0, lineStart) +
                before +
                content.substring(lineStart);
            cursorStart = start + before.length;
            cursorEnd = end + before.length;
        } else {
            newValue =
                content.substring(0, start) +
                before +
                selected +
                after +
                content.substring(end);

            if (selected) { // 텍스트 드래그 했으면 드래그한 텍스트 전체 선택
                cursorStart = start + before.length;
                cursorEnd = end + before.length;
            } else { // 드래그한 텍스트 없으면 마크다운 삽입 후 그 사이
                cursorStart = start + before.length;
                cursorEnd = start + before.length;
            }
        }

        setContent(newValue);

        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(cursorStart, cursorEnd);
        });
    };

    // 마크다운 삽입 버튼 클릭 시 
    const handleToolClick = (tool: typeof MARKDOWN_TOOLS[number]) => {
        if (tool.type === "image") {
            onImageClick?.();
        } else if (tool.type === "file") {
            onFileClick?.();
        } else {
            insert(tool.before, tool.after, tool.block);
        }
    };

    return (
        <S.Container>
            <S.MarkdownContainer>
                {MARKDOWN_TOOLS.map((tool, index) => (
                    <S.ForColumn key={index}>
                        <S.MarkdownButton
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleToolClick(tool);
                            }}
                        >
                            <tool.icon size={tool.size ?? 20} style={{ color: colors.fill.yellow }} />
                        </S.MarkdownButton>
                        <S.MarkdownLabel>{tool.label}</S.MarkdownLabel>
                    </S.ForColumn>
                ))}
            </S.MarkdownContainer>
            <S.Guide>
                <FaExclamation />
                마크다운 문법으로 작성됩니다. 아이콘 클릭 시 문법이 삽입됩니다.
            </S.Guide>
        </S.Container>
    );
}