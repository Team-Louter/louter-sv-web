import styled from "styled-components";
import * as token from "@/styles/values/token";
import { GoKebabHorizontal } from "react-icons/go";

export const Container = styled.div`
    background-color: ${token.colors.background.lightGray};
    width: 100%;
    height: calc(100vh - 60px);
    overflow-y: scroll;  
`

export const ForCenter = styled.div`
    ${token.flexRow};
    gap: 20px;
    width: 90%;
    padding: 55px 0px;
    margin: 0 auto;
`

export const PostContainer = styled.div`
    background-color: ${token.colors.background.white};
    width: 84%;
    min-height: 100%;
    height: fit-content;
    border-radius: ${token.shapes.xlarge};
    border: 1px solid ${token.colors.line.normal};
    ${token.flexColumn};
    padding: 50px;
    gap: 20px;
`

export const TopContainer = styled.div`
    width: 100%;
    height: 130px;
    ${token.flexColumn};
    justify-content: space-between;
`

export const ForRow = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 13px;
    width: 100%;
`

export const Category = styled.span`
    color: ${token.colors.text.gold};
    ${token.typography('heading', 'sm', 'medium')};
`

export const Title = styled.h5`
    ${token.typography('heading', 'xl', 'semibold')};
    color: ${token.colors.text.strong};
`

export const Div = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 5px;
`

export const ViewCount = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: ${token.colors.fill.yellow};
`

export const ProfileImg = styled.img`
    width: 25px;
    height: 25px;
    border-radius: 50%;
`

export const Name = styled.span`
    ${token.typography('body', 'sm', 'semibold')};
    color: ${token.colors.text.normal}
`

export const UploadTime = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: ${token.colors.text.disabled};
`

export const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${token.colors.line.normal};
    margin: 8px 0;
`;

export const KebabWrapper = styled.div`
    position: relative;
`

export const KebabIcon = styled(GoKebabHorizontal)`
    transform: rotate(90deg);
    cursor: pointer;
`

export const ContentContainer = styled.div`
    width: 100%;
    ${token.typography('body', 'md', 'medium')};
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
`;

export const LikeCount = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: #FF3535
`

export const CommentCount = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: ${token.colors.text.gold};
`

export const Error = styled.span`
    ${token.typography('heading', 'xl', 'bold')};
    margin: auto;
`

export const CommentContainer = styled.div`
    width: 100%;
    min-height: 120px;
    ${token.flexColumn};
    gap: 10px;
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

export const LinkedEventBanner = styled.div<{ $color: string }>`
    width: 100%;
    background-color: ${token.colors.background.lightGray};
    border-left: 4px solid ${({ $color }) => $color};
    border-radius: ${token.shapes.small};
    padding: 16px 20px;
    ${token.flexColumn};
    gap: 10px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
        background-color: ${token.colors.accent.assistive4};
    }
`

export const LinkedEventHeader = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 8px;
`

export const LinkedEventTitle = styled.span`
    ${token.typography('caption', 'lg', 'semibold')};
    color: ${token.colors.text.neutral};
`

export const LinkedEventInfo = styled.div`
    ${token.flexColumn};
    gap: 4px;
    padding-left: 22px;
`

export const LinkedEventName = styled.span`
    ${token.typography('body', 'md', 'semibold')};
    color: ${token.colors.text.strong};
`

export const LinkedEventDate = styled.span`
    ${token.typography('caption', 'lg', 'medium')};
    color: ${token.colors.text.neutral};
`

export const LinkedEventAssignee = styled.span`
    ${token.typography('caption', 'lg', 'medium')};
    color: ${token.colors.text.neutral};
`

