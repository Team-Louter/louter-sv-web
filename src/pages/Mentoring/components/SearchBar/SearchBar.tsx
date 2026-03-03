import * as S from './style/SearchBar.styled';
import SearchIcon from '../../../../assets/mentoringImg/search.png';
import SearchCancelIcon from '../../../../assets/mentoringImg/cancel.png';
import { useSearch } from "./model/useSearch";

interface SearchProps {
  onSearch?: (value: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const { input, onChange, cancelSearch } = useSearch();

  const handleSearch = () => {
    onSearch?.(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCancel = () => {
    cancelSearch();
    onSearch?.("");
  };

  return (
    <S.SearchInputWrapper>
      <S.LeftIconContainer>
        <S.IconButton onClick={handleSearch}>
          <S.Icon src={SearchIcon} />
        </S.IconButton>
      </S.LeftIconContainer>
  
      <S.SearchInput
        value={input}
        onChange={onChange}
        placeholder="이름이나 학번을 입력하세요."
        onKeyDown={handleKeyPress}
      />
  
      <S.RightIconContainer>
        {input && (
          <S.IconButton onClick={handleCancel}>
            <S.Icon src={SearchCancelIcon} />
          </S.IconButton>
        )}
      </S.RightIconContainer>
    </S.SearchInputWrapper>
  );
};


export default Search;
