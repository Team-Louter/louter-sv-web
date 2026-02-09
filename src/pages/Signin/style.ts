import styled from 'styled-components';
import { elevation } from '@/styles/values/_elevation';
import { flexCenter, flexColumn, flexColumnCenter } from '@/styles/values/_flex';
import { shapes } from '@/styles/values/_shape';
import { colors } from '@/styles/values/_foundation';
import { fontSize, fontWeight } from '@/styles/values/_typography';
import AuthMainImg from '@/assets/AuthImg/AuthMainImg.png';

export const Container = styled.div`
  ${flexCenter}
  min-height: calc(100vh - 72px);
  background-color: ${colors.main.white};
  padding: 2rem;
`;

export const LoginContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 991px;
  height: auto;
  background-color: ${colors.main.white};
  border-radius: ${shapes.xlarge};
  ${elevation('black_3')}
  overflow: hidden;
`;

export const AuthMainImgContainer = styled.div`
  width: 62%;
  ${flexCenter}
  background-image: url(${AuthMainImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const AuthContent = styled.div`
  ${flexColumn}
  /* justify-content: center; */
  align-items: center;
  width: 38%;
  height: auto;
  padding: 3rem 2rem;
  gap: 1.5rem;
`;

export const GoogleContent = styled.div`
  ${flexColumnCenter}
  width: 100%;
  gap: 0.6rem;
`;

export const LogoImg = styled.img`
  width: auto;
  height: 32px;
  margin-bottom: 0.5rem;
`;

export const SocialTitle = styled.h2`
  font-size: ${fontSize.body.sm};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.dark};
`;

export const GoogleButton = styled.button`
  ${flexCenter}
  gap: 0.75rem;
  width: 100%;
  height: auto;
  padding: 0.75rem 1rem;
  background-color: ${colors.main.white};
  border: 1px solid ${colors.line.light};
  border-radius: 50px;
  font-size: ${fontSize.body.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.dark};
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
  border: 0.5px solid ${colors.line.light};
`;

export const LoginForm = styled.form`
  ${flexColumn}
  gap: 0.875rem;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${colors.background.white};
  align-items: flex-start;
  justify-content: center;
  border: 1px solid ${colors.line.light};
  border-radius: 4px;
  font-size: ${fontSize.body.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.dark};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${colors.text.coolGray};
  }

  &:focus {
    outline: none;
    border-color: ${colors.main.black};
    background-color: ${colors.main.white};
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${colors.main.yellow};
  border: none;
  border-radius: 50px;
  font-size: ${fontSize.body.sm};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.dark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.accent.secondary1};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const FindAccountLink = styled.button`
  background: none;
  border: none;
  font-size: ${fontSize.caption.lg};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.dark};
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.text.dark};
    text-decoration: underline;
  }
`;

export const SignupText = styled.p`
  font-size: ${fontSize.caption.md};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.dark};
`;

export const SignupLink = styled.span`
  color: ${colors.text.gold};
  font-weight: ${fontWeight.semibold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const PolicyText = styled.p`
  font-size: ${fontSize.caption.md};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.dark};
  text-align: center;
`;

export const PolicyLink = styled.a`
  color: ${colors.text.gold};
  font-weight: ${fontWeight.semibold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
