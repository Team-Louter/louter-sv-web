import styled from "styled-components";
import * as token from "@/styles/values/token";

export const body = styled.div`
  width: 100%;
  height: 92vh;
  ${token.flexColumn}
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: ${token.colors.background.lightGray};
`

export const container = styled.div`
  ${token.flexRow}
  gap: 20px;
  width: 1400px;
`
export const LeftArea = styled.div`
  ${token.flexColumn}
  gap: 20px;
`
export const RightContainer = styled.div`
  flex: 1;
  min-width: 0; 
  height: 705px;
  padding: 20px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  ${token.flexColumn}
  gap: 10px;
  background-color: ${token.colors.background.white};
`

export const QnaListWrapper = styled.div`
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0;
  padding-left: 4px;
`

export const AvatarQnaContainer = styled.div`
  min-width: 400px;
  width: fit-content;
  ${token.flexColumn}
  background-color: ${token.colors.fill.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  padding: 20px;
  gap: 10px;
  ${token.typography("heading", "sm", "semibold")}
`
export const AvatarContainer = styled(AvatarQnaContainer)`
  height: 265px;
`
export const QnaContainer = styled(AvatarQnaContainer)`
  height: 420px;
`
export const QuestionListScroll = styled.div`
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0;
`

export const AddButton = styled.img`
  width: 19px;
  height: 19px;
`

const FlexRow = styled.div`
  ${token.flexRow}
  align-items: center;
`

export const TitleAddContainer = styled(FlexRow)`
  justify-content: space-between;
`

export const EndContainer = styled(FlexRow)`
  justify-content: center;
`
export const AddContainer = styled(FlexRow)`
  justify-content: flex-end;
`

export const CategoryWrap = styled.div`
  ${token.flexColumnCenter}
  ${token.typography("body", "sm", "medium")}
  gap: 10px;
  color: ${token.colors.text.disabled};
`

export const EndWrap = styled.div`
  padding: 10px 20px;
  ${token.flexRow}
  align-items: center;
  gap: 10px;
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
  padding: 8px 15px;
`