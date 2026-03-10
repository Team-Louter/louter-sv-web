import styled from "styled-components";
import * as token from "@/styles/values/token"

export const Container = styled.div`
    height: calc(100vh - 60px);
    width: 100%;
    ${token.flexColumn};
`

export const Scroll = styled.div`
    height: 100%;
    width: 100%;
    ${token.flexRow};
    gap: 2%;
    justify-content: center;
    padding-top: 2%;
    flex-shrink: 0;
`

export const CalendarDiv = styled.div`
    height: 88%;
    width: 60%;
`

export const ForColumn = styled.div`
    ${token.flexColumn};
    width: 25%;
    gap: 4%
`

export const Line = styled.div`
    width: 100%;
    border: 0.5px solid ${token.colors.line.light};
`

export const Footer = styled.div`
    ${token.flexColumnCenter};
    height: 250px;
    flex-shrink: 0;
`

export const Louter = styled.span`
    color: ${token.colors.text.coolGray};
`

export const Github = styled.span`
    ${token.typography('body', 'sm', 'semibold')};
    color: ${token.colors.text.dark};
    margin-top: 10px;
`