import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div<{ $isPinned?: boolean }>`
    background-color: ${token.colors.background.white};
    width: 100%;
    height: 140px;
    border: 1px solid ${({ $isPinned }) => $isPinned ? token.colors.line.highlight : token.colors.line.normal};
    border-radius: ${token.shapes.medium};
    ${token.elevation("black_2")};
    ${token.flexRow};
    padding: 18px 25px;
    flex-shrink: 0;
    cursor: pointer;
`

export const ForColumn = styled.div`
    ${token.flexColumn};
    justify-content: space-between;
    width: 100%;
`

export const ForRow = styled.div`
    ${token.flexRow};
    align-items: center;
    gap: 13px;
    width: 100%;
`

export const Category = styled.span`
    ${token.typography('caption', 'lg', 'semibold')};
    color: ${token.colors.text.gold};
    border: 1px solid ${token.colors.line.highlight};
    border-radius: 100px;
    ${token.flexCenter};
    padding: 0px 10px;
    height: 25px;
`

export const Title = styled.h5`
    ${token.typography('heading', 'md', 'semibold')};
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

export const Content = styled.span`
    ${token.typography('caption', 'lg', 'medium')};
    color: ${token.colors.text.neutral};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

export const LikeCount = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: #FF3535
`

export const CommentCount = styled.span`
    ${token.typography('body', 'sm', 'medium')};
    color: ${token.colors.text.gold};
`

export const Img = styled.div`
    height: 100%;
    aspect-ratio: 1;
    border-radius: ${token.shapes.small};
`