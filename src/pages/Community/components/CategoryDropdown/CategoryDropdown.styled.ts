import styled from "styled-components";
import * as token from "@/styles/values/token";

export const DropdownWrapper = styled.div`
    position: relative;
    width: 250px;
`

export const DropdownSelected = styled.div<{ $isDisabled: boolean }>`
    ${token.flexRow};
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background-color: ${token.colors.background.white};
    border-bottom: 1.5px solid ${token.colors.line.normal};
    cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
    ${token.typography('body', 'md', 'semibold')};
    color: ${token.colors.text.normal};
`

export const SelectedText = styled.span<{ $isDisabled: boolean }>`
    color: ${({ $isDisabled }) =>
        $isDisabled ? token.colors.text.disabled : token.colors.text.normal};
`

export const ArrowIcon = styled.span<{ $isOpen: boolean }>`
    display: flex;
    align-items: center;
    color: ${token.colors.line.normal};
`

export const DropdownList = styled.ul`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    height: content-fit;
    max-height: 150px;
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.normal};
    border-radius: ${token.shapes.medium};
    overflow-y: scroll;
    z-index: 100;
    color: ${token.colors.text.normal};
`

export const DropdownItem = styled.li<{ $isSelected: boolean }>`
    padding: 7px 15px;
    ${token.typography('body', 'md', 'semibold')};
    color: ${token.colors.text.normal};
    background-color: ${({ $isSelected }) =>
        $isSelected ? token.colors.accent.assistive3 : token.colors.background.white};
    cursor: pointer;
    border-bottom: 1px solid ${token.colors.line.normal};

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${token.colors.fill.yellow ?? "#FAFAE8"};
    }
`