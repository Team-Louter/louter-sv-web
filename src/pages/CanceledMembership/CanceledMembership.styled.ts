import styled from 'styled-components';
import * as token from '@/styles/values/token';

export const Container = styled.div`
  width: 100%;
  min-height: 85vh;
  ${token.flexColumnCenter}
  gap: 2.25rem;
  background-color: ${token.colors.background.white};
  position: relative;
`;

export const Logo = styled.img`
  width: 140px;
  height: auto;
`;

export const Title = styled.h1`
  font-size: 2.6rem;
  color: ${token.colors.text.dark};
  margin: 0;
  text-align: center;
  letter-spacing: -0.5px;

  strong {
    ${token.typography('heading', 'xxl', 'bold')}
  }

  span {
    ${token.typography('heading', 'xxl', 'regular')}
  }
`;

export const Description = styled.p`
  ${token.typography('heading', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
  text-align: center;
  margin: -0.75rem 0 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.875rem;
`;

export const SigninButton = styled.button`
  ${token.typography('body', 'md', 'semibold')}
  color: ${token.colors.text.dark};
  background-color: ${token.colors.fill.white};
  border: 1.5px solid ${token.colors.line.normal};
  border-radius: 4px;
  width: 94px;
  padding: 10px 0px;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.fill.neutral};
  }
`;

export const SignupButton = styled.button`
  ${token.typography('body', 'md', 'bold')}
  color: ${token.colors.text.dark};
  background-color: ${token.colors.accent.primary};
  border: none;
  border-radius: 4px;
  width: 94px;
  padding: 10px 0px;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${token.colors.accent.secondary1};
  }
`;

export const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  ${token.flexColumnCenter}
  padding: 2rem 0;
  gap: 0.6rem;
`;

export const FooterLouter = styled.span`
  ${token.typography('body', 'sm', 'regular')}
  color: ${token.colors.text.coolGray};
  letter-spacing: 0.5px;
`;

export const FooterGithub = styled.a`
  ${token.typography('body', 'sm', 'semibold')}
  color: ${token.colors.text.dark};
  text-decoration: none;
  margin-top: 2px;

  &:hover {
    text-decoration: underline;
  }
`;
