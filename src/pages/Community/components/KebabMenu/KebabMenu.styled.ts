import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
    background-color: ${token.colors.background.white};
    ${token.elevation("black_3")};
    padding: 5px 15px;
    ${token.flexColumn};
    border-radius: ${token.shapes.large};
    position: absolute;
    top: 0;
    right: 100%;
    white-space: nowrap;
`

export const Label = styled.span`
    padding: 10px 15px;
    border-bottom: 1px solid ${token.colors.line.normal};
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }
`