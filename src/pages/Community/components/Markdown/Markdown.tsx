import { MARKDOWN_TOOLS } from "@/constants/Community";
import * as S from "./Markdown.styled";
import { FaExclamation } from "react-icons/fa6";
import { colors } from "@/styles/values/_foundation";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import type { RefObject } from "react";

interface MarkdownProps {
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    content: string;
    setContent: (value: string) => void;
    onImageClick?: () => void;
    onFileClick?: () => void;
}

export default function Markdown({ textareaRef, content, setContent, onImageClick, onFileClick }: MarkdownProps) {
    const { handleToolClick } = useMarkdownEditor(content, setContent, textareaRef);

    return (
        <S.Container>
            <S.MarkdownContainer>
                {MARKDOWN_TOOLS.map((tool, index) => (
                    <S.ForColumn key={index}>
                        <S.MarkdownButton
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleToolClick(tool, onImageClick, onFileClick);
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