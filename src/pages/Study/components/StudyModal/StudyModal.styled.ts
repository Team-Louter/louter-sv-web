import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Container = styled.div`
  width: 40%;
  height: 600px;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
  padding: 30px;
  ${token.flexColumn};
  gap: 10px;
  position: relative;
`

export const TitleCancelContainer = styled.div`
  ${token.flexRow}
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.span`
  ${token.typography("body", "lg", "semibold")}
`;

export const Cancel = styled.img`
  width: 19px;
  height: 19px;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  width: 19px;
  height: 19px;
`;

export const KebabWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${token.typography("caption", "lg", "medium")}
`;

export const KebabIcon = styled.div`
  ${token.flexColumn}
  gap: 2px;
  padding: 5px;
  div {
    width: 3px;
    height: 3px;
    background-color: ${token.colors.text.neutral};
    border-radius: 50%;
  }
`;

export const InputContainer = styled.textarea<{ $isReadOnly?: boolean }>`
  width: 100%;
  flex: 1;
  border-radius: ${token.shapes.medium};
  resize: none;
  padding: 12px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: ${props => props.$isReadOnly ? token.colors.fill.assistive : token.colors.fill.normal};
  border: ${props => props.$isReadOnly ? `1px solid ${token.colors.line.normal}` : 'none'};
  ${token.typography("body", "sm", "medium")}
  &:focus {
    outline: none;
  }
`
export const CharCount = styled.span`
  width: 100%;
  text-align: right;
  font-size: 12px;
  color: gray;
  margin: 4px 0 0 0;
`

export const StudyInputContainer = styled.div`
  width: 100%;
  ${token.flexColumn}
  gap: 5px;
`

export const StudyTitleInput = styled.input`
  width: 100%;
  border: none;
  ${token.typography("body", "md", "semibold")};
  &:focus {
    outline: none;
  }
`

export const StudyInputdivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${token.colors.line.normal};
`

export const ButtonContainer = styled.div`
  ${token.flexRow}
  width: 100%;
  gap: 10px;
  button {
    flex: 1;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${token.colors.main.alternative};
  ${token.typography("body", "sm", "medium")}
  border-radius: ${token.shapes.medium};
  cursor: pointer;
  border: none;
`

export const CancelButton = styled.button`
  padding: 10px;
  background-color: ${token.colors.fill.neutral};
  color: ${token.colors.text.neutral};
  ${token.typography("body", "sm", "medium")}
  border-radius: ${token.shapes.medium};
  cursor: pointer;
  border: none;
`

export const DeleteButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${token.colors.state.errorSoft};
  color: ${token.colors.main.white};
  ${token.typography("body", "sm", "medium")}
  border-radius: ${token.shapes.medium};
  cursor: pointer;
  margin-bottom: 5px;
`
