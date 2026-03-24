import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
    ${token.flexColumn};
    align-items: center;
    gap: 10px;
    width: 100%;
`

export const MarkdownContainer = styled.div`
    width: 69%;
    min-width: 400px;
    min-height: 100px;
    background-color: ${token.colors.fill.normal};
    border-radius: ${token.shapes.large};
    border: 1px solid ${token.colors.line.normal};
    padding: 12px 25px;
    ${token.flexRow};
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
`

export const ForColumn = styled.div`
    ${token.flexColumnCenter};
    gap: 3px;
`

export const MarkdownButton = styled.button`
    width: 50px;
    height: 50px;
    background-color: ${token.colors.background.white};
    border-radius: ${token.shapes.xsmall};
    ${token.flexCenter};
`

export const MarkdownLabel = styled.span`
    ${token.typography('body', 'sm', 'regular')};
    color: ${token.colors.text.neutral};
`

export const Guide = styled.span`
    color: ${token.colors.text.disabled};

    @media (max-width: 700px) {
        ${token.typography('caption', 'lg', 'regular')};
    }
`