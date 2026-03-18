import styled from "styled-components";
import * as token from "@/styles/values/token";

export const CommentRow = styled.div<{ $isReply?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  margin-left: ${({ $isReply }) => ($isReply ? 2.5 : 0)}rem;
  margin-bottom: 1.25rem;
`;

export const ProfileGroup = styled.div`
  width: 2.1875rem;
  display: flex;
  justify-content: center;
`;

export const Avatar = styled.img<{ $isReply?: boolean }>`
  width: ${({ $isReply }) => ($isReply ? 1.75 : 2.1875)}rem;
  height: ${({ $isReply }) => ($isReply ? 1.75 : 2.1875)}rem;
  border-radius: ${token.shapes.xlarge};
  object-fit: cover;
`;

export const ContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  user-select: text;
`;

export const UserName = styled.div`
  ${token.typography("caption", "lg", "semibold")}
`;

export const CommentMetaRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
`;

export const CommentText = styled.div<{ $isRoot?: boolean }>`
  background-color: ${token.colors.background.white};
  ${token.typography("body", "sm", "medium")}
  border: 1px solid
    ${({ $isRoot }) =>
      $isRoot ? token.colors.main.alternative : token.colors.line.normal};

  border-radius: ${token.shapes.medium};
  overflow: hidden;
  max-width: 705px;
`;

export const CommentTextInner = styled.div<{ $hasImages?: boolean }>`
  padding: ${({ $hasImages }) =>
    $hasImages ? "0 15px 10px" : "10px 15px"};
`;

export const BlockCodeWrapper = styled.div`
  overflow: hidden;
`;

export const Time = styled.div`
  ${token.typography("body", "sm", "medium")}
  color: ${token.colors.text.disabled};
  white-space: nowrap;
`;

export const InlineCode = styled.code`
  background-color: ${token.colors.text.normal};
  color: ${token.colors.background.white};
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Fira Code", "Courier New", monospace;
  font-size: 0.9em;
`;

export const AttachedImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 15px;
`;

export const AttachedImage = styled.img`
  max-width: 300px;
  max-height: 400px;
  width: auto;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
  cursor: pointer;
`;

export const ImageModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ImageModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
`;

export const ModalImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 90vh;
  border-radius: 16px;
`;
