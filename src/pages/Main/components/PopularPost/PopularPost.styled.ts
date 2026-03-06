import styled, { keyframes } from "styled-components";
import * as token from "@/styles/values/token";

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

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

export const PostSkeleton = styled.div`
    width: 90%;
    height: 80px;
    border-radius: ${token.shapes.xsmall};
    align-self: center;
    margin-bottom: 10px;
    background-color: #e0e0e0;
    animation: ${pulse} 1.5s ease-in-out infinite;
`