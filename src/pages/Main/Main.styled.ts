import { flexColumn, flexRow } from "@/styles/values/_flex";
import styled from "styled-components";

export const Container = styled.div`
    height: calc(100vh - 60px);
    width: 100%;
    ${flexRow};
    gap: 2%;
    justify-content: center;
    padding-top: 2%;
`

export const CalendarDiv = styled.div`
    height: 88%;
    width: 60%;
`

export const ForColumn = styled.div`
    ${flexColumn};
    width: 25%;
    gap: 4%
`