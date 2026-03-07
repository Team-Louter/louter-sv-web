import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
    width: 15%;
    height: fit-content;
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.normal};
    border-radius: ${token.shapes.xlarge};
    ${token.flexColumnStart};
    padding: 35px;
    gap: 10px;
    flex-shrink: 0;
`

export const Title = styled.h4`
    ${token.typography('heading', 'md', 'semibold')};
    color: #15181B;
    border-bottom: 1px solid ${token.colors.line.normal};
    padding-bottom: 35px;
`

export const Category = styled.button<{ $isSelected: boolean }>`
    ${token.typography('body', 'md', 'medium')};
    background-color: ${({ $isSelected }) =>
        $isSelected ? token.colors.accent.secondary2 : "inherit"};
    width: 100%;
    height: 40px;
    border-radius: ${token.shapes.small};
    text-align: start;
    padding: 10px;

    &:hover {
        background-color: ${token.colors.accent.assistive4}
    }
`