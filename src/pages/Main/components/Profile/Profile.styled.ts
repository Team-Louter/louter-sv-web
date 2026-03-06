import styled, { keyframes, css } from "styled-components";
import * as token from "@/styles/values/token"

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

export const ProfileContainer = styled.div`
    ${token.flexColumn};
    height: 35%;
    border: 1px solid ${token.colors.line.light};
    border-radius: ${token.shapes.xsmall};
    ${token.elevation("black_2")};
`
export const ProfileInfoIn = styled.div`
    ${token.flexRow};
    align-items: center;
    border-bottom: 2px solid ${token.colors.line.highlight};
    height: 100%;
    width: 90%;
    justify-content: space-between;
`

export const ProfileInfoOut = styled.div`
    height: 38%;
    width: 100%;
    ${token.flexCenter};
`

export const ForRow = styled.div`
    ${token.flexRow};
    height: 100%;
    gap: 15px;
    align-items: center;
`

export const ProfileImgDiv = styled.div<{ $isLoading?: boolean }>`
    height: 60%;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid ${token.colors.line.normal};
    overflow: hidden;
    ${({ $isLoading }) => $isLoading && css`
        background-color: #e0e0e0;
        animation: ${pulse} 1.5s ease-in-out infinite;
        border: none;
    `}
`

export const ProfileImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
`

export const BasicProfile = styled.div`
    ${token.flexColumn};
`

export const Name = styled.h3`
    ${token.typography("heading", "sm", "bold")};
    color: ${token.colors.text.dark};
`

export const School = styled.h6`
    ${token.typography("body", "sm", "medium")};
    color: ${token.colors.text.dark};
`

export const MyProfile = styled.button`
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.text.lightGray};
    padding: 10px 20px;
    border-radius: 4px;
    ${token.typography("body", "sm", "bold")};
`

export const MyPostTitle = styled.h2`
    ${token.typography("body", "md", "bold")};
    margin: 20px 0px 10px 20px;
`

export const PostSkeleton = styled.div`
    height: 80px;
    width: 90%;
    margin: 10px auto 0;
    border-radius: ${token.shapes.xsmall};
    background-color: #e0e0e0;
    animation: ${pulse} 1.5s ease-in-out infinite;
`