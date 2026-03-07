import styled from "styled-components";
import * as token from "@/styles/values/token";

export const ForRow = styled.div`
    ${token.flexBetween};
    align-items: center;
    gap: 13px;
    width: 100%;
`

export const Div = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 5px;
`

export const ProfileImg = styled.img`
    width: 25px;
    height: 25px;
    border-radius: 50%;
    object-fit: cover;
`

export const Name = styled.span`
    ${token.typography('body', 'sm', 'semibold')};
    color: ${token.colors.text.normal}
`

export const UploadTime = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: ${token.colors.text.disabled};
`

export const CommentWrite = styled.div`
    width: 100%;
    min-height: 100px;
    border: 1px solid ${token.colors.line.normal};
    background-color: ${token.colors.fill.normal};
    border-radius: ${token.shapes.medium};
    padding: 10px;
`

export const CommentContent = styled.textarea`
    width: 100%;
    resize: none;
    ${token.typography('body', 'sm', 'regular')};
    color: ${token.colors.text.dark};
    padding: 10px;
    min-height: 1lh;
    field-sizing: content;
    outline: none;
    border: none;
    background-color: ${token.colors.fill.normal};
`

export const CheckboxLabel = styled.label`
    ${token.flexCenter};
    width: 25px;
    height: 25px;
    border-radius: ${token.shapes.xsmall};
    border: 1px solid ${token.colors.line.highlight};
    background-color: ${token.colors.background.white};
    cursor: pointer;
    flex-shrink: 0;

    input {
        display: none;
    }

    &::after {
        content: '';
        width: 5px;
        height: 10px;
        border: 2px solid ${token.colors.line.highlight};
        border-top: none;
        border-left: none;
        transform: rotate(45deg) translateY(-1px);
        transition: border-color 0.15s;
        border-color: ${token.colors.fill.alternative};
    }

    &:has(input:checked) {
        background-color: ${token.colors.fill.yellow};
    }

    &:has(input:checked)::after {
        border-color: white;
    }
`

export const Label = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: ${token.colors.text.normal};
`

export const Cancel = styled.button`
    color: ${token.colors.text.normal};
    ${token.typography('body', 'sm', 'semibold')};
    ${token.flexCenter};
    width: 70px;
    height: 30px;
    background-color: ${token.colors.background.white};
    border-radius: ${token.shapes.small};
    margin-right: 3px;
`

export const Confirm = styled.button`
    color: ${token.colors.text.normal};
    ${token.typography('body', 'sm', 'semibold')};
    ${token.flexCenter};
    width: 70px;
    height: 30px;
    background-color: ${token.colors.background.yellow};
    border-radius: ${token.shapes.small};
    margin-right: 3px;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`
