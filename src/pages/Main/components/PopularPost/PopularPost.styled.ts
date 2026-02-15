import styled from "styled-components";
import * as token from "@/styles/values/token";

export const PopularContainer = styled.div`
    ${token.flexColumn};
    height: 49%;
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    ${token.elevation("black_2")};
`

export const PopularTitle = styled.h2`
    ${token.typography("body", "md", "bold")};
    margin: 20px 0px 10px 20px;
`