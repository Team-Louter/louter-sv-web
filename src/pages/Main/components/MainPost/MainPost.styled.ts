import styled from "styled-components";
import * as token from "@/styles/values/token";

export const PostContainer = styled.div`
    width: 90%;
    border-bottom: 2px solid ${token.colors.line.highlight};
    ${token.flexColumn};
    height: 80px;
    background-color: ${token.colors.background.white};
    border-radius: ${token.shapes.xsmall};
    align-self: center;
    justify-content: space-evenly;
    padding-left: 20px;
    margin-bottom: 10px;
    cursor: pointer;
`

export const Title = styled.h3`
    ${token.typography("body", "md", "medium")};
    color: ${token.colors.text.dark};
`

export const ViewsCount = styled.div`
    ${token.flexRow};
    gap: 5px;
    align-items: center;
    color: ${token.colors.fill.a0}

`

export const Views = styled.h6`
    ${token.typography("caption", "lg", "medium")};
    color: ${token.colors.fill.a0}
`