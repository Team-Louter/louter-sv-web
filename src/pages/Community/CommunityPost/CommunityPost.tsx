import { colors } from "@/styles/values/_foundation";
import * as S from "./CommunityPost.styled";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { CATEGORIES, CATEGORY_TAGS } from "@/constants/Community";
import CategoryDropdown from "../components/CategoryDropdown/CategoryDropdown";
import Markdown from "../components/Markdown/Markdown";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt({
    breaks: true, // 줄바꿈 한 번 -> 미리보기에서 줄바뀜
    linkify: true, // HTML 태그 -> 텍스트로 변환
    html: false,
});

const MAX_LENGTH = 2000;

export default function CommunityPost() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(""); // 선택한 카테고리
    const [selectedTag, setSelectedTag] = useState(""); // 선택한 말머리
    const [content, setContent] = useState(""); // 작성된 내용
    const textareaRef = useRef<HTMLTextAreaElement>(null); // 커서 위치 추적
    const isComposingRef = useRef(false); // 한글 조합 중 여부

    const tags = CATEGORY_TAGS[selectedCategory] ?? []; // 선택된 카테고리에 따른 말머리 배열 생성
    const rendered = DOMPurify.sanitize(md.render(content)); // XSS 방어
    const isOverLimit = content.length >= MAX_LENGTH; // 글자 수 제한 확인

    // 내용 입력
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_LENGTH) {
            setContent(e.target.value);
        }
    };

    // 마크다운 적용 버튼 클릭
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Enter") return;

        const el = textareaRef.current;
        if (!el) return;

        if (isComposingRef.current) {
            const pos = el.selectionStart;
            const lineStart = content.lastIndexOf("\n", pos - 1) + 1;
            const currentLine = content.substring(lineStart, pos);
            const ulMatch = currentLine.match(/^(\s*[-*]\s)/);
            const olMatch = currentLine.match(/^(\s*)(\d+)\.\s?/);
            if (!ulMatch && !olMatch) return;

            e.preventDefault();
            const savedPos = pos;
            setTimeout(() => {
                const domValue = el.value;
                const lineStartAfter = domValue.lastIndexOf("\n", savedPos - 1) + 1;
                const lineAfterIME = domValue.substring(lineStartAfter, domValue.indexOf("\n", lineStartAfter) === -1 ? domValue.length : domValue.indexOf("\n", lineStartAfter));
                processListEnter(domValue, lineStartAfter, lineAfterIME, el, ulMatch, olMatch);
            }, 0);
            return;
        }

        const pos = el.selectionStart;
        const lineStart = content.lastIndexOf("\n", pos - 1) + 1;
        const currentLine = content.substring(lineStart, pos);

        const ulMatch = currentLine.match(/^(\s*[-*]\s)/);
        const olMatch = currentLine.match(/^(\s*)(\d+)\.\s?/);

        if (!ulMatch && !olMatch) return;

        e.preventDefault();
        processListEnter(content, lineStart, currentLine, el, ulMatch, olMatch);
    };

    // 리스트 안에서 Enter 눌렀을 때
    const processListEnter = (
        value: string,
        lineStart: number,
        currentLine: string,
        el: HTMLTextAreaElement,
        ulMatch: RegExpMatchArray | null,
        olMatch: RegExpMatchArray | null
    ) => {
        const pos = el.selectionStart;

        if (ulMatch) {
            const prefix = ulMatch[1];
            if (currentLine === prefix) {
                const newValue = value.substring(0, lineStart) + value.substring(pos);
                setContent(newValue);
                requestAnimationFrame(() => el.setSelectionRange(lineStart, lineStart));
                return;
            }
            const insertText = "\n" + prefix;
            const newValue = value.substring(0, pos) + insertText + value.substring(pos);
            if (newValue.length > MAX_LENGTH) return;
            setContent(newValue);
            requestAnimationFrame(() => el.setSelectionRange(pos + insertText.length, pos + insertText.length));

        } else if (olMatch) {
            const indent = olMatch[1];
            const num = parseInt(olMatch[2], 10);
            const olPrefix = indent + num + ". ";
            if (currentLine === olPrefix || currentLine === indent + num + ".") {
                const newValue = value.substring(0, lineStart) + value.substring(pos);
                setContent(newValue);
                requestAnimationFrame(() => el.setSelectionRange(lineStart, lineStart));
                return;
            }
            const insertText = "\n" + indent + (num + 1) + ". ";
            const newValue = value.substring(0, pos) + insertText + value.substring(pos);
            if (newValue.length > MAX_LENGTH) return;
            setContent(newValue);
            requestAnimationFrame(() => el.setSelectionRange(pos + insertText.length, pos + insertText.length));
        }
    };

    return (
        <S.Container>
            <S.Top>
                <S.ForRow style={{ justifyContent: "space-between" }}>
                    <S.Div style={{ cursor: "pointer" }} onClick={() => navigate("/community")}>
                        <IoIosArrowBack size={30} color={colors.fill.yellow} />
                        <S.TitleLabel>게시글 작성</S.TitleLabel>
                    </S.Div>
                    <S.Confirm>등록</S.Confirm>
                </S.ForRow>

                <S.ForRow style={{ gap: 50 }}>
                    <CategoryDropdown
                        options={CATEGORIES.filter((c) => c !== "전체")}
                        selected={selectedCategory}
                        onChange={(category: string) => {
                            setSelectedCategory(category);
                            setSelectedTag("");
                        }}
                        placeholder="카테고리를 선택해주세요."
                    />
                    <CategoryDropdown
                        options={tags}
                        selected={selectedTag}
                        onChange={setSelectedTag}
                        placeholder="말머리를 선택해주세요."
                    />
                    <S.Div>
                        <S.CheckboxLabel>
                            <input type="checkbox" />
                        </S.CheckboxLabel>
                        <S.Label>익명으로 등록</S.Label>
                    </S.Div>
                </S.ForRow>

                <S.ForRow>
                    <S.Title placeholder="제목을 입력해주세요." />
                </S.ForRow>
            </S.Top>

            <S.MainContainer>
                <Markdown
                    textareaRef={textareaRef}
                    content={content}
                    setContent={setContent}
                />
                <S.WriteContainer>
                    <S.Write
                        ref={textareaRef}
                        placeholder="내용을 입력해주세요."
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => { isComposingRef.current = true; }}
                        onCompositionEnd={() => { isComposingRef.current = false; }}
                    />
                    <S.PreviewWrapper>
                        <S.Preview dangerouslySetInnerHTML={{ __html: rendered }} />
                        <S.Counter $isOver={isOverLimit}>
                            {content.length} / {MAX_LENGTH}
                        </S.Counter>
                    </S.PreviewWrapper>
                </S.WriteContainer>
            </S.MainContainer>
        </S.Container>
    );
}