import styled from 'styled-components';
import { elevation } from '@/styles/values/_elevation';
import AuthMainImg from '@/assets/AuthImg/AuthMainImg.png';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 72px);
  background-color: #ffffff;
  padding: 2rem;
`;

export const LoginContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 991px;
  height: auto;
  background-color: ${({ theme }) => theme.colors.main.white};
  border-radius: 20px;
  ${elevation('black_3')}
  overflow: hidden;
`;

export const AuthMainImgContainer = styled.div`
  width: 62%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${AuthMainImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const AuthContent = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  width: 38%;
  height: auto;
  padding: 3rem 2rem;
  gap: 1.5rem;
`;

export const GoogleContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 0.6rem;
`;

export const LogoImg = styled.img`
  width: auto;
  height: 32px;
  margin-bottom: 0.5rem;
`;

export const SocialTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.body.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.dark};
`;

export const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: auto;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.main.white};
  border: 1px solid ${({ theme }) => theme.colors.line.light};
  border-radius: 50px;
  font-size: ${({ theme }) => theme.typography.fontSize.body.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

export const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const Line = styled.div`
  width: 100%;
  border: 0.5px solid ${({ theme }) => theme.colors.line.light};
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${({ theme }) => theme.colors.background.white};
  align-items: flex-start;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.line.light};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.body.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.dark};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.coolGray};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.main.black};
    background-color: ${({ theme }) => theme.colors.main.white};
  }
`;
