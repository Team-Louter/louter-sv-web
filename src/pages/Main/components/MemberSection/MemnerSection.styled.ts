import styled from "styled-components";
import * as token from "@/styles/values/token";

export const MemberContainer = styled.div`
    width: 100%;
    height: content-fit;
    max-height: 140%;
    ${token.flexColumn};
    align-items: center;
    flex-shrink: 0;
`

export const Title = styled.h3`
    ${token.typography("heading", "xxl", "bold")};
    color: ${token.colors.text.dark};
    margin-top: 50px;
`

export const FilterContainer = styled.div`
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.light};
    height: 45px;
    min-width: 450px;
    border-radius: 100px;
    margin-top: 30px;
    ${token.elevation("black_2")};
    ${token.flexLeft};
    padding: 0px 15px;
    gap: 5px;
    flex-shrink: 0;
`

export const GenFilter = styled.button<{$isSelected: boolean}>`
    background-color: ${({$isSelected}) => $isSelected ? token.colors.background.yellow : token.colors.background.white};
    border: 1px solid ${({$isSelected}) => $isSelected ? token.colors.line.highlight : token.colors.line.light};
    height: 30px;
    width: 60px;
    border-radius: 100px;
    ${({$isSelected}) => $isSelected ? token.typography("body", "md", "bold") : token.typography("body", "md", "medium")};
    color: ${token.colors.text.dark};
`

export const MemberScroll = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    ${token.flexColumn};
    align-items: center;
    margin-top: 20px;
`