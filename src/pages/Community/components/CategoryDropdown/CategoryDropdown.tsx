import { useRef, useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import * as S from "./CategoryDropdown.styled";
import type { CategoryDropdownProps } from "@/types/community";

export default function CategoryDropdown({ options, selected, onChange, placeholder = "선택해주세요." }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 여부
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 드롭다운 밖 클릭 시 드롭다운 닫기
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <S.DropdownWrapper ref={dropdownRef}>
            <S.DropdownSelected onClick={() => setIsOpen((prev) => !prev)}>
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