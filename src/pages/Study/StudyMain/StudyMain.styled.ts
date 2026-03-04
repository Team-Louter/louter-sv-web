import styled from "styled-components";
import * as token from "@/styles/values/token";

export const container = styled.div`
    background-color: ${token.colors.background.lightGray};
    width: 100%;
    ${token.flexRow};
    height: calc(100vh - 60px);
    justify-content: center;
`