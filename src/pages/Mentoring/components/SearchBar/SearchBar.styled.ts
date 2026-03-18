import styled from "styled-components";
import * as token from "@/styles/values/token";

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%
`;

export const SearchInput = styled.input`
  width: 100%;
  height: clamp(2.75rem, 5vw, 2.9375rem);
  background-color: ${token.colors.fill.assistive};
  color: ${token.colors.text.normal};
  border: none;
  padding: 0.5rem 2.5rem 0.5rem 2.5rem;
  ${token.typography("caption", "lg", "regular")}

  &:focus {
    outline: none;
  }
`;

export const LeftIconContainer = styled.div`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
`;

export const RightIconContainer = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
`;

export const IconButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Icon = styled.img`
  width: 1rem;
  object-fit: cover;
`;
