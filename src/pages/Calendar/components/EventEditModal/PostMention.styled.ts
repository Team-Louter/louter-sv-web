import styled from "styled-components";
import * as token from "@/styles/values/token";

export const MentionWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const Dropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.light};
  border-radius: 8px;
  ${token.elevation('black_2')};
  z-index: 10;
  padding: 4px 0;
`

export const DropdownItem = styled.div<{ $isActive?: boolean }>`
  padding: 10px 14px;
  cursor: pointer;
  ${token.flexRow};
  align-items: center;
  gap: 10px;
  background: ${({ $isActive }) => $isActive ? token.colors.background.lightGray : 'transparent'};

  &:hover {
    background: ${token.colors.background.lightGray};
  }
`

export const PostId = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.gold};
  flex-shrink: 0;
  min-width: 36px;
`

export const PostTitle = styled.span`
  ${token.typography('body', 'sm', 'medium')};
  color: ${token.colors.text.strong};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

export const PostCategory = styled.span`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.neutral};
  flex-shrink: 0;
`

export const EmptyMessage = styled.div`
  padding: 12px 14px;
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.text.disabled};
  text-align: center;
`

export const TextArea = styled.textarea`
  border: 1px solid ${token.colors.line.light};
  width: 100%;
  min-height: 35px;
  height: 70px;
  border-radius: 5px;
  padding: 8px 10px;
  resize: vertical;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  overflow-y: scroll;
  resize: none;
  ${token.typography('body', 'sm', 'medium')};

  &:focus {
    outline-color: ${token.colors.line.highlight}
  }

  &::placeholder {
    color: ${token.colors.text.coolGray}
  }
`
