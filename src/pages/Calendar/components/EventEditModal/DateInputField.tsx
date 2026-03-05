import { useRef } from "react";
import { CiCalendar } from "react-icons/ci";
import * as S from "./EventEditModal.styled";

export interface DateInputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
  }

export default function DateInputField({ label, value, onChange, placeholder = "YYYY-MM-DD", error }: DateInputFieldProps) {
    const dateInputRef = useRef<HTMLInputElement>(null);

    // 보이지 않는 날짜 선택기와 날짜 선택칸 연결
    const handleClick = () => {
        dateInputRef.current?.showPicker();
    };

    // 날짜 변경
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <S.ForRow>
            <S.Name>{label}</S.Name>
            <S.ForColumn>
                <S.ForPosition>
                    <S.CalendarIconWrapper>
                        <CiCalendar />
                    </S.CalendarIconWrapper>
                    <S.DateInput 
                        value={value}
                        placeholder={placeholder}
                        onClick={handleClick}
                        readOnly
                        $hasError={!!error}
                    />
                    <S.HiddenDateInput
                        ref={dateInputRef}
                        type="date"
                        value={value}
                        onChange={handleChange}
                    />
                </S.ForPosition>
                {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
            </S.ForColumn>
        </S.ForRow>
    );
}