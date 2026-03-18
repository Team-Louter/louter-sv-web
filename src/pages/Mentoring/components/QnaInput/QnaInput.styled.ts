import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
  background-color: ${token.colors.background.white};
`;

export const TextareaWrapper = styled.div`
  overflow-y: auto;
  max-height: calc(3 * 1.5em + 1.25rem);
  padding: 0.625rem 1rem 0;
`;

export const Input = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  line-height: 1.5;
  box-sizing: border-box;
  ${token.typography("body", "sm", "medium")}
  color: ${token.colors.text.normal};
  background: transparent;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  flex-shrink: 0;
  gap: 0.75rem;
`;

export const ToolLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ToolRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${token.shapes.small};

  &:hover {
    background-color: ${token.colors.background.lightGray};
  }
`;

export const CharCount = styled.span<{ $isOver: boolean }>`
  ${token.typography("body", "sm", "medium")}
  color: ${({ $isOver }) => ($isOver ? token.colors.state.errorSoft : token.colors.text.disabled)};
`;

export const ImagePreviewArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 1rem 0;
`;

export const ImagePreviewItem = styled.div`
  position: relative;
  width: clamp(4rem, 9vw, 4.5rem);
  height: clamp(4rem, 9vw, 4.5rem);
  flex-shrink: 0;
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${token.shapes.small};
  border: 1px solid ${token.colors.line.normal};
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: -0.1875rem;
  right: -0.1875rem;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  border: none;
  background-color: ${token.colors.text.normal};
  color: ${token.colors.background.white};
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const TrashIcon = styled.img`
  width: 0.6875rem;
`;
