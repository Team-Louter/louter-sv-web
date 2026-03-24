import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Background = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    ${token.flexCenter};
    z-index: 1100;
`

export const Container = styled.div`
    width: 37%;
    height: content-fit;
    min-width: 400px;
    background-color: ${token.colors.background.white};
    border-radius: ${token.shapes.large};
    padding: 40px;
    gap: 13px;
    ${token.flexColumn};
`

export const ModalTitle = styled.h2`
    ${token.typography('heading', 'md', 'semibold')};
    color: #181F29;
    margin-bottom: 25px;
`

export const ForRow = styled.div`
    ${token.flexBetween};
    width: 100%;
    align-items: flex-start;
`

export const Name = styled.span`
    ${token.typography('body', 'md', 'medium')};
    color: ${token.colors.fill.slate};
    padding-top: 6px;
    white-space: nowrap;
    width: 90px;
`

export const ForColumn = styled.div`
    ${token.flexColumn}
    width: 80%;
`

export const ForPosition = styled.div`
    position: relative;
    width: 100%;
`

export const Input = styled.input`
    border: 1px solid ${token.colors.line.light};
    width: 100%;
    height: 35px;
    border-radius: 5px;
    padding-left: 10px;
    ${token.typography('body', 'sm', 'medium')};

    &:focus {
        outline-color: ${token.colors.line.highlight}
    }

    &::placeholder {
        color: ${token.colors.text.coolGray}
    }
`

export const DateInput = styled(Input)<{ $hasError?: boolean }>`
    padding-left: 40px;
    border-color: ${props => props.$hasError ? '#ef4444' : token.colors.line.light};
    ${token.typography('body', 'sm', 'medium')};

    &:focus {
        outline-color: ${token.colors.line.highlight}
    }
`

export const CalendarIconWrapper = styled.div`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 20px;
    display: flex;
    align-items: center;
`

export const HiddenDateInput = styled.input`
    opacity: 0;
    position: absolute;
    right: 12px;
    top: 50%;
`

export const ErrorMessage = styled.span`
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
`

export const LetterCount = styled.span`
    font-size: 13px;
    align-self: flex-end;
`

export const ColorContainer = styled.div`
    width: 80%;
    height: 20px;
    align-self: center;
    ${token.flexRow}
    gap: 10px;
`

export const Color = styled.div`
    height: 20px;
    width: 20px;
    border-radius: 50%;
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

export const Buttons = styled.div`
    width: 100%;
    height: 35px;
    margin-top: 20px;
    ${token.flexRight};
    gap: 20px;
`

export const CancelButton = styled.button`
    height: 35px;
    min-width: 70px;
    width: 100px;
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.normal};
    border-radius: 4px;
    ${token.typography('body', 'sm', 'bold')};
    color: ${token.colors.text.dark};
`

export const ConfirmButton = styled.button<{ $isValid: boolean }>`
    height: 35px;
    min-width: 70px;
    width: 100px;
    background-color: ${token.colors.background.yellow};
    border: 1px solid ${token.colors.line.highlight};
    border-radius: 4px;
    ${token.typography('body', 'sm', 'bold')};
    color: ${token.colors.text.dark};
    opacity: ${({ $isValid }) => $isValid ? 1 : 0.5};
    cursor: ${({ $isValid }) => $isValid ? 'pointer' : 'not-allowed'};
`

export const DeleteButton = styled.button`
    height: 35px;
    min-width: 70px;
    width: 100px;
    background-color: ${token.colors.calendar.red};
    border: 1px solid ${token.colors.calendar.red};
    border-radius: 4px;
    ${token.typography('body', 'sm', 'bold')};
    color: ${token.colors.text.white};
    margin-right: auto;
`