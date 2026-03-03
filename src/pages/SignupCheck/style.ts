import styled from 'styled-components';
import * as token from '@/styles/values/token';
import AuthMainImg from '@/assets/AuthImg/AuthMainImg.png';

export const Container = styled.div`
  ${token.flexCenter}
  min-height: calc(100vh - 72px);
  background-color: ${token.colors.main.white};
  padding: 2rem;
`;

export const SigninContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 1000px;
  height: auto;
  background-color: ${token.colors.main.white};
  border-radius: ${token.shapes.xlarge};
  ${token.elevation('black_3')}
  overflow: hidden;
  zoom: 0.9;
`;

export const AuthMainImgContainer = styled.div`
  width: 62%;
  ${token.flexCenter}
  background-image: url(${AuthMainImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const AuthContent = styled.div`
  ${token.flexColumn}
  align-items: center;
  width: 38%;
  height: auto;
  padding: 3rem 2rem;
  gap: 1.2rem;
`;

export const AgreementList = styled.div`
  ${token.flexColumn}
  width: 100%;
  gap: 0.6rem;
`;

export const AgreementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${token.colors.background.white};
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  accent-color: ${token.colors.main.yellow};
  cursor: pointer;
  flex-shrink: 0;
`;

export const AgreementLabel = styled.span`
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
  display: flex;
  align-items: center;
`;

export const Required = styled.span`
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.text.gold};
`;

export const PolicyBox = styled.div`
  width: 100%;
  height: 160px;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
  background-color: ${token.colors.background.white};
`;

export const PolicyBoxTitle = styled.p`
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  margin-bottom: 0.5rem;
`;

export const PolicyBoxText = styled.p`
  ${token.typography('caption', 'lg', 'regular')}
  color: ${token.colors.text.dark};
  line-height: 1.6;
  white-space: pre-line;
`;

export const GoogleContent = styled.div`
  ${token.flexColumnCenter}
  width: 100%;
  gap: 0.6rem;
`;

export const LogoImg = styled.img`
  width: auto;
  height: 32px;
  margin-bottom: 0.5rem;
`;

export const SocialTitle = styled.h2`
  ${token.typography('body', 'sm', 'medium')}
  color: ${token.colors.text.dark};
`;

export const GoogleButton = styled.button`
  ${token.flexCenter}
  gap: 0.75rem;
  width: 100%;
  height: auto;
  padding: 0.75rem 1rem;
  background-color: ${token.colors.main.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: 50px;
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
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
  border: 0.5px solid ${token.colors.line.normal};
`;

export const SigninForm = styled.form`
  ${token.flexColumn}
  gap: 0.875rem;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${token.colors.background.white};
  align-items: flex-start;
  justify-content: center;
  border: 1px solid ${token.colors.line.normal};
  border-radius: 4px;
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${token.colors.text.coolGray};
  }

  &:focus {
    outline: none;
    border-color: ${token.colors.main.black};
    background-color: ${token.colors.main.white};
  }
`;

export const Inputgap = styled.div`
  width: 100%;
  height: 0px;
`;

export const SigninButton = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${token.colors.main.yellow};
  border: none;
  border-radius: 50px;
  ${token.typography('body', 'sm', 'bold')}
  color: ${token.colors.text.dark};
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${token.colors.accent.secondary1};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const FindAccountLink = styled.button`
  background: none;
  border: none;
  ${token.typography('caption', 'lg', 'medium')}
  color: ${token.colors.text.dark};
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${token.colors.text.dark};
    text-decoration: underline;
  }
`;

export const SignupText = styled.p`
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.text.dark};
`;

export const SignupLink = styled.span`
  color: ${token.colors.text.gold};
  font-weight: ${token.fontWeight.semibold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const PolicyText = styled.p`
  ${token.typography('caption', 'md', 'medium')}
  color: ${token.colors.text.dark};
  text-align: center;
`;

export const PolicyLink = styled.a`
  color: ${token.colors.text.gold};
  font-weight: ${token.fontWeight.semibold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
