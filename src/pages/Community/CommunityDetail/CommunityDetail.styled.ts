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