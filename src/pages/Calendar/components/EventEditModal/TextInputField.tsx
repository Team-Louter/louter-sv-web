import * as S from "./EventEditModal.styled";

export interface TextInputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showLetterCount?: number;
    maxLength?: number;
}

// 한 줄 입력 필드
export function TextInputField({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    showLetterCount,
}: TextInputFieldProps) {
    // 최대 글자 수 넘으면 입력 안 되게 막기
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (showLetterCount && newValue.length > showLetterCount) {
            return;
        }
        onChange(newValue);
    };

    return (
        <S.ForRow>
            <S.Name>{label}</S.Name>
            <S.ForColumn>
                <S.Input 
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                />
                {showLetterCount && (
                    <S.LetterCount>{value.length}/{showLetterCount}</S.LetterCount>
                )}
            </S.ForColumn>
        </S.ForRow>
    );
}

// 여러 줄 입력 필드
export function TextAreaField({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    showLetterCount,
}: TextInputFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (showLetterCount && newValue.length > showLetterCount) {
            return;
        }
        onChange(newValue);
    };

    return (
        <S.ForRow>
            <S.Name>{label}</S.Name>
            <S.ForColumn>
                <S.TextArea 
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                />
                {showLetterCount && (
                    <S.LetterCount>{value.length}/{showLetterCount}</S.LetterCount>
                )}
            </S.ForColumn>
        </S.ForRow>
    );
}