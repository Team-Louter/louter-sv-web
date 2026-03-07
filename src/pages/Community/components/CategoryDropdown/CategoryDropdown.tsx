import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import * as S from "./CategoryDropdown.styled";
import { useClickOutside } from "@/hooks/useClickOutside";

interface CategoryDropdownProps {
    options: string[];
    selected: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function CategoryDropdown({ options, selected, onChange, placeholder = "선택해주세요." }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 여부
    const dropdownRef = useClickOutside(() => setIsOpen(false));

    return (
        <S.DropdownWrapper ref={dropdownRef}>
            <S.DropdownSelected
                $isDisabled={options.length === 0}
                onClick={() => {
                    if (options.length === 0) return;
                    setIsOpen((prev) => !prev);
                }}
            >
                <S.SelectedText $isDisabled={options.length === 0}>
                    {selected || placeholder}
                </S.SelectedText>
                <S.ArrowIcon $isOpen={isOpen}>
                    <IoIosArrowDown size={18} />
                </S.ArrowIcon>
            </S.DropdownSelected>
            {isOpen && options.length > 0 && (
                <S.DropdownList>
                    {options.map((option) => (
                        <S.DropdownItem
                            key={option}
                            $isSelected={option === selected}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </S.DropdownItem>
                    ))}
                </S.DropdownList>
            )}
        </S.DropdownWrapper>
    );
}