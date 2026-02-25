import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
    background-color: ${token.colors.background.lightGray};
    width: 100%;
    height: calc(100vh - 60px);
    ${token.flexCenter};
`

export const ForCenter = styled.div`
    ${token.flexRow};
    gap: 20px;
    width: 90%;
    height: 85%;
`

export const PostContainer = styled.div`
    background-color: ${token.colors.background.white};
    width: 84%;
    height: 100%;
    border-radius: ${token.shapes.xlarge};
    border: 1px solid ${token.colors.line.normal};
    ${token.flexColumn};
    padding: 50px;
    gap: 20px;
    overflow-y: scroll;
`

export const WriteButton = styled.button`
    width: 120px;
    height: 55px;
    background-color: ${token.colors.background.yellow};
    border-radius: ${token.shapes.xlarge};
    ${token.typography('body', 'md', 'semibold')};
    color: ${token.colors.text.normal};
    position: fixed;
    right: 50px;
    bottom: 70px;
`

export const PinnedSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const PinnedLabel = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: ${token.colors.text.normal}; 
    ${token.typography('heading', 'sm', 'medium')};
    ${token.flexRow};
    align-items: center;
    gap: 5px;
`;

export const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${token.colors.line.normal};
    margin: 8px 0;
`;