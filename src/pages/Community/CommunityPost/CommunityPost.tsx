import * as S from "./CommunityPost.styled";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { CATEGORIES, CATEGORY_TAGS } from "@/constants/Community";
import CategoryDropdown from "../components/CategoryDropdown/CategoryDropdown";
import Markdown from "../components/Markdown/Markdown";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";

// 마크다운 관련 설정
const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    html: false,
});

// 게시글 최대 글자 수 
const MAX_LENGTH = 2000;

export default function CommunityPost() {
    const navigate = useNavigate();
    const location = useLocation();
    const editPost = location.state?.post; // 게시글 수정 시 해당 게시글 정보

    const [selectedCategory, setSelectedCategory] = useState(editPost?.category ?? ""); // 선택된 카테고리
    const [selectedTag, setSelectedTag] = useState(editPost?.tag ?? ""); // 선택된 말머리
    const [content, setContent] = useState(editPost?.content ?? ""); // 게시글 내용
    const [title, setTitle] = useState(editPost?.title ?? ""); // 게시글 제목
    const [isModalOpen, setIsModalOpen] = useState(false); // 게시글 게시 확인 모달 열림 여부
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 게시글 작성 취소 모달 열림 여부
    const textareaRef = useRef<HTMLTextAreaElement>(null); // 커서 위치 추적
    const isComposingRef = useRef(false); // 한글 조합 중 여부

    const tags = CATEGORY_TAGS[selectedCategory] ?? []; // 카테고리별 말머리 배열 생성
    const rendered = DOMPurify.sanitize(md.render(content)); // XSS 공격 예방
    const isOverLimit = content.length >= MAX_LENGTH; // 글자 수 제한 초과 여부

    // 글자 수 제한 초과 시 업데이트 차단
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_LENGTH) {
            setContent(e.target.value);
        }
    };

    // 엔터 클릭 시 (현재 줄이 리스트면 다음 줄에 자동으로 기호 연결)
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

    // 리스트 삽입/종료
    const processListEnter = (
        value: string,
        lineStart: number,
        currentLine: string,
        el: HTMLTextAreaElement,
        ulMatch: RegExpMatchArray | null,
        olMatch: RegExpMatchArray | null
    ) => {
        const pos = el.selectionStart;

        if (ulMatch) { // - 리스트일 때
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

        } else if (olMatch) { // 1. 리스트일 때
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

    const isPostValid = !!title.trim() && !!selectedCategory && !!content.trim(); // 필수 설정 충족 여부 확인
    const hasContent = !!content.trim(); // 내용 입력 여부 확인

    // 게시 확인 모달에서 확인 눌렀을 때
    const handleConfirmPost = () => {
        if (!isPostValid) return;
        setIsModalOpen(false);
    };

    return (
        <S.Container>
            <S.Top>
                <S.ForRow style={{ justifyContent: "space-between" }}>
                    <S.Div style={{ cursor: "pointer" }} onClick={() => hasContent ? setIsCancelModalOpen(true) : navigate(-1)}>
                        <IoIosArrowBack size={30} color={'#FFBB00'} />
                        <S.TitleLabel>{editPost ? "게시글 수정" : "게시글 작성"}</S.TitleLabel>
                    </S.Div>
                    <S.Confirm onClick={() => setIsModalOpen(true)}>게시</S.Confirm>
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
                    {!editPost && (
                        <S.Div>
                            <S.CheckboxLabel>
                                <input type="checkbox" />
                            </S.CheckboxLabel>
                            <S.Label>익명으로 게시</S.Label>
                        </S.Div>
                    )}
                </S.ForRow>

                <S.ForRow>
                    <S.Title
                        placeholder="제목을 입력해주세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
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

            <ConfirmModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onConfirm={handleConfirmPost}
                errorMessage={!isPostValid ? "카테고리, 제목, 내용을 모두 입력해주세요." : undefined}
            />
            <ConfirmModal
                open={isCancelModalOpen}
                message={"게시글 작성을 취소하시겠어요?\n입력중인 내용은 저장되지 않습니다."}
                onCancel={() => setIsCancelModalOpen(false)}
                onConfirm={() => navigate(-1)}
                confirmLabel="취소"
                confirmColor="#e05c5c"
                confirmLabelColor='white'
            />
        </S.Container>
    );
}