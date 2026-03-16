import { useState } from "react";
import * as S from "./styles/QnaItem.styled";
import type { Comment } from "./types/Qna.type";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";

interface QnaItemProps {
  comment: Comment;
  isFirst?: boolean;
}

export function QnaItem({ comment, isFirst = false }: QnaItemProps) {
  const isRoot = isFirst;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <S.CommentRow $isReply={false}>
        <S.ProfileGroup>
          <S.Avatar src={comment.profileUrl} $isReply={false} />
        </S.ProfileGroup>

        <S.ContentGroup>
          <S.UserName>{comment.userName}</S.UserName>

          <S.CommentMetaRow>
            <S.CommentText $isRoot={isRoot}>
              {/* 이미지 */}
              {comment.images && comment.images.length > 0 && (
                <S.AttachedImageList>
                  {comment.images.map((url, i) => (
                    <S.AttachedImage
                      key={i}
                      src={url}
                      alt={`첨부 이미지 ${i + 1}`}
                      onClick={() => handleImageClick(url)}
                    />
                  ))}
                </S.AttachedImageList>
              )}

              {/* 마크다운 */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p({ children }) {
                    return <S.CommentTextInner>{children}</S.CommentTextInner>;
                  },
                  code({ children, className, node }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    const isBlock =
                      !!match ||
                      (node?.position?.start.line ?? 0) !==
                        (node?.position?.end.line ?? 0);

                    // 인라인 코드
                    if (!isBlock) {
                      const result = hljs.highlightAuto(codeString);
                      return (
                        <S.InlineCode
                          dangerouslySetInnerHTML={{ __html: result.value }}
                        />
                      );
                    }

                    // 블록 코드 언어 감지
                    const detectedLanguage =
                      match?.[1] ||
                      hljs.highlightAuto(codeString).language ||
                      "plaintext";

                    return (
                      <S.BlockCodeWrapper>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={detectedLanguage}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            padding: "14px 20px",
                            fontSize: "0.875rem",
                          }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </S.BlockCodeWrapper>
                    );
                  },
                }}
              >
                {comment.content}
              </ReactMarkdown>
            </S.CommentText>

            <S.Time>{comment.time}</S.Time>
          </S.CommentMetaRow>
        </S.ContentGroup>
      </S.CommentRow>

      {/* 이미지 모달 */}
      {selectedImage && (
        <S.ImageModalOverlay onClick={closeModal}>
          <S.ImageModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalImage src={selectedImage} />
          </S.ImageModalContent>
        </S.ImageModalOverlay>
      )}
    </>
  );
}
