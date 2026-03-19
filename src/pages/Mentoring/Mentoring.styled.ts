import styled from "styled-components";
import * as token from "@/styles/values/token";

export const body = styled.div`
  width: 100%;
  min-height: calc(100dvh - 5rem);
  ${token.flexColumn}
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem;
  background-color: ${token.colors.background.lightGray};
`

export const container = styled.div`
  display: grid;
  grid-template-columns: clamp(27rem, 32vw, 29.3125rem) minmax(0, 1fr);
  gap: 1.25rem;
  width: min(87.5rem, 100%);
  min-height: 0;

  @media (max-width: 72rem) {
    grid-template-columns: 1fr;
  }
`
export const LeftArea = styled.div`
  ${token.flexColumn}
  gap: 1.25rem;
  min-width: 0;
`
export const RightContainer = styled.div`
  flex: 1;
  min-width: 0;
  height: clamp(45rem, 82dvh, 54rem);
  padding: 1.25rem;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  ${token.flexColumn}
  gap: 0.625rem;
  background-color: ${token.colors.background.white};
`

export const QnaListWrapper = styled.div`
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0;
  padding-left: 4px;
`

export const AvatarQnaContainer = styled.div`
  width: 100%;
  min-width: 0;
  ${token.flexColumn}
  background-color: ${token.colors.fill.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  padding: 1.25rem;
  gap: 0.625rem;
  ${token.typography("heading", "sm", "semibold")}
  overflow: hidden;
`
export const AvatarContainer = styled(AvatarQnaContainer)`
  height: clamp(18rem, 32dvh, 21rem);
`
export const QnaContainer = styled(AvatarQnaContainer)`
  height: clamp(26rem, 48dvh, 31rem);
`
export const QuestionListScroll = styled.div`
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0;
`

export const AvatarListScroll = styled.div`
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0;
`

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${token.shapes.small};
  padding: 0;

  &:hover {
    background-color: ${token.colors.background.lightGray};
  }
`;

export const AddIcon = styled.img`
  width: 1.1875rem;
  height: 1.1875rem;
`;

const FlexRow = styled.div`
  ${token.flexRow}
  align-items: center;
`

export const TitleAddContainer = styled(FlexRow)`
  justify-content: space-between;
`

export const TopActionRow = styled(FlexRow)`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  gap: 0.75rem;
`

export const EndContainer = styled(FlexRow)`
  grid-column: 2;
  justify-content: center;
`
export const AddContainer = styled(FlexRow)`
  grid-column: 3;
  justify-content: flex-end;
`

export const CategoryWrap = styled.div`
  ${token.flexColumnCenter}
  ${token.typography("body", "sm", "medium")}
  gap: 0.625rem;
  color: ${token.colors.text.disabled};
`

export const EndWrap = styled.div`
  padding: 0.625rem 1.25rem;
  ${token.flexRow}
  align-items: center;
  gap: 0.625rem;
  ${token.typography("body", "sm", "medium")}
  color: ${token.colors.text.disabled};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.medium};
`

export const End = styled.button`
  background-color: ${token.colors.main.alternative};
  color: ${token.colors.background.white};
  ${token.typography("caption", "md", "semibold")}
  border-radius: ${token.shapes.xsmall};
  padding: 0.5rem 0.9375rem;
`

export const EmptyText = styled.p`
  color: #aaa;
  font-size: 0.875rem;
  text-align: center;
  padding: 1.25rem 0;
  ${token.typography("body", "sm", "medium")}
`;
