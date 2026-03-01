import styled from "styled-components";
import * as token from "@/styles/values/token";
import { GoKebabHorizontal } from "react-icons/go";

export const Container = styled.div`
    width: 100%;
    min-height: 70px;
    ${token.flexColumn};
    margin-top: 10px;
`

export const ForRow = styled.div`
    ${token.flexBetween};
`

export const Div = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 10px;
`

export const ProfileImg = styled.img`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    align-self: flex-start;
    flex-shrink: 0;
`

export const ForColumn = styled.div`
    ${token.flexColumn};
    justify-content: space-between;
    height: 100%;
    gap: 5px;
`

export const Name = styled.span`
    ${token.typography('body', 'sm', 'semibold')};
    color: ${token.colors.text.normal};
`

export const CommentContent = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: ${token.colors.text.normal};
`

export const UploadTime = styled.span`
    ${token.typography('caption', 'lg', 'regular')};
    color: ${token.colors.text.neutral};
`

export const WriteButton = styled.button`
    ${token.typography('caption', 'lg', 'regular')};
    color: ${token.colors.text.neutral};
`

export const ReplyButton = styled.button`
    ${token.typography('caption', 'lg', 'regular')};
    color: ${token.colors.text.neutral};
    align-self: flex-start;
`

export const ArrowIcon = styled.span<{ $isOpen: boolean }>`
    display: inline-flex;
    font-size: 13px;
    color: ${token.colors.text.dark};
    transition: transform 0.3s;
    transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(270deg)'};
`;

export const KebabWrapper = styled.div`
    position: relative;
`

export const KebabIcon = styled(GoKebabHorizontal)`
    transform: rotate(90deg);
    cursor: pointer;
    flex-shrink: 0;
`