import { useNavigate } from 'react-router-dom';
import * as S from './style';
import LogoSvg from '@/assets/Logo/Logo.svg';

function Topbar({ hidden }: { hidden: boolean }) {
  const navigate = useNavigate();

  return (
    <S.Container $hidden={hidden}>
      <S.LogoWrapper onClick={() => navigate('/')}>
        <S.Logo src={LogoSvg} alt="Louter Logo" />
      </S.LogoWrapper>

      <S.ButtonGroup>
        <S.LoginButton onClick={() => navigate('/auth/signin')}>
          로그인
        </S.LoginButton>
        <S.SignupButton onClick={() => navigate('/auth/signup/check')}>
          회원가입
        </S.SignupButton>
      </S.ButtonGroup>
    </S.Container>
  );
}

export default Topbar;
