import styled from "styled-components";
import * as token from "@/styles/values/token";
import { GoKebabHorizontal } from "react-icons/go";

export const Container = styled.div`
    background-color: ${token.colors.background.lightGray};
    width: 100%;
    min-height: calc(100vh - 60px);
    height: fit-content;
    ${token.flexRow};
    justify-content: center;
    padding: 55px 0px;
`

export const ForCenter = styled.div`
    ${token.flexRow};
    gap: 20px;
    width: 90%;
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

export const ProfileImg = styled.div`
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid black;
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
`

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
    gap: 20px;
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

