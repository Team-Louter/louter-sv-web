import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
    background-color: ${token.colors.background.lightGray};
    width: 100%;
    min-height: calc(100vh - 60px);
    height: fit-content;
    ${token.flexColumn};
    align-items: center;
    padding: 55px 0px;
    gap: 20px;
`

export const Top = styled.div`
    width: 90%;
    height: 230px;
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.normal};
    border-radius: ${token.shapes.xlarge};
    padding: 35px 50px;
    ${token.flexColumn};
    justify-content: space-between;
`

export const ForRow = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 13px;
    width: 100%;
`

export const TitleLabel = styled.span`
    color: ${token.colors.text.gold};
    ${token.typography('heading', 'sm', 'medium')};
`

export const Div = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 5px;
`

export const Confirm = styled.button`
    color: ${token.colors.text.normal};
    ${token.typography('body', 'md', 'semibold')};
    ${token.flexCenter};
    width: 70px;
    height: 35px;
    background-color: ${token.colors.background.yellow};
    border-radius: ${token.shapes.small};
    margin-right: 3px;
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

export const Title = styled.input`
    background-color: ${token.colors.fill.normal};
    width: 100%;
    ${token.elevation('black_1')};
    outline: none;
    border: none;
    border-radius: ${token.shapes.medium};
    ${token.typography('heading', 'sm', 'semibold')};
    padding: 10px 20px;
    color: ${token.colors.text.neutral};

    &::placeholder {
        color: ${token.colors.text.neutral};
    }
`

export const MainContainer = styled.div`
    width: 90%;
    min-height: 100vh;
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.normal};
    border-radius: ${token.shapes.xlarge};
    padding: 40px;
    ${token.flexColumn};
    align-items: center;
    gap: 10px;
`

export const WriteContainer = styled.div`
    width: 100%;
    flex: 1;
    ${token.flexRow};
`

export const Write = styled.textarea`
    width: 50%;
    flex: 1;
    border: none;
    outline: none;
    border-right: 1px solid ${token.colors.line.normal};
    padding: 12px 16px;
    resize: none;
    font-size: 14px;
    line-height: 1.7;
    color: ${token.colors.text.normal};

    &::placeholder {
        color: ${token.colors.text.neutral};
    }
`

export const PreviewWrapper = styled.div`
    width: 50%;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${token.colors.line.normal};
`

export const Counter = styled.span<{ $isOver: boolean }>`
    align-self: flex-end;
    font-size: 12px;
    color: ${({ $isOver }) => $isOver ? token.colors.state.error : token.colors.text.neutral};
    flex-shrink: 0;
`

export const Preview = styled.div`
    flex: 1;
    padding: 12px 16px;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.7;
    color: ${token.colors.text.normal};

    p {
        margin: 0.3em 0;
    }

    h1 {
        font-size: 1.5em;
        font-weight: 700;
        margin: 0.6em 0 0.3em;
    }

    h2 {
        font-size: 1.25em;
        font-weight: 700;
        margin: 0.6em 0 0.3em;
    }

    strong {
        font-weight: 700;
    }

    em {
        font-style: italic;
    }

    ul {
        list-style-type: disc;
        padding-left: 1.5em;
        margin: 0.4em 0;
    }

    ol {
        list-style-type: decimal;
        padding-left: 1.5em;
        margin: 0.4em 0;
    }

    li {
        margin: 2px 0;
    }

    blockquote {
        border-left: 3px solid ${token.colors.line.highlight};
        margin: 0.4em 0;
        padding: 4px 0 4px 12px;
        color: ${token.colors.text.neutral};
    }

    code {
        background-color: ${token.colors.fill.normal};
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
    }

    pre {
        background-color: ${token.colors.fill.normal};
        padding: 12px 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 0.4em 0;
    }

    pre code {
        background: none;
        padding: 0;
    }

    hr {
        border: none;
        border-top: 1px solid ${token.colors.line.normal};
        margin: 12px 0;
    }

    a {
        color: ${token.colors.text.gold};
        text-decoration: underline;
    }

    img {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: 8px;
    }
`