import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
    position: relative;
    width: 100%;
`;

export const DropdownButton = styled.button<{ $isOpen: boolean; $hasSelection: boolean }>`
    width: 100%;
    height: 35px;
    padding: 5px 12px;
    border: 1px solid ${token.colors.line.light};
    border-radius: 5px;
    background-color: ${token.colors.background.white};
    ${token.flexBetween}
    align-items: center;
    cursor: pointer;
    ${token.typography('body', 'sm', 'medium')};
    color: ${props => props.$hasSelection ? token.colors.text.dark : token.colors.text.coolGray};
    text-align: left;
    transition: border-color 0.2s;

    &:hover {
        border-color: ${token.colors.line.highlight};
    }
`;

export const ArrowIcon = styled.span<{ $isOpen: boolean }>`
    font-size: 13px;
    color: ${token.colors.text.dark};
    transition: transform 0.3s;
    transform: ${props => props.$isOpen ? 'rotate(270deg)' : 'rotate(180deg)'};
`;

export const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: ${token.colors.background.white};
    border: 1px solid #DFDFDF;
    border-radius: ${token.shapes.xsmall};
    max-height: 400px;
    overflow-y: scroll;
    z-index: 5;
    padding: 12px;
    ${token.flexColumn};
    gap: 8px;
`;

export const SelectableRow = styled.div<{ $selected: boolean }>`
    ${token.flexBetween}
    align-items: center;
    padding: 5px 12px;
    transition: background 0.2s;
    border: 1px solid ${token.colors.line.light};
    border-radius: 5px;
    cursor: pointer;
    background: ${props => props.$selected ? token.colors.background.yellow : token.colors.background.white};

    &:hover {
        background: ${props => props.$selected ? token.colors.background.yellow : token.colors.fill.f5};
    }
`;

export const GenerationHeader = styled(SelectableRow)`
    width: 100%;
`;

export const MemberItem = styled(SelectableRow)`
    width: 90%;
    align-self: flex-end;
`;

export const GenerationLeft = styled.div`
    ${token.flexRow}
    align-items: center;
    gap: 12px;
    flex: 1;
    cursor: pointer;
`;

export const MemberList = styled.div`
    background: ${token.colors.background.white};
    ${token.flexColumn};
    gap: 8px;
    margin-top: 8px;
`;

export const Label = styled.span<{ $selected: boolean }>`
    ${token.typography('caption', 'lg', 'medium')};
    color: ${props => props.$selected ? token.colors.text.dark : token.colors.text.coolGray};
`;