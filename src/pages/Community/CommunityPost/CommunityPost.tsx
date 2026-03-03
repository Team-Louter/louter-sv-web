import * as S from "./CommunityPost.styled";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { CATEGORIES, CATEGORY_REVERSED, CATEGORY_TAGS, CATEGORY_TAGS_REVERSED } from "@/constants/Community";
import CategoryDropdown from "../components/CategoryDropdown/CategoryDropdown";
import Markdown from "../components/Markdown/Markdown";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import { renderMarkdown } from "@/utils/Markdown/MarkdownConfig";
import { MAX_LENGTH, insertAtCursor, processListEnter } from "@/utils/Markdown/Editor";
import { createPostInfo, editPostInfo, uploadFile } from "@/api/Post";
import type { ServerFile } from "@/types/post";

export default function CommunityPost() {
    const navigate = useNavigate();
    const location = useLocation();
    const editPost = location.state?.post; // 수정할 게시글 정보

    const [selectedCategory, setSelectedCategory] = useState<string>(editPost?.category ?? ""); // 선택된 카테고리
    const [selectedTag, setSelectedTag] = useState<string>(CATEGORY_TAGS_REVERSED[selectedCategory]?.[editPost?.tag] ?? ""); // 선택된 말머리
    const [content, setContent] = useState<string>(editPost?.postContent ?? ""); // 게시글 내용
    const [title, setTitle] = useState<string>(editPost?.postTitle ?? ""); // 게시글 제목
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 게시 확인 모달 열림 여부
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false); // 게시 취소 확인 모달 열림 여부
    const [isAnonymous, setIsAnonymous] = useState<boolean>(editPost?.isAnonymous ?? false); // 익명 게시 여부
    const [attachedFiles, setAttachedFiles] = useState<ServerFile[]>(editPost?.files ?? []); // 첨부 파일
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isComposingRef = useRef(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tags = Object.keys(CATEGORY_TAGS[selectedCategory] ?? {}); // 카테고리별 말머리 모음
    const rendered = renderMarkdown(content);
    const isOverLimit = content.length >= MAX_LENGTH; // 게시글 본문 최대 길이 초과 여부
    const isPostValid = !!title.trim() && !!selectedCategory && !!content.trim(); // 모든 칸이 설정되었는지 여부
    const hasContent = !!content.trim(); // 내용에 무언가가 적혀있는지 여부

    const insert = (text: string) => insertAtCursor(content, setContent, textareaRef, text);

    // 이미지 선택 핸들러
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const blobUrl = URL.createObjectURL(file);
        insert(`![${file.name}](${blobUrl})`); 

        const { url } = await uploadFile(file); 
        setContent((prev: string) => prev.replace(blobUrl, url));
        setAttachedFiles(prev => [...prev, {
            fileUrl: url,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
        }]);

        e.target.value = "";
    };

    // 파일 선택 핸들러
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const blobUrl = URL.createObjectURL(file);
        insert(
            file.type.startsWith("video/")
                ? `[video:${file.name}](${blobUrl})`
                : `[${file.name}](${blobUrl})`
        ); // 미리보기용 blob URL 삽입

        const { url } = await uploadFile(file);
        setContent((prev: string) => prev.replace(blobUrl, url));
        setAttachedFiles(prev => [...prev, {
            fileUrl: url,
            fileName: file.name,
            fileType: file.type || (() => {
                const ext = file.name.split(".").pop()?.toLowerCase();
                const mimeMap: Record<string, string> = {
                    hwp: "application/x-hwp",
                    hwpx: "application/x-hwpx",
                };
                return mimeMap[ext ?? ""] ?? "application/octet-stream";
            })(),
            fileSize: file.size,
        }]);

        e.target.value = "";
    };

    // 글자 수 제한 초과 시 업데이트 차단
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_LENGTH) setContent(e.target.value);
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
                processListEnter(domValue, lineStartAfter, lineAfterIME, el, setContent, ulMatch, olMatch);
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
        processListEnter(content, lineStart, currentLine, el, setContent, ulMatch, olMatch);
    };

    // 게시 확인 모달에서 확인 클릭 시 
    const handleSubmit = async () => {
        // content에서 실제 첨부되어있는 파일만 필터링
        const usedFiles = attachedFiles.filter(file => content.includes(file.fileUrl));
    
        if (editPost) {
            try {
                await editPostInfo(editPost.postId, {
                    title,
                    content,
                    isAnonymous,
                    category: selectedCategory,
                    tag: CATEGORY_TAGS[selectedCategory]?.[selectedTag] ?? "",
                    files: usedFiles,
                });
                navigate(-1);
            } catch (err) {
                console.error('수정 실패', err);
            }
        } else {
            try {
                await createPostInfo({
                    title,
                    content,
                    isAnonymous,
                    category: selectedCategory,
                    tag: selectedTag
                        ? CATEGORY_TAGS[selectedCategory]?.[selectedTag] ?? null
                        : null,
                    files: usedFiles,
                });
                navigate(-1);
            } catch (err) {
                console.error('생성 실패', err);
            }
        }
    };

    // 컨펌 모달에서 확인 눌렀을 때
    const handleConfirmPost = () => {
        if (!isPostValid) return;
        handleSubmit();
        setIsModalOpen(false);
    };

    return (
        <S.Container>
            <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
            <input ref={fileInputRef} type="file" accept="video/*,application/pdf,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp" style={{ display: "none" }} onChange={handleFileSelect} />

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
                        options={Object.keys(CATEGORIES).filter((c) => c !== "전체")}
                        selected={CATEGORY_REVERSED[selectedCategory]}
                        onChange={(category: string) => {
                            setSelectedCategory(CATEGORIES[category]);
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
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
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
                    onImageClick={() => imageInputRef.current?.click()}
                    onFileClick={() => fileInputRef.current?.click()}
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