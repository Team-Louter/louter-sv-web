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
    gap: 30px;
`

export const Title = styled.h4`
    ${token.typography('heading', 'md', 'semibold')};
    color: #15181B;
    border-bottom: 1px solid ${token.colors.line.normal};
    padding-bottom: 35px;
`

export const Category = styled.button<{ $isSelected: boolean }>`
    ${token.typography('body', 'md', 'medium')};
    color: ${({ $isSelected }) =>
        $isSelected ? token.colors.text.gold : "inherit"};
`