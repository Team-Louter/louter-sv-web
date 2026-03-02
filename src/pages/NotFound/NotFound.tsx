import { useNavigate } from 'react-router-dom';
import * as S from './NotFound.styled';
import NotFoundImg from '@/assets/NotFound/Louter404이미지.png';

function NotFound() {
  const navigate = useNavigate();

  return (
    <S.Container>
      <S.Image src={NotFoundImg} alt="404 페이지를 찾을 수 없습니다" />
      <S.Message>페이지를 찾을 수 없습니다</S.Message>
      <S.BackButton onClick={() => navigate(-1)}>돌아가기</S.BackButton>
    </S.Container>
  );
}

export default NotFound;
